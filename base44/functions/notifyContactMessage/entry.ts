import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

const RECIPIENT = 'chpranav559@gmail.com';

/** Sends the developer an email notification for a new contact message.
 *  Narrowly scoped: only the four contact-form fields, all length-bounded. */
export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const name = String(body.name || '').slice(0, 120).trim();
    const email = String(body.email || '').slice(0, 200).trim();
    const subject = String(body.subject || 'General enquiry').slice(0, 200).trim();
    const message = String(body.message || '').slice(0, 4000).trim();
    if (!name || !message) {
      return Response.json({ error: 'Missing name or message' }, { status: 400 });
    }

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: RECIPIENT,
      subject: `SWPS contact: ${subject}`,
      text:
        `New contact message from the SWPS website.\n\n` +
        `From: ${name} <${email}>\n` +
        `Subject: ${subject}\n\n${message}`,
    });

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
