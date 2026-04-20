import { Metadata } from 'next';
import LegalLayout from '@/components/LegalLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy – Saanvi Careers',
  description: 'How Saanvi Careers collects, uses, and protects your personal information.',
};

const sections = [
  { id: 'overview',    title: 'Overview' },
  { id: 'collection',  title: 'Information we collect' },
  { id: 'use',         title: 'How we use it' },
  { id: 'sharing',     title: 'Data sharing' },
  { id: 'security',    title: 'Security' },
  { id: 'retention',   title: 'Retention' },
  { id: 'rights',      title: 'Your rights' },
  { id: 'cookies',     title: 'Cookies' },
  { id: 'contact',     title: 'Contact' },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="April 19, 2026" sections={sections}>

      <div className="callout">
        <p>This Privacy Policy applies to all services offered by <strong>Saanvi Careers</strong> at saanvicareers.com. By using our website or services, you agree to the practices described here.</p>
      </div>

      <h2 id="overview">Overview</h2>
      <p>Saanvi Careers is committed to protecting your personal information and being transparent about how we use it. This policy explains what data we collect, why we collect it, and how you can control it.</p>

      <hr />

      <h2 id="collection">Information we collect</h2>
      <p>We collect information you provide directly and information generated through your use of our services:</p>
      <ul>
        <li><strong>Identity data</strong> — name, email address, phone number</li>
        <li><strong>Professional data</strong> — resume, work experience, education, skills, certifications</li>
        <li><strong>Profile data</strong> — LinkedIn URL, GitHub URL, career goals</li>
        <li><strong>Payment data</strong> — transaction IDs and payment status (card details are handled by PayU and never stored by us)</li>
        <li><strong>Usage data</strong> — pages visited, time on site, browser type, IP address</li>
        <li><strong>Communications</strong> — messages sent through our contact forms or chat</li>
      </ul>

      <hr />

      <h2 id="use">How we use your information</h2>
      <ul>
        <li>Match you with relevant job opportunities</li>
        <li>Provide career guidance and resume services</li>
        <li>Process bookings and payments</li>
        <li>Send confirmation emails, reminders, and service updates</li>
        <li>Improve our website and services</li>
        <li>Respond to your enquiries and support requests</li>
        <li>Comply with legal obligations</li>
      </ul>

      <hr />

      <h2 id="sharing">Data sharing</h2>
      <p>We do not sell your personal data. We share information only in the following circumstances:</p>
      <div className="card-grid">
        {[
          { label: 'Employers',          desc: 'With your explicit consent, for job placement purposes only.' },
          { label: 'PayU',               desc: 'Processes payments securely. We do not store card details.' },
          { label: 'Resend',             desc: 'Sends transactional emails on our behalf.' },
          { label: 'Clerk',              desc: 'Manages secure user authentication.' },
          { label: 'Legal Authorities',  desc: 'When required by law or to protect our legal rights.' },
          { label: 'Service Providers',  desc: 'Trusted vendors bound by confidentiality agreements.' },
        ].map((item) => (
          <div key={item.label} className="card">
            <div className="card-label">{item.label}</div>
            <div className="card-desc">{item.desc}</div>
          </div>
        ))}
      </div>

      <hr />

      <h2 id="security">Security</h2>
      <p>We implement industry-standard security measures including SSL/TLS encryption, secure database storage, and strict access controls. All payment transactions are processed through PCI-DSS compliant payment gateways.</p>
      <p>While we take every reasonable precaution, no method of transmission over the internet is 100% secure.</p>

      <hr />

      <h2 id="retention">Data retention</h2>
      <p>We retain your personal data for as long as necessary to provide our services and comply with legal obligations. You may request deletion of your data at any time by contacting us at <a href="mailto:contact@saanvicareers.com">contact@saanvicareers.com</a>.</p>

      <hr />

      <h2 id="rights">Your rights</h2>
      <ul>
        <li><strong>Access</strong> — request a copy of the personal data we hold about you</li>
        <li><strong>Correction</strong> — request correction of inaccurate or incomplete data</li>
        <li><strong>Deletion</strong> — request deletion of your personal data</li>
        <li><strong>Portability</strong> — receive your data in a structured, machine-readable format</li>
        <li><strong>Objection</strong> — object to processing of your data for certain purposes</li>
        <li><strong>Withdrawal</strong> — withdraw consent at any time without affecting prior processing</li>
      </ul>

      <hr />

      <h2 id="cookies">Cookies</h2>
      <p>We use cookies to enhance your browsing experience, analyse site traffic, and personalise content. You can control cookie settings through your browser. Disabling cookies may affect some features of our website.</p>

      <hr />

      <h2 id="contact">Contact</h2>
      <div className="callout">
        <p><strong>Saanvi Careers — Data Controller</strong><br />
        Email: <a href="mailto:contact@saanvicareers.com">contact@saanvicareers.com</a><br />
        Phone: +91 8074172398<br />
        Bengaluru, Karnataka, India</p>
      </div>

    </LegalLayout>
  );
}
