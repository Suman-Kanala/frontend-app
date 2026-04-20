'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const PAGES = [
  { label: 'About Us',            href: '/about' },
  { label: 'Privacy Policy',      href: '/privacy-policy' },
  { label: 'Refund Policy',       href: '/refund-policy' },
  { label: 'Shipping & Delivery', href: '/shipping-policy' },
  { label: 'Terms of Service',    href: '/terms' },
];

interface Section {
  id: string;
  title: string;
}

interface Props {
  title: string;
  updated: string;
  sections: Section[];
  children: React.ReactNode;
}

export default function LegalLayout({ title, updated, sections, children }: Props) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-white dark:bg-[#060e1d]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-0 pt-24">

          {/* ── LEFT SIDEBAR ── */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 pr-8 pb-16">

              {/* Page nav */}
              <div className="mb-8">
                <p className="text-[11px] font-bold text-[#8898aa] dark:text-[#697386] uppercase tracking-[0.12em] mb-3 px-3">
                  Legal
                </p>
                <nav className="flex flex-col">
                  {PAGES.map((p) => {
                    const active = pathname === p.href;
                    return (
                      <Link
                        key={p.href}
                        href={p.href}
                        className={`px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                          active
                            ? 'bg-[#f0effe] dark:bg-[#635bff]/10 text-[#635bff] font-semibold'
                            : 'text-[#425466] dark:text-[#8898aa] hover:text-[#0a2540] dark:hover:text-white hover:bg-[#F6F9FC] dark:hover:bg-white/5'
                        }`}
                      >
                        {p.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* On this page */}
              {sections.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold text-[#8898aa] dark:text-[#697386] uppercase tracking-[0.12em] mb-3 px-3">
                    On this page
                  </p>
                  <nav className="flex flex-col">
                    {sections.map((s) => (
                      <a
                        key={s.id}
                        href={`#${s.id}`}
                        className="px-3 py-1.5 text-sm text-[#697386] dark:text-[#8898aa] hover:text-[#635bff] dark:hover:text-[#635bff] transition-colors"
                      >
                        {s.title}
                      </a>
                    ))}
                  </nav>
                </div>
              )}
            </div>
          </aside>

          {/* ── MAIN CONTENT ── */}
          <main className="pb-24 lg:pl-12 lg:border-l border-[#E6EBF1] dark:border-white/[0.07]">
            {/* Page header */}
            <div className="mb-10 pb-8 border-b border-[#E6EBF1] dark:border-white/[0.07]">
              <h1 className="text-4xl font-extrabold tracking-tight text-[#0a2540] dark:text-white mb-2">
                {title}
              </h1>
              <p className="text-sm text-[#8898aa] dark:text-[#697386]">Last updated: {updated}</p>
            </div>

            {/* Content */}
            <div className="legal-content">
              {children}
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
