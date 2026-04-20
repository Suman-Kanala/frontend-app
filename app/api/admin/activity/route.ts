import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getDb } from '@/lib/mongodb';

export async function GET(req: NextRequest) {
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

    const db = await getDb();
    
    // Fetch all job applications from MongoDB
    const applications = await db
      .collection('job_applications')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Transform data to match frontend interface
    const formattedApplications = applications.map((app) => ({
      id: app._id.toString(),
      name: app.name || '',
      email: app.email || '',
      phone: app.phone || '',
      role: app.role || '',
      experience: app.experience || '',
      skills: Array.isArray(app.skills) ? app.skills : [],
      countries: Array.isArray(app.countries) ? app.countries : [],
      resumeUrl: app.resumeFileName ? `/api/admin/activity/resume/${app._id.toString()}` : undefined,
      appliedJobs: Array.isArray(app.appliedJobs)
        ? app.appliedJobs.map((job: any) => ({
            title: job.title || '',
            company: job.company || '',
            location: job.location || '',
          }))
        : [],
      createdAt: app.createdAt ? new Date(app.createdAt).toISOString() : new Date().toISOString(),
      emailVerified: app.emailVerified === true,
    }));

    return NextResponse.json({
      applications: formattedApplications,
      total: formattedApplications.length,
    });
  } catch (error) {
    console.error('Admin activity error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
