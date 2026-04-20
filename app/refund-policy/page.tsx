import { Metadata } from 'next';
import LegalLayout from '@/components/LegalLayout';

export const metadata: Metadata = {
  title: 'Refund Policy – Saanvi Careers',
  description: 'Refund and cancellation policy for Saanvi Careers services.',
};

const sections = [
  { id: 'guidance',   title: 'Career Guidance Sessions' },
  { id: 'resume',     title: 'Resume Builder' },
  { id: 'placement',  title: 'Job Placement' },
  { id: 'process',    title: 'Refund process' },
  { id: 'contact',    title: 'Contact' },
];

export default function RefundPolicyPage() {
  return (
    <LegalLayout title="Refund & Cancellation Policy" updated="April 19, 2026" sections={sections}>

      <div className="callout">
        <p>Saanvi Careers provides <strong>digital services only</strong>. All refund requests are reviewed individually and processed within 5–7 business days of approval.</p>
      </div>

      <h2 id="guidance">Career Guidance Sessions</h2>
      <p>Our career guidance sessions are priced at <strong>₹499</strong> per session.</p>

      <h3>Cancellation & rescheduling</h3>
      <ul>
        <li>Cancel or reschedule at least <strong>24 hours before</strong> the session at no charge</li>
        <li>Cancellations made less than 24 hours before the session are not eligible for a refund</li>
        <li>To reschedule, contact us at <a href="mailto:contact@saanvicareers.com">contact@saanvicareers.com</a> or WhatsApp +91 8074172398</li>
      </ul>

      <h3>Refund eligibility</h3>
      <div className="card-grid">
        <div className="card" style={{ borderLeft: '3px solid #10b981' }}>
          <div className="card-label" style={{ color: '#10b981' }}>Eligible for full refund</div>
          <ul style={{ marginTop: '0.5rem' }}>
            <li>Cancellation at least 24 hours before the session</li>
            <li>Session cancelled by Saanvi Careers</li>
            <li>Technical issues on our end prevent the session</li>
          </ul>
        </div>
        <div className="card" style={{ borderLeft: '3px solid #ef4444' }}>
          <div className="card-label" style={{ color: '#ef4444' }}>Not eligible for refund</div>
          <ul style={{ marginTop: '0.5rem' }}>
            <li>No-show without prior notice</li>
            <li>Session has already been conducted</li>
            <li>Cancellation less than 24 hours before</li>
          </ul>
        </div>
      </div>

      <hr />

      <h2 id="resume">Resume Builder Service</h2>
      <p>The Resume Builder is a digital service. Once your resume has been generated and delivered, refunds are generally not applicable.</p>
      <ul>
        <li>If you experience a technical failure and do not receive your resume, contact us within 24 hours for a full refund or re-generation</li>
        <li>If you are unsatisfied with the output, we offer one free revision</li>
      </ul>

      <hr />

      <h2 id="placement">Job Placement Services</h2>
      <ul>
        <li>Saanvi Careers offers a <strong>90-day placement guarantee</strong> — if a placed candidate does not work out within 90 days, we find a replacement at no additional cost</li>
        <li>Recruitment service fees are non-refundable once a candidate has successfully joined the employer</li>
      </ul>

      <hr />

      <h2 id="process">Refund process</h2>
      <ul>
        <li>Approved refunds are credited to the original payment method within <strong>5–7 business days</strong></li>
        <li>UPI payments are refunded to the source UPI account</li>
        <li>Card payments are refunded through PayU to the original card</li>
        <li>You will receive an email confirmation once the refund has been initiated</li>
      </ul>
      <p>To request a refund, contact us with your full name, email address, booking ID, and reason for the request.</p>

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
