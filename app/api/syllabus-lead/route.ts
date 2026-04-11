import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL || 'Saanvi Careers <onboarding@resend.dev>';
const TO = process.env.RESEND_TO_EMAIL || 'contact@saanvicareers.com';

interface LeadPayload {
  name: string;
  email: string;
  phone: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { name, email, phone }: LeadPayload = await request.json();

    if (!name || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo: email,
      subject: `[Gen AI Program] Syllabus Download — ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1e293b">
          <div style="background:#0f172a;padding:20px 24px;border-radius:8px 8px 0 0">
            <h1 style="color:#fff;font-size:18px;margin:0">Gen AI Program — Syllabus Download Lead</h1>
            <p style="color:#94a3b8;font-size:13px;margin:4px 0 0">Saanvi Careers</p>
          </div>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-top:none;padding:24px;border-radius:0 0 8px 8px">
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:8px 0;color:#64748b;font-size:13px;width:80px">Name</td><td style="padding:8px 0;font-weight:500">${name}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b;font-size:13px">Email</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#2563eb">${email}</a></td></tr>
              <tr><td style="padding:8px 0;color:#64748b;font-size:13px">Phone</td><td style="padding:8px 0">${phone}</td></tr>
            </table>
            <p style="color:#94a3b8;font-size:12px;margin:16px 0 0">This lead downloaded the Gen AI Program syllabus PDF from saanvicareers.com</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('[syllabus-lead] Resend error:', error);
      // Don't fail — still allow the download
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[syllabus-lead] Unexpected error:', err);
    // Don't fail — still allow the download
    return NextResponse.json({ success: true });
  }
}
