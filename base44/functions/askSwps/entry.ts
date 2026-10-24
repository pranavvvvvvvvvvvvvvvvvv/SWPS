import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { secrets } from 'base44:runtime';

const KNOWLEDGE = `
SWPS — Smart Water Purification and Quality Monitoring System.
Purpose: an IoT purification unit for rural and mining-affected water sources that filters water and proves it is safe.
Filtration: three stages — 5 micron sediment cartridge, granular activated carbon, reverse-osmosis membrane.
Sensing: analog TDS probe (ppm), optical turbidity sensor (NTU), DS18B20 water temperature (deg C), ultrasonic tank level (%), all read by an ESP32-WROOM-32.
Safe limits (defaults, per unit adjustable): TDS max 500 ppm (warning at 300), turbidity max 5 NTU (warning at 3), temperature 10-30 deg C, water level min 20%.
Adaptive Purification Control: the ESP32 compares every reading with the unit's threshold set on the device. If any parameter fails, the normally-closed outlet solenoid is de-energised (water held back), a re-filtration cycle starts and the cycle counter increments. After repeated failures the unit escalates a critical alert. If all parameters pass, water is released to storage and logged.
Dashboard pages: Live overview (metric cards, trend charts with 1h/24h/7d/30d ranges, purification status), Adaptive control log (each reading, limit breached and action taken), Alerts center (severity, acknowledge, resolve), Map view (all units colour-coded, side-by-side comparison), Maintenance priority (ranked by filter health and cycles), Devices (add/edit/remove units), Thresholds (per unit safe limits), Reports (CSV and PDF export, daily summaries), Manual entry (handheld test-kit readings compared with sensor values), Users and roles.
Roles: admin, health officer, local operator, public viewer.
Deployment: pilot units in three villages — Kothagudem (mining-affected), Ramannagudem and Bhupalpally. The dashboard currently shows seeded demo data plus a device simulator that posts virtual ESP32 readings.
Design choices: control logic runs on the device so a lost connection never stops the valve from closing; readings queue locally and sync when the network returns; filters and probes are plug-in modules for field servicing.
Roadmap: pH and heavy-metal sensing, solar power, ML quality prediction, LoRa mesh backhaul.
Developer: Pranav. Enquiries go through the contact form on the Contact page.
`;

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

    const message = String(body.message || '').slice(0, 700).trim();
    if (!message) return Response.json({ error: 'message is required' }, { status: 400 });

    const history = Array.isArray(body.history) ? body.history.slice(-6) : [];

    const system = `You are the assistant inside the SWPS website. You answer visitor questions about this project, and general questions visitors ask about water, health, sensors, IoT or anything else.

PROJECT FACTS (use only these; never invent numbers, names, prices or results):
${KNOWLEDGE}

STYLE
- Answer in the same language the visitor wrote in (English, Telugu or Hindi).
- Be concise: 2-5 short sentences, plain language, no markdown headings or bullet lists longer than 3 items.
- If the question is about the project, water quality, the hardware or the dashboard, answer directly.
- Questions that are not about SWPS should still be answered helpfully from general knowledge, in the same concise style; make clear when an answer is general guidance rather than a reading from this project.
- Never invent SWPS-specific numbers, names, prices or results. If a project detail is not in the facts above, say the project team would need to confirm it and point to the Contact page.`;

    const contents = history
      .filter((m) => m && m.content && (m.role === 'user' || m.role === 'assistant'))
      .map((m) => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: String(m.content).slice(0, 350) }] }));
    contents.push({ role: 'user', parts: [{ text: message }] });

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${secrets.get('GEMINI_API_KEY')}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents,
          generationConfig: { temperature: 0.4, maxOutputTokens: 600 },
        }),
        signal: AbortSignal.timeout(25000),
      }
    );

    if (!res.ok) {
      const detail = await res.text();
      throw new Error(`Gemini API error ${res.status}: ${detail.slice(0, 200)}`);
    }

    const data = await res.json();
    const answer = (data?.candidates?.[0]?.content?.parts || [])
      .map((part) => part.text || '')
      .join('')
      .trim();

    return Response.json({ answer });
  } catch (error) {
    return Response.json({ error: error.message || 'Assistant unavailable' }, { status: 500 });
  }
}
