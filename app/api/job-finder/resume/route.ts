import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('resume') as File | null;
    const applicationId = formData.get('applicationId') as string | null;

    if (!file || !applicationId) {
      return NextResponse.json({ error: 'Missing resume or applicationId' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 5 MB)' }, { status: 400 });
    }

    const allowed = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: 'Only PDF or Word documents accepted' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const db = await getDb();
    await db.collection('job_applications').updateOne(
      { _id: new ObjectId(applicationId) },
      {
        $set: {
          resumeFileName: file.name,
          resumeData: buffer.toString('base64'),
          resumeContentType: file.type,
          status: 'resume_uploaded',
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ success: true, fileName: file.name });
  } catch (err) {
    console.error('[job-finder/resume]', err);
    return NextResponse.json({ error: 'Failed to save resume' }, { status: 500 });
  }
}
