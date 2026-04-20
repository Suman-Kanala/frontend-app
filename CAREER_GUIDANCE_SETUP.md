# Career Guidance Service - Setup Guide

## Overview
The Career Guidance service allows users to book 1-on-1 career mentorship sessions with automated email reminders and calendar integration.

## Features Implemented

### ✅ Service Page (`/services/career-guidance`)
- Professional landing page with benefits, testimonials, and process flow
- Responsive design with smooth animations
- "Book Now" CTA buttons throughout the page

### ✅ Booking System
- Multi-step booking modal (Details → Payment → Success)
- Date and time slot selection (next 30 days available)
- Form validation for name, email, phone
- UPI payment integration with QR code
- Payment amount: ₹499 INR
- UPI ID: `9573323563@ybl`

### ✅ Database Storage
- MongoDB collection: `career_guidance_bookings`
- Stores: name, email, phone, date, time, message, amount, status
- Tracks reminder emails sent (6-hour and 2-hour flags)

### ✅ Email Notifications
1. **Confirmation Email** (sent immediately after booking)
   - Professional HTML email template
   - Session details with booking ID
   - Calendar invite (.ics file) attached
   - What to expect and next steps
   - WhatsApp contact link

2. **6-Hour Reminder** (sent 6 hours before session)
   - Reminder with session details
   - Preparation tips
   - Reschedule option

3. **2-Hour Reminder** (sent 2 hours before session)
   - Final reminder with meeting link
   - Quick preparation checklist
   - Join video call button

### ✅ Calendar Integration
- iCalendar (.ics) file attached to confirmation email
- Automatically adds to user's calendar (Google, Outlook, Apple)
- Built-in reminders at 6 hours and 2 hours before session

## Setup Instructions

### 1. Environment Variables
Add these to your `.env.local` file:

```bash
# Resend API (for emails)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=Saanvi Careers <noreply@yourdomain.com>

# MongoDB (already configured)
MONGODB_URI=your_mongodb_connection_string

# Cron Secret (for securing the reminder endpoint)
CRON_SECRET=your_random_secret_key_here
```

### 2. Cron Job Setup

The reminder emails are sent via a cron job that runs every 30 minutes.

#### Option A: Vercel Cron Jobs (Recommended for Production)

1. Create `vercel.json` in your project root:

```json
{
  "crons": [
    {
      "path": "/api/career-guidance/send-reminders",
      "schedule": "*/30 * * * *"
    }
  ]
}
```

2. Deploy to Vercel - cron jobs will run automatically

#### Option B: External Cron Service (cron-job.org, EasyCron, etc.)

1. Sign up for a cron service
2. Create a new cron job with:
   - URL: `https://yourdomain.com/api/career-guidance/send-reminders`
   - Schedule: Every 30 minutes (`*/30 * * * *`)
   - Method: GET
   - Headers: `Authorization: Bearer YOUR_CRON_SECRET`

#### Option C: Local Development

For testing locally, you can manually trigger the reminder endpoint:

```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  http://localhost:3000/api/career-guidance/send-reminders
```

### 3. Testing the Flow

1. **Book a Session:**
   - Go to `/services/career-guidance`
   - Click "Book Your Session Now"
   - Fill in details and select a date/time
   - Complete payment step
   - Check email for confirmation

2. **Test Reminders:**
   - Create a test booking with a session time 5-6 hours in the future
   - Wait for cron job to run (or trigger manually)
   - Check email for 6-hour reminder
   - Create another booking 1-2 hours in the future
   - Check email for 2-hour reminder

### 4. Admin Panel (Optional Enhancement)

You can add an admin view to see all bookings:

```typescript
// app/admin/career-guidance/page.tsx
// Fetch from: GET /api/career-guidance/bookings
// Display table with: name, email, date, time, status
// Actions: view details, send manual reminder, cancel
```

## API Endpoints

### POST `/api/career-guidance/book`
Books a new career guidance session.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 9876543210",
  "date": "2026-05-15",
  "time": "03:00 PM",
  "message": "Optional message"
}
```

**Response:**
```json
{
  "success": true,
  "bookingId": "507f1f77bcf86cd799439011",
  "message": "Booking confirmed successfully"
}
```

### GET `/api/career-guidance/send-reminders`
Sends reminder emails for upcoming sessions (called by cron job).

**Headers:**
```
Authorization: Bearer YOUR_CRON_SECRET
```

**Response:**
```json
{
  "success": true,
  "sixHourRemindersSent": 2,
  "twoHourRemindersSent": 1,
  "totalBookingsChecked": 15
}
```

## Database Schema

### Collection: `career_guidance_bookings`

```typescript
{
  _id: ObjectId,
  name: string,
  email: string,           // lowercase, trimmed
  phone: string,
  date: string,            // YYYY-MM-DD
  time: string,            // "03:00 PM"
  message: string,         // optional
  amount: number,          // 499
  status: string,          // "confirmed", "completed", "cancelled"
  sessionDateTime: Date,   // combined date + time
  remindersSent: {
    sixHours: boolean,
    twoHours: boolean
  },
  createdAt: Date
}
```

## Customization

### Update Meeting Link
Edit `app/api/career-guidance/send-reminders/route.ts`:
```typescript
const meetingLink = 'https://meet.google.com/your-meeting-link';
```

### Change Pricing
Update in multiple places:
- `app/services/career-guidance/page.tsx` (display)
- `src/components/CareerGuidanceBooking.tsx` (booking modal)
- `app/api/career-guidance/book/route.ts` (database)

### Modify Time Slots
Edit `src/components/CareerGuidanceBooking.tsx`:
```typescript
const timeSlots = [
  '09:00 AM', '10:00 AM', // ... add or remove slots
];
```

### Update Email Templates
Edit email HTML in:
- `app/api/career-guidance/book/route.ts` (confirmation)
- `app/api/career-guidance/send-reminders/route.ts` (reminders)

## Troubleshooting

### Emails Not Sending
1. Check Resend API key is valid
2. Verify `RESEND_FROM_EMAIL` domain is verified in Resend
3. Check Resend dashboard for error logs

### Reminders Not Sending
1. Verify cron job is running (check Vercel logs or cron service)
2. Check `CRON_SECRET` matches in env and cron config
3. Manually trigger endpoint to test: `/api/career-guidance/send-reminders`
4. Check MongoDB for `remindersSent` flags

### Calendar Invite Not Working
1. Verify `.ics` file is being attached (check email source)
2. Test with different email clients (Gmail, Outlook, Apple Mail)
3. Check iCalendar format in `sendConfirmationEmail` function

## Production Checklist

- [ ] Set up Resend account and verify domain
- [ ] Configure environment variables in production
- [ ] Set up Vercel cron jobs or external cron service
- [ ] Test booking flow end-to-end
- [ ] Test reminder emails with real timing
- [ ] Update meeting link to actual video call URL
- [ ] Set up monitoring for failed emails
- [ ] Add admin panel for managing bookings (optional)
- [ ] Configure payment verification (currently manual)

## Support

For issues or questions:
- WhatsApp: +91 8074172398
- Email: support@saanvicareers.com

---

**Last Updated:** April 2026
**Version:** 1.0.0
