# Payment Gateway Setup Guide - PayU

## Why PayU?
- ✅ **Widely used in India** - Trusted by millions
- ✅ **All payment methods** - UPI, Cards, Net Banking, Wallets
- ✅ **Competitive fees** - 2-3% per transaction
- ✅ **Easy integration** - Simple form POST method
- ✅ **Test mode** - Test without real money
- ✅ **Instant settlements** - Quick payouts

## Current Configuration

Your PayU credentials are already configured in `.env.local`:

```bash
NEXT_PUBLIC_PAYU_MERCHANT_KEY=wOocRw
PAYU_MERCHANT_SALT=kGj6zEBm7EH3IbWuW0S4LZnCVHtcB7ek
NEXT_PUBLIC_PAYU_MODE=test
```

## Step 1: Understanding PayU Test Mode

Your current credentials are **test credentials**. In test mode:
- No real money is charged
- You can test all payment flows
- Use test cards/UPI for testing

### Test Payment Methods

**Test Cards:**
- **Success**: Card Number: `5123456789012346`, CVV: `123`, Expiry: Any future date
- **Failure**: Card Number: `4111111111111111`, CVV: `123`, Expiry: Any future date

**Test UPI:**
- **Success**: Use UPI ID: `success@payu`
- **Failure**: Use UPI ID: `failure@payu`

**Test Net Banking:**
- Select any bank
- Use credentials provided on PayU test page

## Step 2: Get Live Credentials (For Production)

