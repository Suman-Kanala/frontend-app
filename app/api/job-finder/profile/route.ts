import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');

    if (!email && !phone) {
      return NextResponse.json({ error: 'Email or phone is required' }, { status: 400 });
    }

    const db = await getDb();
    
    let result: any = {};

    // Check email verification
    if (email) {
      const existingByEmail = await db.collection('job_applications').findOne({
        email: email.toLowerCase().trim(),
        emailVerified: true
      });
      result.emailVerified = !!existingByEmail;
    }

    // Check phone verification
    if (phone) {
      const existingByPhone = await db.collection('job_applications').findOne({
        phone: phone,
        phoneVerified: true
      });
      result.phoneVerified = !!existingByPhone;
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error('[job-finder/profile GET]', err);
    return NextResponse.json({ error: 'Failed to check verification' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, role, experience, skills, countries, emailVerified, phoneVerified } = body;

    if (!name || !email || !phone || !role || !skills?.length || !countries?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = await getDb();
    
    // Normalize email to lowercase for consistent storage and querying
    const normalizedEmail = email.toLowerCase().trim();
    
    const result = await db.collection('job_applications').insertOne({
      name,
      email: normalizedEmail,
      phone,
      role,
      experience,
      skills,
      countries,
      emailVerified: emailVerified === true,
      phoneVerified: phoneVerified === true,
      resumeFileName: null,
      resumeData: null,
      resumeContentType: null,
      appliedJobs: [],
      status: 'profile_saved',
      createdAt: new Date(),
    });

    return NextResponse.json({ applicationId: result.insertedId.toString() });
  } catch (err) {
    console.error('[job-finder/profile]', err);
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}
