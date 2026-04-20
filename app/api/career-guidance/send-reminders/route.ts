import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL || 'Saanvi Careers <onboarding@resend.dev>';

export async function GET(req: NextRequest) {
  try {
    // Verify cron secret for security (optional but recommended)
    const authHeader = req.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    const now = new Date();
    
    // Find bookings that need reminders
    const bookings = await db
      .collection('career_guidance_bookings')
      .find({
        status: 'confirmed',
        sessionDateTime: { $gt: now },
      })
      .toArray();

    let sixHourRemindersSent = 0;
    let twoHourRemindersSent = 0;

    for (const booking of bookings) {
      const sessionTime = new Date(booking.sessionDateTime);
      const timeDiff = sessionTime.getTime() - now.getTime();
      const hoursUntilSession = timeDiff / (1000 * 60 * 60);

      // Send 6-hour reminder (between 6 and 5.5 hours before)
      if (hoursUntilSession <= 6 && hoursUntilSession > 5.5 && !booking.remindersSent?.sixHours) {
        try {
          await sendReminderEmail(booking, '6 hours');
          await db.collection('career_guidance_bookings').updateOne(
            { _id: booking._id },
            { $set: { 'remindersSent.sixHours': true } }
          );
          sixHourRemindersSent++;
        } catch (error) {
          console.error(`Failed to send 6-hour reminder for booking ${booking._id}:`, error);
        }
      }

      // Send 2-hour reminder (between 2 and 1.5 hours before)
      if (hoursUntilSession <= 2 && hoursUntilSession > 1.5 && !booking.remindersSent?.twoHours) {
        try {
          await sendReminderEmail(booking, '2 hours');
          await db.collection('career_guidance_bookings').updateOne(
            { _id: booking._id },
            { $set: { 'remindersSent.twoHours': true } }
          );
          twoHourRemindersSent++;
        } catch (error) {
          console.error(`Failed to send 2-hour reminder for booking ${booking._id}:`, error);
        }
      }
    }

    return NextResponse.json({
      success: true,
      sixHourRemindersSent,
      twoHourRemindersSent,
      totalBookingsChecked: bookings.length,
    });
  } catch (error) {
    console.error('Send reminders error:', error);
    return NextResponse.json(
      { error: 'Failed to send reminders' },
      { status: 500 }
    );
  }
}

async function sendReminderEmail(booking: any, timeframe: string) {
  const sessionDate = new Date(booking.sessionDateTime);
  const formattedDate = sessionDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = sessionDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const meetingLink = booking.meetingLink || 'Will be shared shortly';

  await resend.emails.send({
    from: FROM,
    to: booking.email,
    replyTo: 'contact@saanvicareers.com',
    subject: `Reminder: Career Guidance Session in ${timeframe}`,
    text: `Hi ${booking.name},\n\nYour career guidance session is starting in ${timeframe}.\n\nDate: ${formattedDate}\nTime: ${formattedTime}\nMeeting Link: ${meetingLink}\n\nSee you soon!\n\nBest regards,\nSaanvi Careers Team`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f6f9fc;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f9fc; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); padding: 40px 40px 30px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">
                      ⏰
                    </h1>
                    <h2 style="margin: 10px 0 0; color: #ffffff; font-size: 24px; font-weight: 700;">
                      Session Starting in ${timeframe}!
                    </h2>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <p style="margin: 0 0 20px; color: #0a2540; font-size: 16px; line-height: 1.6;">
                      Hi <strong>${booking.name}</strong>,
                    </p>
                    <p style="margin: 0 0 30px; color: #425466; font-size: 15px; line-height: 1.6;">
                      This is a friendly reminder that your career guidance session is starting in <strong>${timeframe}</strong>.
                    </p>

                    <!-- Session Details Card -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fff7ed; border-radius: 12px; padding: 24px; margin-bottom: 30px; border: 2px solid #f59e0b;">
                      <tr>
                        <td>
                          <h3 style="margin: 0 0 16px; color: #0a2540; font-size: 18px; font-weight: 600;">
                            📅 Session Details
                          </h3>
                          <table width="100%" cellpadding="8" cellspacing="0">
                            <tr>
                              <td style="color: #697386; font-size: 14px; padding: 8px 0;">
                                <strong>Date:</strong>
                              </td>
                              <td style="color: #0a2540; font-size: 14px; font-weight: 600; text-align: right; padding: 8px 0;">
                                ${formattedDate}
                              </td>
                            </tr>
                            <tr>
                              <td style="color: #697386; font-size: 14px; padding: 8px 0;">
                                <strong>Time:</strong>
                              </td>
                              <td style="color: #0a2540; font-size: 14px; font-weight: 600; text-align: right; padding: 8px 0;">
                                ${formattedTime}
                              </td>
                            </tr>
                            <tr>
                              <td style="color: #697386; font-size: 14px; padding: 8px 0;">
                                <strong>Duration:</strong>
                              </td>
                              <td style="color: #0a2540; font-size: 14px; font-weight: 600; text-align: right; padding: 8px 0;">
                                60 minutes
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    ${timeframe === '2 hours' ? `
                    <!-- Meeting Link (only for 2-hour reminder) -->
                    <div style="background-color: #f0effe; border-left: 4px solid #635bff; padding: 20px; margin-bottom: 30px; border-radius: 8px; text-align: center;">
                      <h3 style="margin: 0 0 12px; color: #0a2540; font-size: 16px; font-weight: 600;">
                        🎥 Join Your Session
                      </h3>
                      <a href="${meetingLink}" 
                         style="display: inline-block; background-color: #635bff; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; margin-top: 10px;">
                        Join Video Call
                      </a>
                      <p style="margin: 12px 0 0; color: #697386; font-size: 12px;">
                        Meeting Link: <a href="${meetingLink}" style="color: #635bff; text-decoration: none;">${meetingLink}</a>
                      </p>
                    </div>
                    ` : ''}

                    <!-- Preparation Tips -->
                    <div style="background-color: #f6f9fc; padding: 20px; margin-bottom: 30px; border-radius: 8px;">
                      <h3 style="margin: 0 0 12px; color: #0a2540; font-size: 16px; font-weight: 600;">
                        💡 Quick Preparation Tips
                      </h3>
                      <ul style="margin: 0; padding-left: 20px; color: #425466; font-size: 14px; line-height: 1.8;">
                        <li>Have your resume ready for review</li>
                        <li>Prepare specific questions or career concerns</li>
                        <li>Find a quiet space with good internet connection</li>
                        <li>Test your camera and microphone</li>
                        <li>Have a notepad ready for key takeaways</li>
                      </ul>
                    </div>

                    <p style="margin: 0; color: #697386; font-size: 13px; line-height: 1.6;">
                      Need to reschedule? Contact us on WhatsApp: 
                      <a href="https://wa.me/918074172398?text=Hi!%20I%20need%20to%20reschedule%20my%20session%20(ID:%20${booking._id})" 
                         style="color: #635bff; text-decoration: none;">+91 8074172398</a>
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f6f9fc; padding: 30px 40px; text-align: center; border-top: 1px solid #e6ebf1;">
                    <p style="margin: 0 0 10px; color: #697386; font-size: 13px;">
                      See you soon! 🚀
                    </p>
                    <p style="margin: 0; color: #8898aa; font-size: 12px;">
                      © ${new Date().getFullYear()} Saanvi Careers. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  });
}
