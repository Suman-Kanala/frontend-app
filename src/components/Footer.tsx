'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Logo from '@/components/Logo';
import { Linkedin, Instagram, Youtube, ArrowRight } from 'lucide-react';

// X (formerly Twitter) — official logo SVG
function XIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const NAV = [
  {
    heading: 'Services',
    links: [
      { label: 'AI Job Finder',       href: '/job-finder',                  external: false },
      { label: 'Career Guidance',     href: '/services/career-guidance',    external: false },
      { label: 'ATS Resume Builder',  href: '/services/ats-resume',         external: false },
      { label: 'Interview Coaching',  href: '/#contact',                    external: false },
      { label: 'Global Recruitment',  href: '/#contact',                    external: false },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us',      href: '/about',           external: false },
      { label: 'How It Works',  href: '/#how-it-works',   external: false },
      { label: 'Industries',    href: '/#industries',     external: false },
      { label: 'Contact Us',    href: '/#contact',        external: false },
      { label: 'For Employers', href: '/#contact',        external: false },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy',      href: '/privacy-policy',   external: false },
      { label: 'Refund Policy',       href: '/refund-policy',    external: false },
      { label: 'Shipping & Delivery', href: '/shipping-policy',  external: false },
      { label: 'Terms of Service',    href: '/terms',            external: false },
    ],
  },
];

const SOCIALS = [
  { label: 'LinkedIn',  href: 'https://www.linkedin.com/company/saanvi-careers', Icon: Linkedin  },
  { label: 'X',         href: 'https://twitter.com/saanvicareers',               Icon: XIcon     },
  { label: 'Instagram', href: 'https://instagram.com/saanvicareers',             Icon: Instagram },
  { label: 'YouTube',   href: 'https://youtube.com/@saanvicareers',              Icon: Youtube   },
];

function FooterLink({ href, label }: { href: string; label: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent) => {
    if (href.startsWith('/#')) {
      e.preventDefault();
      const id = href.slice(2);
      if (pathname !== '/') {
        router.push('/');
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 200);
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className="group flex items-center gap-1.5 text-sm text-[#697386] dark:text-[#8898aa] hover:text-[#0a2540] dark:hover:text-white transition-colors duration-150"
    >
      <ArrowRight
        size={11}
        className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 text-[#635bff] flex-shrink-0"
      />
      {label}
    </Link>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#F6F9FC] dark:bg-[#060e1d] border-t border-[#E6EBF1] dark:border-white/[0.07]">
      <div className="max-w-7xl mx-auto px-6">

        {/* ── MAIN GRID ── */}
        <div className="py-16 grid grid-cols-2 md:grid-cols-12 gap-y-12 gap-x-8">

          {/* Brand — 4 cols */}
          <div className="col-span-2 md:col-span-4 flex flex-col gap-6">
            <Logo size="default" />

            <p className="text-sm text-[#697386] dark:text-[#8898aa] leading-relaxed max-w-[280px]">
              Global recruitment and career services firm. Connecting talent with opportunities across IT, Engineering, Healthcare and Finance in 15+ countries.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-white dark:bg-white/5 border border-[#E6EBF1] dark:border-white/[0.08] flex items-center justify-center text-[#697386] dark:text-[#8898aa] hover:text-[#635bff] hover:border-[#635bff]/40 dark:hover:text-[#635bff] dark:hover:border-[#635bff]/40 transition-all duration-150"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>

            {/* Contact */}
            <div className="space-y-1.5">
              <a
                href="mailto:contact@saanvicareers.com"
                className="block text-sm text-[#697386] dark:text-[#8898aa] hover:text-[#635bff] dark:hover:text-[#635bff] transition-colors"
              >
                contact@saanvicareers.com
              </a>
              <a
                href="https://wa.me/918074172398"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-[#697386] dark:text-[#8898aa] hover:text-[#635bff] dark:hover:text-[#635bff] transition-colors"
              >
                +91 8074172398
              </a>
              <p className="text-xs text-[#8898aa] dark:text-[#697386]">Mon–Sat, 9 AM – 7 PM IST</p>
            </div>
          </div>

          {/* Spacer on md */}
          <div className="hidden md:block md:col-span-1" />

          {/* Link columns — 7 cols total */}
          {NAV.map((col) => (
            <div key={col.heading} className="col-span-1 md:col-span-2 flex flex-col gap-4">
              <p className="text-xs font-bold text-[#0a2540] dark:text-white uppercase tracking-[0.12em]">
                {col.heading}
              </p>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink href={link.href} label={link.label} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="py-6 border-t border-[#E6EBF1] dark:border-white/[0.07] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#8898aa] dark:text-[#697386] text-center sm:text-left">
            © {year}{' '}
            <span className="text-[#425466] dark:text-[#8898aa] font-semibold">Saanvi Careers</span>
            {' '}· All rights reserved · Professional Employment Services · Bengaluru, India
          </p>
          <div className="flex items-center gap-4">
            {[
              { label: 'Privacy', href: '/privacy-policy' },
              { label: 'Refunds', href: '/refund-policy' },
              { label: 'Terms',   href: '/terms' },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-xs text-[#8898aa] dark:text-[#697386] hover:text-[#0a2540] dark:hover:text-white transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
