import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { allOf, firstOf, recordReading } from '../../shared/purification.ts';

/**
 * Device simulator — posts fake ESP32 readings so the dashboard works without hardware.
 * Body (optional): { deviceCode?: string, force?: "safe" | "unsafe" }
 */
function drift(previous, base, spread, min, max) {
  const anchor = Number.isFinite(previous) ? previous : base;
  const next = anchor + (Math.random() - 0.5) * spread;
  return Math.round(Math.min(max, Math.max(min, next)) * 10) / 10;
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    let body = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const targetCode = body.deviceCode ? String(body.deviceCode) : null;
    const force = body.force === 'unsafe' ? 'unsafe' : body.force === 'safe' ? 'safe' : null;

    const devices = targetCode
      ? allOf(await base44.entities.Device.filter({ code: targetCode }, { limit: 1 }))
      : allOf(await base44.entities.Device.list({ limit: 20 }));

    if (!devices.length) {
      return Response.json({ error: 'No devices registered' }, { status: 404 });
    }

    const results = [];
    for (const device of devices) {
      const lastReading = firstOf(
        await base44.entities.Reading.filter({ device_code: device.code }, { sort: '-recorded_at', limit: 1 })
      );

      const spike = force === 'unsafe' || (force !== 'safe' && Math.random() < 0.12);
      const values = {
        tds: spike
          ? Math.round(520 + Math.random() * 180)
          : drift(lastReading?.tds, 265, 26, 110, 470),
        turbidity: spike
          ? Math.round((6 + Math.random() * 3) * 10) / 10
          : drift(lastReading?.turbidity, 1.9, 0.7, 0.4, 4.6),
        temperature: drift(lastReading?.temperature, 26, 0.8, 21, 31),
        level: drift(lastReading?.level, 72, 6, 12, 96),
      };

      const now = new Date().toISOString();
      const { evaluation } = await recordReading(base44, device, values, now, 'simulator');
      results.push({
        device: device.code,
        village: device.village,
        ...values,
        status: evaluation.status,
        decision: evaluation.decision,
        valve: evaluation.valve,
      });
    }

    return Response.json({ ok: true, generated: results.length, results, simulated_at: new Date().toISOString() });
  } catch (error) {
    return Response.json({ error: error.message || 'Simulator failed' }, { status: 500 });
  }
}