1. Go to [https://dashboard.payu.in/signup](https://dashboard.payu.in/signup)
2. Sign up with your business details
3. Complete KYC verification:
   - PAN Card
   - Bank Account Details
   - Business Registration (if applicable)
   - GST Number (if applicable)
4. Once approved, get your live credentials:
   - **Merchant Key** (starts with live key)
   - **Merchant Salt** (keep this secret!)

## Step 3: Configure for Production

Update `.env.production`:

```bash
# PayU Live Keys (for production)
NEXT_PUBLIC_PAYU_MERCHANT_KEY=your_live_merchant_key
PAYU_MERCHANT_SALT=your_live_merchant_salt
NEXT_PUBLIC_PAYU_MODE=live
```

## Step 4: Test Payment Flow

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Go to `/services/career-guidance`

3. Click "Book Your Session Now"

4. Fill in details and click "Continue to Payment"

5. Click "Pay ₹499 Now" (PayU option)

6. You'll be redirected to PayU payment page

7. Use test credentials mentioned above

8. After payment, you'll be redirected back with status

## Step 5: Verify Payment Callback

The payment callback is handled at `/api/career-guidance/payu-callback`:

**Success Flow:**
1. User completes payment on PayU
2. PayU redirects to callback URL with payment details
3. Callback verifies hash for security
4. Updates booking status to "confirmed"
5. Redirects user to homepage with success message
6. User sees green toast: "Payment Successful!"

**Failure Flow:**
1. Payment fails on PayU
2. PayU redirects to callback URL
3. Booking status updated to "payment_failed"
4. User redirected with failure message
5. User sees red toast: "Payment Failed"

**Pending Flow:**
1. Payment is pending (e.g., net banking)
2. Booking status updated to "payment_pending"
3. User sees amber toast: "Payment Pending"

## Step 6: Security Features

✅ **Hash Verification**: Every callback is verified using SHA-512 hash
✅ **Booking ID Validation**: Ensures booking exists before updating
✅ **Status Tracking**: Tracks payment status in MongoDB
✅ **Error Handling**: Graceful error handling with user-friendly messages

## Alternative: UPI QR Code (No Gateway Needed)

If you don't want to use PayU, users can still pay via UPI QR code:

1. User scans QR code with any UPI app
2. Pays ₹499 to `9573323563@ybl`
3. Clicks "I've Paid via UPI"
4. Booking marked as "pending_verification"
5. Admin manually verifies payment

## Email Delivery Issues - Solutions

### Issue: Emails not reaching contact@saanvicareers.com

**Solution 1: Verify Domain in Resend**
1. Go to [Resend Dashboard](https://resend.com/domains)
2. Add domain: `saanvicareers.com`
3. Add DNS records provided by Resend:
   - SPF record
   - DKIM record
   - DMARC record
4. Wait for verification (can take up to 48 hours)
5. Once verified, emails will have better deliverability

**Solution 2: Use Gmail SMTP (Temporary)**
If domain verification takes time, use Gmail:

```bash
# In .env.local
RESEND_FROM_EMAIL=your-gmail@gmail.com
RESEND_TO_EMAIL=contact@saanvicareers.com
```

**Solution 3: Check Spam Folder**
- Check spam/junk folder in contact@saanvicareers.com
- Mark emails from Resend as "Not Spam"
- Add sender to contacts

**Solution 4: Email Forwarding**
Set up email forwarding:
- Forward contact@saanvicareers.com → your-personal-email@gmail.com
- This ensures you receive all notifications

### Professional Email Template Features (Anti-Spam)

Our email templates include:
- ✅ Plain text version (required by spam filters)
- ✅ Proper HTML structure with semantic tags
- ✅ No suspicious keywords or excessive caps
- ✅ Unsubscribe link (optional but recommended)
- ✅ Physical address (optional but recommended)
- ✅ Proper sender authentication (SPF, DKIM)
- ✅ Reply-To header set to contact@saanvicareers.com
- ✅ Clean, professional design
- ✅ No tracking pixels or suspicious links

## Meeting Link Generation

Currently using placeholder Google Meet links. To integrate real meeting service:

### Option 1: Google Meet API
```typescript
// Install: npm install googleapis
import { google } from 'googleapis';

async function createGoogleMeetLink() {
  const calendar = google.calendar('v3');
  const event = await calendar.events.insert({
    calendarId: 'primary',
    conferenceDataVersion: 1,
    requestBody: {
      summary: 'Career Guidance Session',
      start: { dateTime: sessionDateTime },
      end: { dateTime: endDateTime },
      conferenceData: {
        createRequest: { requestId: bookingId }
      }
    }
  });
  return event.data.hangoutLink;
}
```

### Option 2: Zoom API
```typescript
// Install: npm install @zoom/meetingsdk
import { ZoomMtg } from '@zoom/meetingsdk';

async function createZoomMeeting() {
  const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ZOOM_JWT_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      topic: 'Career Guidance Session',
      type: 2,
      start_time: sessionDateTime,
      duration: 60
    })
  });
  const data = await response.json();
  return data.join_url;
}
```

### Option 3: Manual (Current Implementation)
- Meeting link generated as placeholder
- Admin manually creates meeting and updates link
- Or use fixed meeting room for all sessions

## Production Checklist

- [ ] Get PayU live credentials from dashboard.payu.in
- [ ] Complete KYC verification
- [ ] Update `.env.production` with live keys
- [ ] Change `NEXT_PUBLIC_PAYU_MODE` to `live`
- [ ] Verify domain in Resend for email delivery
- [ ] Test email delivery to contact@saanvicareers.com
- [ ] Set up email forwarding if needed
- [ ] Integrate real meeting service (Google Meet/Zoom)
- [ ] Test complete booking flow with real payment
- [ ] Set up cron job for reminder emails
- [ ] Monitor payment callbacks and logs
- [ ] Add payment reconciliation process
- [ ] Test all payment scenarios (success, failure, pending)

## Testing Checklist

- [ ] Test PayU payment with test card (success scenario)
- [ ] Test PayU payment with test card (failure scenario)
- [ ] Test UPI QR code payment flow
- [ ] Verify confirmation email received
- [ ] Verify admin notification received
- [ ] Check calendar invite attachment
- [ ] Test meeting link in email
- [ ] Test reminder emails (6 hours and 2 hours)
- [ ] Verify booking saved in MongoDB
- [ ] Test payment callback hash verification
- [ ] Test form validation
- [ ] Test payment status toasts on homepage

## Support

For issues:
- **PayU Support**: [https://payu.in/contact-us](https://payu.in/contact-us)
- **PayU Docs**: [https://docs.payu.in](https://docs.payu.in)
- **Resend Support**: support@resend.com
- **WhatsApp**: +91 8074172398

## Troubleshooting

### Payment Not Redirecting Back
- Check callback URLs in PayU dashboard
- Verify `surl` and `furl` parameters are correct
- Check server logs for errors

### Hash Verification Failed
- Ensure salt is correct in `.env.local`
- Check hash formula matches PayU documentation
- Verify all parameters are in correct order

### Emails Not Received
- Check spam folder
- Verify Resend API key is valid
- Check domain verification status
- Test with different email addresses

### Booking Not Updated After Payment
- Check MongoDB connection
- Verify booking ID is valid
- Check callback handler logs
- Ensure database permissions are correct

## Cost Breakdown

### PayU Fees
- **Transaction Fee**: 2-3% per transaction (varies by payment method)
- **For ₹499**: Fee = ₹10-15 approx
- **You receive**: ₹484-489 approx
- **Setup fee**: May vary based on account type

### Resend Pricing
- **Free Tier**: 3,000 emails/month
- **Paid**: $20/month for 50,000 emails
- **Current usage**: ~3 emails per booking (confirmation + 2 reminders)

### Total Cost Per Booking
- **Payment Gateway**: ₹10-15 (2-3%)
- **Email Service**: Free (under 3,000/month)
- **Total**: ₹10-15 per booking

---

**Last Updated:** April 2026
