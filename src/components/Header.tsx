'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, LayoutDashboard } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import Logo from '@/components/Logo';
import { useAuth } from '@/contexts/AuthContext';

interface MenuItem {
  name: string;
  href: string;
}

const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const { isAdmin, isAuthenticated } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const navLinks: MenuItem[] = [
    { name: 'About',       href: '#about' },
    { name: 'Industries',  href: '#industries' },
    { name: 'How It Works',href: '#how-it-works' },
    { name: 'Contact',     href: '#contact' },
  ];

  function scrollTo(href: string): void {
    if (pathname !== '/') {
      router.push('/');
      setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }), 150);
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  }

  function go(path: string): void {
    router.push(path);
    window.scrollTo(0, 0);
    setMobileOpen(false);
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 dark:bg-[#060e1d]/95 backdrop-blur-md shadow-sm border-b border-[#E6EBF1] dark:border-white/[0.07]'
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <button onClick={() => go('/')} className="flex-shrink-0 focus:outline-none">
              <Logo size="default" />
            </button>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollTo(item.href)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-[#425466] dark:text-[#8898aa] hover:text-[#0a2540] dark:hover:text-white hover:bg-[#F6F9FC] dark:hover:bg-white/5 transition-colors"
                >
                  {item.name}
                </button>
              ))}

              {/* Find Jobs — highlighted nav link */}
              <button
                onClick={() => go('/job-finder')}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  pathname === '/job-finder'
                    ? 'bg-[#f0effe] dark:bg-[#635bff]/15 text-[#635bff]'
                    : 'text-[#635bff] hover:bg-[#f0effe] dark:hover:bg-[#635bff]/10'
                }`}
              >
                <Search size={13} />
                Find Jobs
              </button>
            </div>

            {/* Desktop CTA + Auth */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => scrollTo('#contact')}
                className="px-5 py-2.5 bg-[#635bff] hover:bg-[#4f46e5] text-white text-sm font-semibold rounded-full shadow-sm shadow-[#635bff]/20 hover:shadow-[#635bff]/30 transition-all duration-200"
              >
                Contact Us
              </button>

              {!isAuthenticated ? (
                <button
                  onClick={() => router.push('/sign-in')}
                  className="px-4 py-2.5 border border-[#E6EBF1] dark:border-white/10 text-sm font-semibold text-[#425466] dark:text-[#8898aa] rounded-full hover:border-[#635bff]/40 hover:text-[#635bff] transition-all duration-200"
                >
                  Sign In
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <button
                      onClick={() => go('/admin')}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors"
                    >
                      <LayoutDashboard size={13} /> Admin
                    </button>
                  )}
                  <UserButton />
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-lg text-[#425466] dark:text-[#8898aa] hover:bg-[#F6F9FC] dark:hover:bg-white/5 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-white dark:bg-[#060e1d] shadow-2xl lg:hidden overflow-y-auto border-l border-[#E6EBF1] dark:border-white/[0.07]"
            >
              <div className="flex items-center justify-between p-4 border-b border-[#E6EBF1] dark:border-white/[0.07]">
                <Logo size="small" />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg text-[#425466] hover:bg-[#F6F9FC] dark:hover:bg-white/5 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-0.5">
                {navLinks.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => scrollTo(item.href)}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#425466] dark:text-[#8898aa] hover:bg-[#F6F9FC] dark:hover:bg-white/5 hover:text-[#0a2540] dark:hover:text-white transition-colors"
                  >
                    {item.name}
                  </button>
                ))}

                <div className="pt-3 mt-1 border-t border-[#E6EBF1] dark:border-white/[0.07] space-y-2">
                  <button
                    onClick={() => go('/job-finder')}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 border border-[#635bff]/30 text-[#635bff] text-sm font-semibold rounded-full hover:bg-[#f0effe] dark:hover:bg-[#635bff]/10 transition-colors"
                  >
                    <Search size={13} /> Find Jobs
                  </button>
                  <button
                    onClick={() => scrollTo('#contact')}
                    className="w-full px-4 py-3 bg-[#635bff] hover:bg-[#4f46e5] text-white text-sm font-semibold rounded-full transition-colors"
                  >
                    Contact Us
                  </button>

                  {!isAuthenticated ? (
                    <button
                      onClick={() => router.push('/sign-in')}
                      className="w-full px-4 py-3 border border-[#E6EBF1] dark:border-white/10 text-[#425466] dark:text-[#8898aa] text-sm font-semibold rounded-full hover:border-[#635bff]/40 transition-colors"
                    >
                      Sign In / Sign Up
                    </button>
                  ) : (
                    <div className="flex items-center justify-between px-1">
                      {isAdmin && (
                        <button
                          onClick={() => go('/admin')}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400"
                        >
                          <LayoutDashboard size={13} /> Admin Panel
                        </button>
                      )}
                      <UserButton />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
