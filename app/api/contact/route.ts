import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL || 'Saanvi Careers <onboarding@resend.dev>';
const TO = process.env.RESEND_TO_EMAIL || 'contact@saanvicareers.com';

interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  inquiry_type: string;
  message: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: ContactPayload = await request.json();
    const { name, email, phone, company, inquiry_type, message } = body;

    if (!name || !email || !inquiry_type || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo: email,
      subject: `[${inquiry_type}] New inquiry from ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1e293b">
          <div style="background:#0f172a;padding:20px 24px;border-radius:8px 8px 0 0">
            <h1 style="color:#fff;font-size:18px;margin:0">New Contact Form Submission</h1>
            <p style="color:#94a3b8;font-size:13px;margin:4px 0 0">Saanvi Careers — saanvicareers.com</p>
          </div>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-top:none;padding:24px;border-radius:0 0 8px 8px">
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:8px 0;color:#64748b;font-size:13px;width:120px">Inquiry Type</td><td style="padding:8px 0;font-weight:600;color:#2563eb">${inquiry_type}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b;font-size:13px">Name</td><td style="padding:8px 0;font-weight:500">${name}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b;font-size:13px">Email</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#2563eb">${email}</a></td></tr>
              ${phone ? `<tr><td style="padding:8px 0;color:#64748b;font-size:13px">Phone</td><td style="padding:8px 0">${phone}</td></tr>` : ''}
              ${company ? `<tr><td style="padding:8px 0;color:#64748b;font-size:13px">Company</td><td style="padding:8px 0">${company}</td></tr>` : ''}
            </table>
            <div style="margin-top:16px;padding:16px;background:#fff;border:1px solid #e2e8f0;border-radius:6px">
              <p style="color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;margin:0 0 8px">Message</p>
              <p style="color:#1e293b;font-size:14px;line-height:1.6;margin:0;white-space:pre-wrap">${message}</p>
            </div>
            <p style="color:#94a3b8;font-size:12px;margin:16px 0 0">Reply directly to this email to respond to ${name}.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('[contact] Resend error:', error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[contact] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
