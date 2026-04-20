import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL || 'Saanvi Careers <onboarding@resend.dev>';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, date, time, message, paymentId, paymentMethod } = body;

    // Validation
    if (!name || !email || !phone || !date || !time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const db = await getDb();
    
    // Generate unique meeting link (you can integrate with Google Meet, Zoom, etc.)
    const meetingId = generateMeetingId();
    const meetingLink = `https://meet.google.com/${meetingId}`; // Replace with actual meeting service
    
    // Determine initial status based on payment method
    let initialStatus = 'pending_verification';
    if (paymentMethod === 'payu_pending') {
      initialStatus = 'payment_pending';
    } else if (paymentMethod === 'payu') {
      initialStatus = 'confirmed';
    } else if (paymentMethod === 'upi_manual') {
      initialStatus = 'pending_verification';
    }

    // Create booking in database
    const booking = await db.collection('career_guidance_bookings').insertOne({
      name,
      email: email.toLowerCase().trim(),
      phone,
      date,
      time,
      message: message || '',
      amount: 499,
      paymentId: paymentId || null,
      paymentMethod: paymentMethod || 'upi_manual',
      status: initialStatus,
      meetingLink,
      createdAt: new Date(),
      sessionDateTime: new Date(`${date}T${convertTo24Hour(time)}`),
      remindersSent: {
        sixHours: false,
        twoHours: false,
      },
    });

    const bookingId = booking.insertedId.toString();

    // Only send confirmation emails for confirmed bookings (not for pending PayU payments)
    if (initialStatus !== 'payment_pending') {
      // Send confirmation email to user
      try {
        await sendConfirmationEmail(name, email, date, time, bookingId, meetingLink);
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
      }

      // Send notification to admin
      try {
        await sendAdminNotification(name, email, phone, date, time, bookingId, paymentMethod);
      } catch (emailError) {
        console.error('Failed to send admin notification:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      bookingId,
      meetingLink,
      message: 'Booking confirmed successfully',
    });
  } catch (error) {
    console.error('Career guidance booking error:', error);
    return NextResponse.json(
      { error: 'Failed to process booking' },
      { status: 500 }
    );
  }
}

// Generate unique meeting ID
function generateMeetingId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const segments = 3;
  const segmentLength = 4;
  
  let id = '';
  for (let i = 0; i < segments; i++) {
    if (i > 0) id += '-';
    for (let j = 0; j < segmentLength; j++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }
  return id;
}

// Helper function to convert 12-hour time to 24-hour format
function convertTo24Hour(time12h: string): string {
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  
  if (hours === '12') {
    hours = '00';
  }
  
  if (modifier === 'PM') {
    hours = String(parseInt(hours, 10) + 12);
  }
  
  return `${hours.padStart(2, '0')}:${minutes}:00`;
}

