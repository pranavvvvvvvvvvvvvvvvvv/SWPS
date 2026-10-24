import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { firstOf, recordReading } from '../../shared/purification.ts';

/**
 * ESP32 ingestion endpoint — the device posts one reading here.
 * Body: { deviceId, tds, turbidity, temp, level, timestamp? }
 * The device is authenticated by being registered: an unknown code is rejected.
 */
export default async function (req) {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Use POST' }, { status: 405 });
    }

    let body = {};
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const deviceId = String(body.deviceId || body.device_code || '').trim();
    if (!deviceId) {
      return Response.json({ error: 'deviceId is required' }, { status: 400 });
    }

    const values = {
      tds: Number(body.tds),
      turbidity: Number(body.turbidity),
      temperature: Number(body.temp ?? body.temperature),
      level: Number(body.level),
    };

    for (const [key, value] of Object.entries(values)) {
      if (!Number.isFinite(value)) {
        return Response.json({ error: `${key} must be a number` }, { status: 400 });
      }
    }
    if (values.tds < 0 || values.tds > 5000) return Response.json({ error: 'tds out of range' }, { status: 400 });
    if (values.turbidity < 0 || values.turbidity > 3000) return Response.json({ error: 'turbidity out of range' }, { status: 400 });
    if (values.temperature < -10 || values.temperature > 90) return Response.json({ error: 'temp out of range' }, { status: 400 });
    if (values.level < 0 || values.level > 100) return Response.json({ error: 'level out of range' }, { status: 400 });

    const base44 = createClientFromRequest(req);

    const device = firstOf(await base44.asServiceRole.entities.Device.filter({ code: deviceId }, { limit: 1 }));
    if (!device) {
      return Response.json({ error: `Unknown device ${deviceId}` }, { status: 404 });
    }

    const recordedAt = body.timestamp ? new Date(body.timestamp).toISOString() : new Date().toISOString();
    const { reading, evaluation } = await recordReading(base44.asServiceRole, device, values, recordedAt, 'sensor');

    return Response.json({
      ok: true,
      device: device.code,
      reading_id: reading.id,
      recorded_at: recordedAt,
      status: evaluation.status,
      decision: evaluation.decision,
      valve: evaluation.valve,
      failures: evaluation.failures,
    });
  } catch (error) {
    return Response.json({ error: error.message || 'Ingestion failed' }, { status: 500 });
  }
}
