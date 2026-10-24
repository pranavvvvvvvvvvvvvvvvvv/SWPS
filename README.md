# SWPS — Smart Water Purification and Quality Monitoring System

An IoT project for rural and mining-affected communities. A purification unit filters raw water
through sediment, activated carbon and RO stages, measures TDS, turbidity, temperature and water
level with an ESP32, and uses **Adaptive Purification Control** to hold back water and re-filter
whenever a reading leaves its safe envelope.

The app has two parts:

- **Public project site** — problem, how it works, architecture, technology, prototype gallery,
  research paper, team and contact.
- **Monitoring dashboard** (sign-in required) — live readings, adaptive control timeline, alerts,
  multi-unit map, maintenance priority, device and threshold management, reports, manual test-kit
  cross-checks and user roles.

---

## Stack in this deployment

The original brief describes Node.js + Express + MongoDB + WebSocket. This deployment implements the
same behaviour on the Base44 platform:

| Brief | Implemented as |
| --- | --- |
| Express REST API | `ingestReading` backend function (`POST`-style JSON endpoint) |
| MongoDB collections | Entities: `Device`, `Reading`, `Alert`, `Threshold`, `ControlLog`, `ManualReading`, `ContactMessage` |
| WebSocket live channel | Client polling every 20–30 s + on-demand simulator (see notes below) |
| JWT roles | Platform auth + `User.duty_role` (`admin`, `health_officer`, `operator`, `viewer`) |
| Device simulator script | `runSimulator` backend function, runnable from the dashboard header |

### Backend functions

| Function | Purpose | Auth |
| --- | --- | --- |
| `ingestReading` | Receives one ESP32 payload, evaluates it against the unit's thresholds, writes the reading, control log, alert and device state | Device must be registered (`deviceId` = `Device.code`) |
| `runSimulator` | Posts a realistic fake reading for one or all units; can force a safe/unsafe event | Signed-in user |

Shared control logic lives in `base44/shared/purification.ts` and is imported by both functions, so
the decision rule exists in exactly one place.

### API endpoints

```
POST /functions/ingestReading
{
  "deviceId":  "SW-02",
  "tds":       286,
  "turbidity": 1.8,
  "temp":      26.4,
  "level":     72,
  "timestamp": "2026-10-23T11:42:00+05:30"
}
```

Response includes the decision the controller took:

```json
{ "ok": true, "status": "safe", "decision": "safe", "valve": "released", "failures": [] }
```

Reads and management are done through the SDK/entities (`Reading`, `Device`, `Alert`, `Threshold`,
`ControlLog`) — the dashboard pages show the exact filters used, including time-range queries on
`recorded_at`.

---

## Device simulator without hardware

1. Sign in and open **Dashboard**.
2. Press **Run simulator** in the header — one reading is posted for every unit.
3. To force an unsafe event (valve held, alert raised, re-filter cycle): call the function with
   `{ "deviceCode": "SW-02", "force": "unsafe" }`.

The ESP32 firmware equivalent is a 30-second loop that reads all four probes and posts the payload
above to `ingestReading`.

---

## Safe limits

Defaults follow WHO drinking-water guidance and can be overridden per unit under
**Dashboard → Thresholds**:

| Parameter | Default limit |
| --- | --- |
| TDS | ≤ 500 ppm (warning at 300) |
| Turbidity | ≤ 5 NTU (warning at 3) |
| Temperature | 10–30 °C |
| Water level | ≥ 20 % |

---

## Seeded data

5 units across 3 villages (Kothagudem — mining-affected, Ramannagudem, Bhupalpally), 30 days of
readings, control-log decisions, alerts at each severity, and three manual test-kit cross-checks.

## Notes and limitations

- Live updates use a 20–30 s poll rather than a WebSocket connection; the data path and UI states
  are identical.
- Email/SMS/push delivery is recorded as notification hooks on each alert. Connecting a delivery
  provider is a configuration step on the platform, not application code.
- The demo video slot on the Prototype page is a placeholder until the final recording is added.

## Accessibility and i18n

- English, Telugu and Hindi toggle in the header (navigation, hero and dashboard labels).
- Light and dark themes, keyboard focus rings, skip link, WCAG-AA contrast for status colours.
- Mobile-first layout; installable as a PWA with the last readings cached for offline viewing.

## Developed by

**Pranav** — see the Developer card on the Team and Contact pages.
© 2026 Smart Water Purification and Quality Monitoring System.

## Access

The whole site sits behind sign-in: opening any page while signed out redirects to the login page,
which links to sign-up, password reset and Google sign-in. The project assistant (floating button,
bottom right, public site and dashboard) answers project questions through the `askSwps` backend
function.
