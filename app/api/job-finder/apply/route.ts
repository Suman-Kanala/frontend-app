import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM   = process.env.RESEND_FROM_EMAIL || 'Saanvi Careers <onboarding@resend.dev>';
const TO     = 'contact@saanvicareers.com';

export async function POST(req: NextRequest) {
  try {
    const { applicationId, job } = await req.json();
    if (!applicationId || !job) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    const db = await getDb();
    const app = await db.collection('job_applications').findOne({
      _id: new ObjectId(applicationId),
    });

    if (!app) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Build email attachments if resume exists
    const attachments: { filename: string; content: Buffer }[] = [];
    if (app.resumeData && app.resumeFileName) {
      attachments.push({
        filename: app.resumeFileName,
        content: Buffer.from(app.resumeData, 'base64'),
      });
    }

    const { error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo: app.email,
      subject: `[Job Application] ${app.name} → ${job.title} at ${job.company}`,
      attachments,
      html: `
        <div style="font-family:sans-serif;max-width:640px;margin:0 auto;color:#1e293b">

          <!-- Header -->
          <div style="background:#0a2540;padding:24px 28px;border-radius:10px 10px 0 0">
            <h1 style="color:#fff;font-size:18px;margin:0;font-weight:700">New Job Application Request</h1>
            <p style="color:#94a3b8;font-size:13px;margin:4px 0 0">Saanvi Careers Job Finder · saanvicareers.com</p>
          </div>

          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-top:none;padding:28px;border-radius:0 0 10px 10px">

            <!-- Candidate -->
            <h2 style="font-size:14px;font-weight:700;color:#0a2540;text-transform:uppercase;letter-spacing:.05em;margin:0 0 12px">Candidate Details</h2>
            <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
              <tr><td style="padding:7px 0;color:#64748b;font-size:13px;width:130px">Name</td><td style="padding:7px 0;font-weight:600;font-size:14px">${app.name}</td></tr>
              <tr><td style="padding:7px 0;color:#64748b;font-size:13px">Email</td><td style="padding:7px 0;font-size:14px"><a href="mailto:${app.email}" style="color:#635bff">${app.email}</a></td></tr>
              <tr><td style="padding:7px 0;color:#64748b;font-size:13px">Phone</td><td style="padding:7px 0;font-size:14px">${app.phone || '—'}</td></tr>
              <tr><td style="padding:7px 0;color:#64748b;font-size:13px">Target Role</td><td style="padding:7px 0;font-size:14px;font-weight:600">${app.role}</td></tr>
              <tr><td style="padding:7px 0;color:#64748b;font-size:13px">Experience</td><td style="padding:7px 0;font-size:14px">${app.experience}</td></tr>
              <tr><td style="padding:7px 0;color:#64748b;font-size:13px">Skills</td><td style="padding:7px 0;font-size:14px">${(app.skills as string[]).join(', ')}</td></tr>
              <tr><td style="padding:7px 0;color:#64748b;font-size:13px">Countries</td><td style="padding:7px 0;font-size:14px">${(app.countries as string[]).join(', ')}</td></tr>
            </table>

            <!-- Job -->
            <h2 style="font-size:14px;font-weight:700;color:#0a2540;text-transform:uppercase;letter-spacing:.05em;margin:0 0 12px">Applied Job</h2>
            <div style="background:#fff;border:1px solid #e2e8f0;border-left:4px solid #635bff;border-radius:6px;padding:16px 20px;margin-bottom:24px">
              <p style="font-size:16px;font-weight:700;color:#0a2540;margin:0 0 4px">${job.title}</p>
              <p style="font-size:13px;color:#425466;margin:0 0 8px">${job.company} · ${job.location} · ${job.type}</p>
              <p style="font-size:12px;color:#94a3b8;margin:0">Posted ${job.daysAgo === 0 ? 'today' : `${job.daysAgo} day${job.daysAgo === 1 ? '' : 's'} ago`} · Match: ${job.matchScore}%</p>
            </div>

            <!-- Apply link -->
            <div style="margin-bottom:24px">
              <p style="font-size:13px;color:#64748b;margin:0 0 8px;font-weight:600">Original Job Listing:</p>
              <a href="${job.url}" style="display:inline-block;background:#635bff;color:#fff;text-decoration:none;padding:10px 20px;border-radius:6px;font-size:13px;font-weight:600">
                View &amp; Apply on Job Board →
              </a>
            </div>

            <!-- Resume note -->
            <div style="background:#f0effe;border:1px solid #c7d2fe;border-radius:6px;padding:12px 16px">
              <p style="font-size:12px;color:#4f46e5;margin:0;font-weight:500">
                📎 ${app.resumeFileName
                  ? `Resume attached: <strong>${app.resumeFileName}</strong>`
                  : 'No resume uploaded — follow up with candidate directly.'}
              </p>
              <p style="font-size:11px;color:#6366f1;margin:4px 0 0">Application ID: ${applicationId}</p>
            </div>

          </div>
        </div>
      `,
    });

    if (error) {
      console.error('[job-finder/apply] Resend error:', error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    // Mark as applied
    await db.collection('job_applications').updateOne(
      { _id: new ObjectId(applicationId) },
      { $push: { appliedJobs: { ...job, appliedAt: new Date() } } as any }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[job-finder/apply]', err);
    return NextResponse.json({ error: 'Failed to process application' }, { status: 500 });
  }
}
