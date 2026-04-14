'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Search, LayoutDashboard,
  LogOut, User, Settings, ChevronDown,
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';
import Logo from '@/components/Logo';
import { useAuth } from '@/contexts/AuthContext';

interface MenuItem {
  name: string;
  href: string;
}

/* ── Custom user-avatar + dropdown (replaces <UserButton />) ─── */
function UserMenu() {
  const { user, isAdmin, logout } = useAuth();
  const { signOut } = useClerk();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* Close on outside click */
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? '?';

  async function handleSignOut() {
    setOpen(false);
    await signOut();
    router.push('/');
  }

  return (
    <div ref={ref} className="relative">
      {/* Avatar trigger */}
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border border-[#E6EBF1] dark:border-white/10 hover:border-[#635bff]/40 bg-white dark:bg-white/5 hover:bg-[#f8f7ff] dark:hover:bg-white/8 transition-all duration-200 group"
      >
        {/* Avatar circle */}
        {user?.picture ? (
          <img
            src={user.picture}
            alt={user.name}
            className="w-7 h-7 rounded-full object-cover ring-2 ring-[#635bff]/20"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#635bff] to-[#818cf8] flex items-center justify-center text-white text-[11px] font-bold ring-2 ring-[#635bff]/20">
            {initials}
          </div>
        )}
        <ChevronDown
          size={13}
          className={`text-[#697386] dark:text-[#8898aa] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-2.5 w-60 bg-white dark:bg-[#0d1f33] rounded-2xl overflow-hidden z-50"
            style={{
              boxShadow: '0 16px 40px -8px rgba(50,50,93,0.18), 0 8px 20px -8px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.06)',
            }}
          >
            {/* User info */}
            <div className="px-4 pt-4 pb-3 border-b border-[#E6EBF1] dark:border-white/[0.07]">
              <div className="flex items-center gap-3">
                {user?.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-[#635bff]/20"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#635bff] to-[#818cf8] flex items-center justify-center text-white text-sm font-bold ring-2 ring-[#635bff]/20 flex-shrink-0">
                    {initials}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#0a2540] dark:text-white truncate leading-tight">
                    {user?.name || 'Your Account'}
                  </p>
                  <p className="text-[11px] text-[#697386] dark:text-[#8898aa] truncate mt-0.5">
                    {user?.email}
                  </p>
                </div>
              </div>

              {/* Role badge */}
              {isAdmin && (
                <span className="mt-2.5 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-2 py-0.5 rounded-full">
                  Admin
                </span>
              )}
            </div>

            {/* Menu items */}
            <div className="p-2">
              <DropdownItem
                icon={<LayoutDashboard size={14} />}
                label="Dashboard"
                onClick={() => { setOpen(false); router.push('/dashboard'); }}
              />
              {isAdmin && (
                <DropdownItem
                  icon={<LayoutDashboard size={14} />}
                  label="Admin Panel"
                  onClick={() => { setOpen(false); router.push('/admin'); }}
                  accent
                />
              )}
              <DropdownItem
                icon={<User size={14} />}
                label="Profile"
                onClick={() => { setOpen(false); router.push('/dashboard'); }}
              />
              <DropdownItem
                icon={<Settings size={14} />}
                label="Settings"
                onClick={() => { setOpen(false); router.push('/dashboard'); }}
              />

              {/* Divider */}
              <div className="my-1.5 h-px bg-[#E6EBF1] dark:bg-white/[0.07]" />

              {/* Sign out */}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors group"
              >
                <LogOut size={14} className="flex-shrink-0" />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DropdownItem({
  icon, label, onClick, accent = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  accent?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
        accent
          ? 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10'
          : 'text-[#425466] dark:text-[#8898aa] hover:bg-[#F6F9FC] dark:hover:bg-white/5 hover:text-[#0a2540] dark:hover:text-white'
      }`}
    >
      <span className="flex-shrink-0">{icon}</span>
      {label}
    </button>
  );
}

/* ─────────────────────────────────────────────── */

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
    { name: 'About',        href: '#about'      },
    { name: 'Industries',   href: '#industries' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Contact',      href: '#contact'    },
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
                <UserMenu />
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
                    /* Mobile — inline user card */
                    <MobileUserCard />
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

/* Mobile signed-in card */
function MobileUserCard() {
  const { user, isAdmin } = useAuth();
  const { signOut } = useClerk();
  const router = useRouter();

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? '?';

  async function handleSignOut() {
    await signOut();
    router.push('/');
  }

  return (
    <div className="rounded-2xl border border-[#E6EBF1] dark:border-white/[0.07] overflow-hidden">
      {/* User info */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#F6F9FC] dark:bg-white/[0.03]">
        {user?.picture ? (
          <img src={user.picture} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#635bff] to-[#818cf8] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#0a2540] dark:text-white truncate">{user?.name || 'Your Account'}</p>
          <p className="text-[11px] text-[#697386] dark:text-[#8898aa] truncate">{user?.email}</p>
        </div>
      </div>
      {/* Actions */}
      <div className="p-2 space-y-0.5">
        <button onClick={() => router.push('/dashboard')}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-[#425466] dark:text-[#8898aa] hover:bg-[#F6F9FC] dark:hover:bg-white/5 hover:text-[#0a2540] dark:hover:text-white transition-colors">
          <LayoutDashboard size={14} /> Dashboard
        </button>
        {isAdmin && (
          <button onClick={() => router.push('/admin')}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors">
            <LayoutDashboard size={14} /> Admin Panel
          </button>
        )}
        <div className="h-px bg-[#E6EBF1] dark:bg-white/[0.07] my-1" />
        <button onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
          <LogOut size={14} /> Sign out
        </button>
      </div>
    </div>
  );
}

export default Header;
