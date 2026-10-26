import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { secrets } from 'base44:runtime';

const LANG_NAMES = { te: 'Telugu', hi: 'Hindi' };
const MAX_STRINGS = 50;
const MAX_LEN = 1500;

function cacheKey(lang, source) {
  const s = lang + '|' + source;
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

export default async function (req) {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Use POST' }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    let body = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const lang = String(body.lang || '');
    if (!LANG_NAMES[lang]) return Response.json({ error: 'lang must be te or hi' }, { status: 400 });

    const seen = new Set();
    const strings = (Array.isArray(body.strings) ? body.strings : [])
      .map((s) => (typeof s === 'string' ? s.trim() : ''))
      .filter((s) => s.length && s.length <= MAX_LEN && /[a-zA-Z]/.test(s))
      .filter((s) => (seen.has(s) ? false : (seen.add(s), true)))
      .slice(0, MAX_STRINGS);

    if (!strings.length) return Response.json({ translations: {} });

    const keys = strings.map((s) => cacheKey(lang, s));
    const existing = await base44.entities.Translation.filter({ key: { $in: keys } });

    const wanted = new Set(strings);
    const map = {};
    for (const rec of existing || []) {
      if (rec && rec.lang === lang && wanted.has(rec.source)) map[rec.source] = rec.text;
    }

    const missing = strings.filter((s) => !(s in map));
    if (missing.length) {
      const system =
        'You translate user-interface strings of a water-technology website from English into ' +
        LANG_NAMES[lang] +
        '.\n' +
        'Rules:\n' +
        '- Translate the meaning naturally for a general audience. Keep translations compact enough for a UI label.\n' +
        '- Keep these terms unchanged in Latin script: SWPS, ESP32, TDS, NTU, RO, GAC, DS18B20, HC-SR04, ADC, GPIO, Wi-Fi, BLE, HTTPS, MQTT, REST, WebSocket, PWA, JWT, IP65, ppm, WHO, BIS, SCADA, CSV, PDF, SD, MCU, LoRa, Flutter, React Native, Recharts, Leaflet, MongoDB, Firebase, Node.js, Tailwind, React, JSON, API.\n' +
        '- Keep numbers, units, technical symbols and anything that looks like code unchanged.\n' +
        '- Keep person names (Pranav, Dr. Amrita Saha) and place names unchanged.\n' +
        '- The input is a JSON array of English strings. Return a JSON object of the form {"translations": ["...", "..."]} with exactly the same number of items in the same order, each item being the translation of the corresponding input string. Translate each item independently.\n' +
        'Return only JSON.';

      const payload = JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts: [{ text: JSON.stringify(missing) }] }],
        generationConfig: { temperature: 0.15, maxOutputTokens: 16384, responseMimeType: 'application/json' },
      });
      const models = ['gemini-3.5-flash-lite', 'gemini-2.5-flash-lite', 'gemini-flash-lite-latest'];

      let res = null;
      let lastError = '';
      for (const model of models) {
        res = await fetch(
          'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' +
            secrets.get('GEMINI_API_KEY'),
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
            signal: AbortSignal.timeout(30000),
          }
        );
        if (res.ok) break;
        lastError = model + ' -> ' + (await res.text()).slice(0, 160);
        res = null;
      }
      if (!res) throw new Error('Gemini API error: ' + lastError);

      const data = await res.json();
      const raw = (data?.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('');
      let parsed = null;
      try {
        parsed = JSON.parse(raw);
      } catch {
        parsed = null;
      }
      const arr = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.translations) ? parsed.translations : null;

      if (arr) {
        const records = [];
        missing.forEach((src, i) => {
          const out = typeof arr[i] === 'string' && arr[i].trim() ? arr[i].trim() : null;
          if (out) {
            map[src] = out;
            if (out !== src) records.push({ key: cacheKey(lang, src), lang, source: src, text: out });
          }
        });
        if (records.length) await base44.entities.Translation.bulkCreate(records);
      }
    }

    return Response.json({ translations: map });
  } catch (error) {
    return Response.json({ error: error.message || 'Translation unavailable' }, { status: 500 });
  }
}
