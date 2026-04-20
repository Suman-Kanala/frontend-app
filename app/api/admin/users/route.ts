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
    
    // Fetch all job applications from MongoDB (this is our user data)
    const applications = await db
      .collection('job_applications')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Transform data to user format
    const formattedUsers = applications.map((app) => ({
      id: app._id.toString(),
      name: app.name || '',
      email: app.email || '',
      phone: app.phone || '',
      role: app.role || '',
      experience: app.experience || '',
      skills: Array.isArray(app.skills) ? app.skills : [],
      countries: Array.isArray(app.countries) ? app.countries : [],
      resumeUrl: app.resumeFileName ? `/api/admin/activity/resume/${app._id.toString()}` : null,
      emailVerified: app.emailVerified === true,
      createdAt: app.createdAt ? new Date(app.createdAt).toISOString() : new Date().toISOString(),
    }));

    return NextResponse.json({
      users: formattedUsers,
      total: formattedUsers.length,
    });
  } catch (error) {
    console.error('Admin users error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
