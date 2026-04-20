import { Metadata } from 'next';
import LegalLayout from '@/components/LegalLayout';

export const metadata: Metadata = {
  title: 'About Us – Saanvi Careers',
  description: 'Saanvi Careers is a global recruitment and career services firm headquartered in Bengaluru, India.',
};

const sections = [
  { id: 'identity',  title: 'Legal identity' },
  { id: 'story',     title: 'Our story' },
  { id: 'services',  title: 'What we do' },
  { id: 'reach',     title: 'Global reach' },
  { id: 'contact',   title: 'Contact' },
];

export default function AboutPage() {
  return (
    <LegalLayout title="About Saanvi Careers" updated="April 19, 2026" sections={sections}>

      <div className="callout">
        <p>Saanvi Careers is a global professional employment services firm. We connect IT, Engineering, Healthcare, and Finance professionals with top employers across 15+ countries.</p>
      </div>

      <h2 id="identity">Legal identity</h2>
      <div className="card-grid">
        <div className="card">
          <div className="card-label">Legal Name</div>
          <div className="card-value">Saanvi Careers</div>
        </div>
        <div className="card">
          <div className="card-label">Business Category</div>
          <div className="card-value">Professional Employment Services</div>
        </div>
        <div className="card">
          <div className="card-label">Headquarters</div>
          <div className="card-value">Bengaluru, Karnataka, India</div>
        </div>
        <div className="card">
          <div className="card-label">Operating Since</div>
          <div className="card-value">2020</div>
        </div>
      </div>

      <hr />

      <h2 id="story">Our story</h2>
      <p>Saanvi Careers was founded with a single conviction: the traditional recruitment model was broken. Candidates were ghosted. Employers received resume dumps. Timelines stretched for months. We set out to fix that.</p>
      <p>Today, we are a global professional employment services firm with over 3,200 successful placements and a 97% client satisfaction rate. Our average placement time is under 30 days — backed by a 90-day placement guarantee.</p>
      <p>We believe every professional deserves a career that matches their potential. That belief drives everything we do.</p>

      <hr />

      <h2 id="services">What we do</h2>
      <div className="card-grid">
        {[
          { label: 'Job Placement',       desc: 'End-to-end recruitment across IT, Engineering, Healthcare and Finance sectors globally.' },
          { label: 'Career Guidance',     desc: 'Personalised 1-on-1 mentorship sessions with industry experts.' },
          { label: 'Resume Optimisation', desc: 'Professional resume rewriting service that optimises your resume to pass screening filters.' },
          { label: 'Interview Coaching',  desc: 'Role-specific mock interviews, answer frameworks, and live feedback sessions.' },
        ].map((item) => (
          <div key={item.label} className="card">
            <div className="card-label">{item.label}</div>
            <div className="card-desc">{item.desc}</div>
          </div>
        ))}
      </div>

      <hr />

      <h2 id="reach">Global reach</h2>
      <p>We operate across 15+ countries including India, United States, United Kingdom, Australia, European Union countries, and Gulf Countries (UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, Oman).</p>
      <p>Our industry coverage spans IT & Technology, Engineering, Healthcare & Life Sciences, Finance & Banking, and General Management.</p>

      <hr />

      <h2 id="contact">Contact</h2>
      <div className="card-grid">
        {[
          { label: 'Email',          value: 'contact@saanvicareers.com' },
          { label: 'Phone / WhatsApp', value: '+91 8074172398' },
          { label: 'Business Hours', value: 'Mon–Sat, 9 AM – 7 PM IST' },
          { label: 'Website',        value: 'saanvicareers.com' },
        ].map((item) => (
          <div key={item.label} className="card">
            <div className="card-label">{item.label}</div>
            <div className="card-value">{item.value}</div>
          </div>
        ))}
      </div>

    </LegalLayout>
  );
}
