import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Add admin role check
    // const user = await clerkClient.users.getUser(userId);
    // if (!user.publicMetadata?.role || user.publicMetadata.role !== 'admin') {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    // }

    // Await params in Next.js 15+
    const { id } = await params;

    const db = await getDb();
    const application = await db.collection('job_applications').findOne({
      _id: new ObjectId(id),
    });

    if (!application || !application.resumeData || !application.resumeFileName) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(application.resumeData, 'base64');
    
    // Return file with proper headers
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': application.resumeContentType || 'application/pdf',
        'Content-Disposition': `inline; filename="${application.resumeFileName}"`,
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Resume fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
