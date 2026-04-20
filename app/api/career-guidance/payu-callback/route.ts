import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import crypto from 'crypto';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    // Extract PayU response parameters
    const status = formData.get('status')?.toString();
    const txnid = formData.get('txnid')?.toString();
    const amount = formData.get('amount')?.toString();
    const productinfo = formData.get('productinfo')?.toString();
    const firstname = formData.get('firstname')?.toString();
    const email = formData.get('email')?.toString();
    const udf1 = formData.get('udf1')?.toString(); // bookingId
    const hash = formData.get('hash')?.toString();
    const key = formData.get('key')?.toString();
    const payuMoneyId = formData.get('mihpayid')?.toString();

    const salt = process.env.PAYU_MERCHANT_SALT;

    if (!salt) {
      console.error('PayU salt not configured');
      return NextResponse.redirect(new URL('/?payment=error', req.url));
    }

    // Verify hash for security
    // Reverse hash formula: sha512(salt|status||||||udf1|email|firstname|productinfo|amount|txnid|key)
    const reverseHashString = `${salt}|${status}||||||${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
    const calculatedHash = crypto.createHash('sha512').update(reverseHashString).digest('hex');

    if (calculatedHash !== hash) {
      console.error('Hash verification failed');
      return NextResponse.redirect(new URL('/?payment=error&reason=invalid_hash', req.url));
    }

    const db = await getDb();
    const bookingId = udf1;

    if (!bookingId || !ObjectId.isValid(bookingId)) {
      console.error('Invalid booking ID:', bookingId);
      return NextResponse.redirect(new URL('/?payment=error&reason=invalid_booking', req.url));
    }

    // Update booking based on payment status
    if (status === 'success') {
      // Payment successful
      await db.collection('career_guidance_bookings').updateOne(
        { _id: new ObjectId(bookingId) },
        {
          $set: {
            status: 'confirmed',
            paymentMethod: 'payu',
            paymentId: txnid,
            payuMoneyId: payuMoneyId,
            paymentStatus: 'success',
            paymentCompletedAt: new Date(),
            updatedAt: new Date(),
          },
        }
      );

      // Redirect to success page
      return NextResponse.redirect(new URL('/?payment=success', req.url));
    } else if (status === 'failure') {
      // Payment failed
      await db.collection('career_guidance_bookings').updateOne(
        { _id: new ObjectId(bookingId) },
        {
          $set: {
            status: 'payment_failed',
            paymentStatus: 'failed',
            paymentId: txnid,
            payuMoneyId: payuMoneyId,
            updatedAt: new Date(),
          },
        }
      );

      // Redirect to failure page
      return NextResponse.redirect(new URL('/?payment=failed', req.url));
    } else if (status === 'pending') {
      // Payment pending
      await db.collection('career_guidance_bookings').updateOne(
        { _id: new ObjectId(bookingId) },
        {
          $set: {
            status: 'payment_pending',
            paymentStatus: 'pending',
            paymentId: txnid,
            payuMoneyId: payuMoneyId,
            updatedAt: new Date(),
          },
        }
      );

      // Redirect to pending page
      return NextResponse.redirect(new URL('/?payment=pending', req.url));
    } else {
      // Unknown status
      console.error('Unknown payment status:', status);
      return NextResponse.redirect(new URL('/?payment=error&reason=unknown_status', req.url));
    }
  } catch (error) {
    console.error('PayU callback error:', error);
    return NextResponse.redirect(new URL('/?payment=error', req.url));
  }
}

// Handle GET requests (for testing or direct access)
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const success = searchParams.get('success');
  const bookingId = searchParams.get('bookingId');

  if (success === 'true') {
    return NextResponse.redirect(new URL('/?payment=success', req.url));
  } else {
    return NextResponse.redirect(new URL('/?payment=failed', req.url));
  }
}
