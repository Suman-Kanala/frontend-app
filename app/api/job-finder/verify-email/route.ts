import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL || 'Saanvi Careers <onboarding@resend.dev>';

// In-memory OTP store (for production, use Redis or database)
const otpStore = new Map<string, { otp: string; expires: number }>();

// Clean expired OTPs every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [email, data] of otpStore.entries()) {
    if (data.expires < now) otpStore.delete(email);
  }
}, 10 * 60 * 1000);

export async function POST(req: NextRequest) {
  try {
    const { action, email, otp } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // ── SEND OTP ────────────────────────────────────────────────────
    if (action === 'send') {
      // Generate 6-digit OTP
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store with 10-minute expiry
      otpStore.set(email.toLowerCase(), {
        otp: code,
        expires: Date.now() + 10 * 60 * 1000,
      });

      // Send email
      try {
        await resend.emails.send({
          from: FROM,
          to: email,
          subject: 'Verify your email - Saanvi Careers',
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px;">
              <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="color: #0a2540; font-size: 24px; font-weight: 700; margin: 0;">Saanvi Careers</h1>
              </div>
              
              <div style="background: #f6f9fc; border-radius: 16px; padding: 32px; text-align: center;">
                <h2 style="color: #0a2540; font-size: 20px; font-weight: 600; margin: 0 0 16px 0;">
                  Verify your email
                </h2>
                <p style="color: #425466; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
                  Enter this code in the Job Finder form to continue:
                </p>
                
                <div style="background: white; border: 2px solid #635bff; border-radius: 12px; padding: 20px; margin: 0 0 24px 0;">
                  <div style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #635bff;">
                    ${code}
                  </div>
                </div>
                
                <p style="color: #697386; font-size: 12px; margin: 0;">
                  This code expires in 10 minutes. If you didn't request this, please ignore this email.
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 32px;">
                <p style="color: #8898aa; font-size: 12px; margin: 0;">
                  © ${new Date().getFullYear()} Saanvi Careers. All rights reserved.
                </p>
              </div>
            </div>
          `,
        });

        return NextResponse.json({ success: true, message: 'OTP sent to your email' });
      } catch (emailError) {
        console.error('Resend error:', emailError);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
      }
    }

    // ── VERIFY OTP ──────────────────────────────────────────────────
    if (action === 'verify') {
      if (!otp) {
        return NextResponse.json({ error: 'OTP required' }, { status: 400 });
      }

      const stored = otpStore.get(email.toLowerCase());
      
      if (!stored) {
        return NextResponse.json({ error: 'No OTP found. Please request a new one.' }, { status: 400 });
      }

      if (stored.expires < Date.now()) {
        otpStore.delete(email.toLowerCase());
        return NextResponse.json({ error: 'OTP expired. Please request a new one.' }, { status: 400 });
      }

      if (stored.otp !== otp.trim()) {
        return NextResponse.json({ error: 'Invalid OTP. Please try again.' }, { status: 400 });
      }

      // Success - remove OTP
      otpStore.delete(email.toLowerCase());
      return NextResponse.json({ success: true, verified: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Verify email error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
