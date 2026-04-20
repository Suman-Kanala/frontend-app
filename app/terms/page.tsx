import { Metadata } from 'next';
import LegalLayout from '@/components/LegalLayout';

export const metadata: Metadata = {
  title: 'Terms of Service – Saanvi Careers',
  description: 'Terms and conditions for using Saanvi Careers services.',
};

const sections = [
  { id: 'acceptance',   title: 'Acceptance' },
  { id: 'services',     title: 'Services' },
  { id: 'users',        title: 'User responsibilities' },
  { id: 'payment',      title: 'Payment' },
  { id: 'delivery',     title: 'Delivery' },
  { id: 'ip',           title: 'Intellectual property' },
  { id: 'liability',    title: 'Liability' },
  { id: 'privacy',      title: 'Privacy' },
  { id: 'termination',  title: 'Termination' },
  { id: 'governing',    title: 'Governing law' },
  { id: 'changes',      title: 'Changes' },
  { id: 'contact',      title: 'Contact' },
];

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated="April 19, 2026" sections={sections}>

      <div className="callout">
        <p>These Terms of Service govern your use of <strong>saanvicareers.com</strong> and all services provided by <strong>Saanvi Careers</strong>. By accessing our website or using our services, you agree to be bound by these terms.</p>
      </div>

      <h2 id="acceptance">1. Acceptance of terms</h2>
      <p>By accessing or using the services of Saanvi Careers, you confirm that you are at least 18 years of age, have read and understood these Terms, and agree to be bound by them. If you do not agree, please do not use our services.</p>

      <hr />

      <h2 id="services">2. Services offered</h2>
      <p>Saanvi Careers provides the following digital services:</p>
      <ul>
        <li>Job placement and recruitment services</li>
        <li>Career guidance sessions (1-on-1 video calls)</li>
        <li>Resume optimisation and building</li>
        <li>Interview preparation and coaching</li>
        <li>Job matching and career advisory</li>
      </ul>

      <hr />

      <h2 id="users">3. User responsibilities</h2>
      <ul>
        <li>You must provide accurate and truthful information when using our services</li>
        <li>You are responsible for maintaining the confidentiality of your account credentials</li>
        <li>You must not use our services for any unlawful or fraudulent purpose</li>
        <li>You must not upload malicious files or attempt to compromise our systems</li>
        <li>You must not misrepresent your qualifications or experience to employers</li>
      </ul>

      <hr />

      <h2 id="payment">4. Payment terms</h2>
      <ul>
        <li>All prices are listed in Indian Rupees (INR) inclusive of applicable taxes</li>
        <li>Payments are processed securely through PayU payment gateway</li>
        <li>We do not store your payment card details</li>
        <li>Refunds are subject to our <a href="/refund-policy">Refund Policy</a></li>
        <li>Prices are subject to change with reasonable notice</li>
      </ul>

      <hr />

      <h2 id="delivery">5. Service delivery</h2>
      <p>All services are delivered digitally. Delivery timelines are outlined in our <a href="/shipping-policy">Shipping & Delivery Policy</a>. Saanvi Careers does not guarantee specific employment outcomes, though we commit to our 90-day placement guarantee for recruitment services.</p>

      <hr />

      <h2 id="ip">6. Intellectual property</h2>
      <p>All content on saanvicareers.com — including text, graphics, logos, and software — is the property of Saanvi Careers and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our prior written permission.</p>
      <p>Resumes and documents you upload remain your property. By uploading, you grant us a limited licence to process them solely for the purpose of providing our services.</p>

      <hr />

      <h2 id="liability">7. Limitation of liability</h2>
      <p>Saanvi Careers shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our services. Our total liability shall not exceed the amount paid by you for the specific service in question during the 12 months preceding the claim.</p>
      <p>We do not guarantee specific employment outcomes. Job placement depends on multiple factors including market conditions, candidate qualifications, and employer requirements.</p>

      <hr />

      <h2 id="privacy">8. Privacy</h2>
      <p>Your use of our services is also governed by our <a href="/privacy-policy">Privacy Policy</a>, which is incorporated into these Terms by reference.</p>

      <hr />

      <h2 id="termination">9. Termination</h2>
      <p>We reserve the right to suspend or terminate your access to our services at any time if you violate these Terms or engage in conduct that we determine to be harmful to other users, third parties, or our business.</p>

      <hr />

      <h2 id="governing">10. Governing law</h2>
      <p>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka, India.</p>

      <hr />

      <h2 id="changes">11. Changes to terms</h2>
      <p>We reserve the right to modify these Terms at any time. We will provide reasonable notice of material changes. Continued use of our services after changes constitutes acceptance of the revised Terms.</p>

      <hr />

      <h2 id="contact">12. Contact</h2>
      <div className="callout">
        <p><strong>Saanvi Careers</strong><br />
        Email: <a href="mailto:contact@saanvicareers.com">contact@saanvicareers.com</a><br />
        Phone: +91 8074172398<br />
        Bengaluru, Karnataka, India</p>
      </div>

    </LegalLayout>
  );
}
