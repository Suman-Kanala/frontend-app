import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { key, txnid, amount, productinfo, firstname, email, udf1 } = body;

    const salt = process.env.PAYU_MERCHANT_SALT;

    if (!salt) {
      return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 500 });
    }

    // PayU hash formula: sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT)
    // udf1 = bookingId, udf2-udf5 = empty (but still need pipes)
    // After udf5, there are 10 empty fields (10 pipes) before SALT
    const udf2 = '';
    const udf3 = '';
    const udf4 = '';
    const udf5 = '';
    
    const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    console.log('Hash calculation:', {
      key,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      udf1,
      hashString,
      hash
    });

    return NextResponse.json({ hash });
  } catch (error) {
    console.error('PayU hash generation error:', error);
    return NextResponse.json({ error: 'Failed to generate payment hash' }, { status: 500 });
  }
}
