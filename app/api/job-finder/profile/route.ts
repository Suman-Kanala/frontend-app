import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, role, experience, skills, countries } = body;

    if (!name || !email || !role || !skills?.length || !countries?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.collection('job_applications').insertOne({
      name,
      email,
      phone: phone || '',
      role,
      experience,
      skills,
      countries,
      resumeFileName: null,
      resumeData: null,
      resumeContentType: null,
      status: 'profile_saved',
      createdAt: new Date(),
    });

    return NextResponse.json({ applicationId: result.insertedId.toString() });
  } catch (err) {
    console.error('[job-finder/profile]', err);
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}
