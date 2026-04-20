import { Metadata } from 'next';
import LegalLayout from '@/components/LegalLayout';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy – Saanvi Careers',
  description: 'All Saanvi Careers services are delivered digitally. No physical products are sold or shipped.',
};

const sections = [
  { id: 'digital',    title: 'Digital-only services' },
  { id: 'timelines',  title: 'Delivery timelines' },
  { id: 'issues',     title: 'Delivery issues' },
  { id: 'contact',    title: 'Contact' },
];

export default function ShippingPolicyPage() {
  return (
    <LegalLayout title="Shipping & Delivery Policy" updated="April 19, 2026" sections={sections}>

      <div className="callout">
        <p>Saanvi Careers is a <strong>100% digital services company</strong>. No physical products are sold or shipped. All deliverables are sent electronically to the email address provided during booking.</p>
      </div>

      <h2 id="digital">Digital-only services</h2>
      <p>All services offered by Saanvi Careers are delivered online. This includes career guidance sessions (via video call), resume documents (via download), job placement communications (via email and phone), and all other service deliverables.</p>
      <p>Saanvi Careers does not sell, manufacture, or ship any physical goods of any kind.</p>

      <hr />

      <h2 id="timelines">Delivery timelines</h2>

      <h3>Career Guidance Sessions</h3>
      <ul>
        <li>Booking confirmation email: <strong>immediately</strong> upon successful payment</li>
        <li>Calendar invite (.ics file): attached to confirmation email</li>
        <li>Meeting link: included in confirmation email</li>
        <li>6-hour reminder email: automatically sent 6 hours before session</li>
        <li>2-hour reminder email: automatically sent 2 hours before session</li>
      </ul>

      <h3>Resume Builder</h3>
      <ul>
        <li>Resume generation: <strong>within 2 minutes</strong> of submission</li>
        <li>3 resume variants delivered directly on-screen</li>
        <li>Download available immediately as HTML or PDF</li>
      </ul>

      <h3>Job Placement Services</h3>
      <ul>
        <li>Initial response: within 24 hours of profile submission</li>
        <li>Job matches: sent via email within 2–5 business days</li>
        <li>Interview scheduling: coordinated via email and phone</li>
      </ul>

      <hr />

      <h2 id="issues">Delivery issues</h2>
      <p>If you do not receive your confirmation email or digital deliverable:</p>
      <ul>
        <li>Check your spam or junk folder</li>
        <li>Ensure the email address provided during booking is correct</li>
        <li>Contact us at <a href="mailto:contact@saanvicareers.com">contact@saanvicareers.com</a> within 24 hours</li>
        <li>We will resend the deliverable at no additional charge</li>
      </ul>

      <hr />

      <h2 id="contact">Contact</h2>
      <div className="callout">
        <p><strong>Saanvi Careers</strong><br />
        Email: <a href="mailto:contact@saanvicareers.com">contact@saanvicareers.com</a><br />
        WhatsApp: +91 8074172398<br />
        Mon–Sat, 9 AM – 7 PM IST</p>
      </div>

    </LegalLayout>
  );
}