// Send confirmation email with calendar invite
async function sendConfirmationEmail(
  name: string,
  email: string,
  date: string,
  time: string,
  bookingId: string,
  meetingLink: string
) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Create iCalendar format for calendar invite
  const sessionDateTime = new Date(`${date}T${convertTo24Hour(time)}`);
  const endDateTime = new Date(sessionDateTime.getTime() + 60 * 60 * 1000); // 1 hour session

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Saanvi Careers//Career Guidance//EN
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
UID:${bookingId}@saanvicareers.com
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(sessionDateTime)}
DTEND:${formatICSDate(endDateTime)}
SUMMARY:Career Guidance Session with Saanvi Careers
DESCRIPTION:Your personalized 1-on-1 career guidance session.\\n\\nMeeting Link: ${meetingLink}\\n\\nWhat to bring:\\n- Your resume\\n- Career questions\\n- Notepad for key takeaways
LOCATION:${meetingLink}
STATUS:CONFIRMED
SEQUENCE:0
TRANSP:OPAQUE
BEGIN:VALARM
TRIGGER:-PT2H
DESCRIPTION:Career Guidance Session in 2 hours
ACTION:DISPLAY
END:VALARM
BEGIN:VALARM
TRIGGER:-PT6H
DESCRIPTION:Career Guidance Session in 6 hours
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR`;

  await resend.emails.send({
    from: FROM,
    to: email,
    replyTo: 'contact@saanvicareers.com',
    subject: 'Your Career Guidance Session is Confirmed',
    text: `Hi ${name},\n\nYour career guidance session is confirmed for ${formattedDate} at ${time}.\n\nMeeting Link: ${meetingLink}\nBooking ID: ${bookingId}\n\nWe look forward to helping you achieve your career goals!\n\nBest regards,\nSaanvi Careers Team`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Career Guidance Session Confirmed</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7fa; padding: 20px 0;">
          <tr>
            <td align="center">
              <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                
                <!-- Header -->
                <tr>
                  <td style="background-color: #635bff; padding: 32px 40px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">
                      Session Confirmed
                    </h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <p style="margin: 0 0 16px; color: #1a1a1a; font-size: 16px; line-height: 1.5;">
                      Hello ${name},
                    </p>
                    <p style="margin: 0 0 24px; color: #4a5568; font-size: 15px; line-height: 1.6;">
                      Thank you for booking a career guidance session with Saanvi Careers. Your session has been confirmed and we're excited to help you achieve your career goals.
                    </p>

                    <!-- Session Details -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fb; border-radius: 6px; padding: 20px; margin-bottom: 24px;">
                      <tr>
                        <td>
                          <h2 style="margin: 0 0 16px; color: #1a1a1a; font-size: 16px; font-weight: 600;">
                            Session Details
                          </h2>
                          <table role="presentation" width="100%" cellpadding="6" cellspacing="0">
                            <tr>
                              <td style="color: #6b7280; font-size: 14px; padding: 6px 0;">Date:</td>
                              <td style="color: #1a1a1a; font-size: 14px; font-weight: 500; text-align: right; padding: 6px 0;">
                                ${formattedDate}
                              </td>
                            </tr>
                            <tr>
                              <td style="color: #6b7280; font-size: 14px; padding: 6px 0;">Time:</td>
                              <td style="color: #1a1a1a; font-size: 14px; font-weight: 500; text-align: right; padding: 6px 0;">
                                ${time}
                              </td>
                            </tr>
                            <tr>
                              <td style="color: #6b7280; font-size: 14px; padding: 6px 0;">Duration:</td>
                              <td style="color: #1a1a1a; font-size: 14px; font-weight: 500; text-align: right; padding: 6px 0;">
                                60 minutes
                              </td>
                            </tr>
                            <tr>
                              <td style="color: #6b7280; font-size: 14px; padding: 6px 0;">Booking ID:</td>
                              <td style="color: #635bff; font-size: 12px; font-family: monospace; text-align: right; padding: 6px 0;">
                                ${bookingId}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Meeting Link -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                      <tr>
                        <td align="center" style="padding: 20px; background-color: #f0effe; border-radius: 6px;">
                          <p style="margin: 0 0 12px; color: #1a1a1a; font-size: 14px; font-weight: 600;">
                            Join Your Session
                          </p>
                          <a href="${meetingLink}" style="display: inline-block; background-color: #635bff; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: 600; font-size: 14px;">
                            Join Video Call
                          </a>
                          <p style="margin: 12px 0 0; color: #6b7280; font-size: 12px;">
                            Link: <a href="${meetingLink}" style="color: #635bff; text-decoration: none;">${meetingLink}</a>
                          </p>
                        </td>
                      </tr>
                    </table>

                    <!-- What to Prepare -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fb; border-radius: 6px; padding: 20px; margin-bottom: 24px;">
                      <tr>
                        <td>
                          <h3 style="margin: 0 0 12px; color: #1a1a1a; font-size: 15px; font-weight: 600;">
                            What to Prepare
                          </h3>
                          <ul style="margin: 0; padding-left: 20px; color: #4a5568; font-size: 14px; line-height: 1.7;">
                            <li>Your current resume</li>
                            <li>Specific career questions or concerns</li>
                            <li>Notepad for key takeaways</li>
                            <li>Quiet space with stable internet</li>
                          </ul>
                        </td>
                      </tr>
                    </table>

                    <!-- Reminders -->
                    <p style="margin: 0 0 16px; color: #4a5568; font-size: 14px; line-height: 1.6;">
                      You will receive email reminders 6 hours and 2 hours before your session. A calendar invite is attached to this email.
                    </p>

                    <!-- Support -->
                    <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.6;">
                      Need to reschedule or have questions? Contact us at 
                      <a href="mailto:contact@saanvicareers.com" style="color: #635bff; text-decoration: none;">contact@saanvicareers.com</a>
                      or WhatsApp <a href="https://wa.me/918074172398" style="color: #635bff; text-decoration: none;">+91 8074172398</a>
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fb; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px;">
                      Looking forward to our session!
                    </p>
                    <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                      Saanvi Careers | Professional Career Guidance
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
    attachments: [
      {
        filename: 'career-session.ics',
        content: Buffer.from(icsContent).toString('base64'),
      },
    ],
  });
}

// Send notification to admin
async function sendAdminNotification(
  name: string,
  email: string,
  phone: string,
  date: string,
  time: string,
  bookingId: string,
  paymentMethod: string
) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  await resend.emails.send({
    from: FROM,
    to: 'contact@saanvicareers.com',
    subject: `New Career Guidance Booking - ${name}`,
    text: `New booking received:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nDate: ${formattedDate}\nTime: ${time}\nPayment: ${paymentMethod}\nBooking ID: ${bookingId}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7fa; padding: 20px 0;">
          <tr>
            <td align="center">
              <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                <tr>
                  <td style="background-color: #10b981; padding: 24px 32px;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 600;">
                      New Booking Received
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 32px;">
                    <h2 style="margin: 0 0 16px; color: #1a1a1a; font-size: 16px; font-weight: 600;">
                      Booking Details
                    </h2>
                    <table role="presentation" width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="color: #6b7280; font-size: 14px;">Name:</td>
                        <td style="color: #1a1a1a; font-size: 14px; font-weight: 500;">${name}</td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280; font-size: 14px;">Email:</td>
                        <td style="color: #1a1a1a; font-size: 14px; font-weight: 500;">${email}</td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280; font-size: 14px;">Phone:</td>
                        <td style="color: #1a1a1a; font-size: 14px; font-weight: 500;">${phone}</td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280; font-size: 14px;">Date:</td>
                        <td style="color: #1a1a1a; font-size: 14px; font-weight: 500;">${formattedDate}</td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280; font-size: 14px;">Time:</td>
                        <td style="color: #1a1a1a; font-size: 14px; font-weight: 500;">${time}</td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280; font-size: 14px;">Payment:</td>
                        <td style="color: #1a1a1a; font-size: 14px; font-weight: 500;">${paymentMethod === 'razorpay' ? 'Razorpay (Confirmed)' : 'UPI Manual (Pending Verification)'}</td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280; font-size: 14px;">Booking ID:</td>
                        <td style="color: #635bff; font-size: 12px; font-family: monospace;">${bookingId}</td>
                      </tr>
                    </table>
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

// Format date for iCalendar
function formatICSDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}
