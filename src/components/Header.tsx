'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  LogIn,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  ChevronDown,
  BookOpen,
  Sparkles,
  Briefcase,
  Sun,
  Moon,
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import Logo from '@/components/Logo';

interface MenuItem {
  name: string;
  href: string;
}

interface HeaderProps {
  // Currently no props needed - component uses context
}

const Header: React.FC<HeaderProps> = () => {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isAdmin, isStaff, login, logout, loading, user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Solid header on dark-bg pages
  const isDarkPage =
    pathname.startsWith('/courses/') && pathname !== '/courses';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const solid = scrolled || isDarkPage;

  const navLinks: MenuItem[] = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Industries', href: '#industries' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Contact', href: '#contact' },
  ];

  function scrollTo(href: string): void {
    if (pathname !== '/') {
      router.push('/');
      setTimeout(() => {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  }

  function go(path: string): void {
    router.push(path);
    window.scrollTo(0, 0);
    setMobileOpen(false);
    setUserMenuOpen(false);
  }

  // Check if a nav route is active
  function isActive(path: string): boolean {
    return pathname === path;
  }

  const userInitial = (user?.name || user?.email || 'U').charAt(0).toUpperCase();

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          solid
            ? 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800'
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => go('/')}
              className="flex-shrink-0 focus:outline-none"
            >
              <Logo size="default" />
            </button>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollTo(item.href)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    solid
                      ? 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/60 dark:hover:bg-blue-950/40'
                      : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/20'
                  }`}
                >
                  {item.name}
                </button>
              ))}

              {/* Courses */}
              <button
                onClick={() => go('/courses')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/courses') || pathname.startsWith('/courses/')
                    ? 'text-blue-600 bg-blue-50'
                    : solid
                    ? 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/60'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-white/20'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Courses
              </button>

              {/* Gen AI Program — highlighted */}
              <button
                onClick={() => go('/ai-program')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  isActive('/ai-program')
                    ? 'text-purple-700 bg-purple-50'
                    : 'text-purple-600 hover:text-purple-700 hover:bg-purple-50/60'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Gen AI Program
              </button>

              {/* Interview Support */}
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    go('/interview-support');
                  } else {
                    router.push(`/sign-in?redirect_url=/interview-support`);
                  }
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/interview-support')
                    ? 'text-green-700 bg-green-50'
                    : solid
                    ? 'text-gray-600 hover:text-green-600 hover:bg-green-50/60'
                    : 'text-gray-700 hover:text-green-600 hover:bg-white/20'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                Interview Support
              </button>
            </div>

            {/* Right side — theme toggle + auth actions */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
              </button>

              {!loading && isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`flex items-center gap-2 pl-1 pr-3 py-1 rounded-full transition-colors border ${
                      userMenuOpen
                        ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {/* Avatar */}
                    {user?.picture ? (
                      <img
                        src={user.picture}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                        {userInitial}
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                      {user?.name?.split(' ')[0] || 'Account'}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
                        userMenuOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 py-1.5 z-50"
                      >
                        {/* User info */}
                        <div className="px-4 py-2.5 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {user?.name || 'User'}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {user?.email || ''}
                          </p>
                        </div>

                        <button
                          onClick={() => go('/dashboard')}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-gray-400" />
                          My Dashboard
                        </button>

                        {isStaff && (
                          <button
                            onClick={() => go(isAdmin ? '/admin' : '/admin/courses')}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-purple-700 hover:bg-purple-50 transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4 text-purple-500" />
                            {isAdmin ? 'Admin Panel' : 'Course Studio'}
                          </button>
                        )}

                        <div className="border-t border-gray-100 mt-1 pt-1">
                          <button
                            onClick={() => {
                              setUserMenuOpen(false);
                              logout();
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : !loading ? (
                <button
                  onClick={login}
                  className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold overflow-hidden transition-all duration-300 border border-blue-200 bg-blue-50/50 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <LogIn className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors duration-300 relative z-10" />
                  <span className="text-blue-600 group-hover:text-white transition-colors duration-300 relative z-10">
                    Sign In
                  </span>
                </button>
              ) : (
                <div className="w-20 h-8 rounded-full bg-gray-100 animate-pulse" />
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Slide-in panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[85vw] bg-white dark:bg-gray-950 shadow-2xl lg:hidden overflow-y-auto"
            >
              {/* Panel header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
                <Logo size="small" />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Mobile theme toggle */}
              <div className="mx-4 mt-3">
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </span>
                  <span className={`w-8 h-5 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-blue-500' : 'bg-gray-300'}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${theme === 'dark' ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
                  </span>
                </button>
              </div>

              {/* User card (if logged in) */}
              {!loading && isAuthenticated && (
                <div className="mx-4 mt-4 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border border-blue-100 dark:border-blue-900">
                  <div className="flex items-center gap-3">
                    {user?.picture ? (
                      <img
                        src={user.picture}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow">
                        {userInitial}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user?.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email || ''}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Nav links */}
              <div className="p-4 space-y-1">
                {navLinks.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => scrollTo(item.href)}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                  >
                    {item.name}
                  </button>
                ))}

                <div className="border-t border-gray-100 my-2" />

                <button
                  onClick={() => go('/courses')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2.5 transition-colors ${
                    isActive('/courses')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  Courses
                </button>

                <button
                  onClick={() => go('/ai-program')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2.5 transition-colors ${
                    isActive('/ai-program')
                      ? 'text-purple-700 bg-purple-50'
                      : 'text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Gen AI Program
                </button>

                <button
                  onClick={() => {
                    if (isAuthenticated) {
                      go('/interview-support');
                    } else {
                      router.push(`/sign-in?redirect_url=/interview-support`);
                    }
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2.5 transition-colors ${
                    isActive('/interview-support')
                      ? 'text-green-600 bg-green-50'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-green-600'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  Interview Support
                </button>

                {!loading && isAuthenticated && (
                  <>
                    <div className="border-t border-gray-100 my-2" />

                    <button
                      onClick={() => go('/dashboard')}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2.5 transition-colors ${
                        isActive('/dashboard')
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      My Dashboard
                    </button>

                    {isStaff && (
                      <button
                        onClick={() => go(isAdmin ? '/admin' : '/admin/courses')}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2.5 transition-colors ${
                          pathname.startsWith('/admin')
                            ? 'text-purple-700 bg-purple-50'
                            : 'text-purple-600 hover:bg-purple-50'
                        }`}
                      >
                        <ShieldCheck className="w-4 h-4" />
                        {isAdmin ? 'Admin Panel' : 'Course Studio'}
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Bottom action */}
              <div className="p-4 border-t border-gray-100 mt-auto">
                {!loading && isAuthenticated ? (
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                ) : !loading ? (
                  <button
                    onClick={() => {
                      login();
                      setMobileOpen(false);
                    }}
                    className="group relative w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold overflow-hidden rounded-xl border border-blue-200 bg-blue-50/50 hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                    <LogIn className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors duration-300 relative z-10" />
                    <span className="text-blue-600 group-hover:text-white transition-colors duration-300 relative z-10">
                      Sign In / Sign Up
                    </span>
                  </button>
                ) : null}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
