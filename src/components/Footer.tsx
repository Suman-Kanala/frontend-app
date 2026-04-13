'use client';

import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Instagram, Send, MessageCircle, LucideIcon } from "lucide-react";
import { usePathname, useRouter } from 'next/navigation';
import Logo from "@/components/Logo";

interface FooterLink {
  name: string;
  href: string;
}

interface SocialLink {
  icon: LucideIcon;
  name: string;
  url: string;
}

const Footer: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavClick = (href: string): void => {
    if (pathname !== '/') {
      router.push('/');
      setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }), 100);
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const quickLinks: FooterLink[] = [
    { name: "About Us",        href: "#about" },
    { name: "Industries",      href: "#industries" },
    { name: "How It Works",    href: "#how-it-works" },
    { name: "Global Presence", href: "#global" },
    { name: "Contact Us",      href: "#contact" },
  ];

  const industries: FooterLink[] = [
    { name: "IT & Software", href: "#industries" },
    { name: "Engineering",   href: "#industries" },
    { name: "Healthcare",    href: "#industries" },
    { name: "Finance",       href: "#industries" },
    { name: "Entry Level",   href: "#industries" },
  ];

  const locations: FooterLink[] = [
    { name: "India",          href: "#global" },
    { name: "United States",  href: "#global" },
    { name: "United Kingdom", href: "#global" },
    { name: "Australia",      href: "#global" },
    { name: "European Union", href: "#global" },
    { name: "Gulf Countries", href: "#global" },
  ];

  const socialLinks: SocialLink[] = [
    { icon: Linkedin,      name: "LinkedIn",  url: "https://www.linkedin.com/in/saanvi-careers-8a86a2379" },
    { icon: Facebook,      name: "Facebook",  url: "https://www.facebook.com/profile.php?id=61579327944939" },
    { icon: Twitter,       name: "X",         url: "https://x.com/SaanviCareers" },
    { icon: Instagram,     name: "Instagram", url: "https://www.instagram.com/saanvicareers/" },
    { icon: Send,          name: "Telegram",  url: "https://t.me/SaanviCareers" },
    {
      icon: MessageCircle, name: "WhatsApp",
      url: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918074172398"}?text=Hi%2C%20I%20want%20to%20know%20about%20Saanvi%20Careers`,
    },
  ];

  const linkClass = "text-sm text-white/40 hover:text-white/80 transition-colors duration-150 block py-0.5";

  return (
    <footer className="bg-[#0a2540]">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">

        {/* Main grid */}
        <div className="grid lg:grid-cols-5 md:grid-cols-2 gap-10 mb-14">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Logo on dark bg */}
              <div className="mb-4">
                <Logo size="default" />
              </div>
              <p className="text-white/45 text-sm leading-relaxed mb-6 max-w-xs">
                Connecting exceptional talent with transformative opportunities across the globe. Your trusted partner in career advancement.
              </p>

              {/* Contact */}
              <div className="space-y-2.5">
                {[
                  { icon: Mail,   text: "contact@saanvicareers.com" },
                  { icon: Phone,  text: "+91 8074172398" },
                  { icon: MapPin, text: "Global Offices Worldwide" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <Icon size={15} className="text-[#635bff] flex-shrink-0" />
                    <span className="text-white/45 text-sm">{text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <p className="text-xs font-bold text-white/25 uppercase tracking-[0.15em] mb-4">Quick Links</p>
            <ul className="space-y-0.5">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                    className={linkClass}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Industries */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-xs font-bold text-white/25 uppercase tracking-[0.15em] mb-4">Industries</p>
            <ul className="space-y-0.5">
              {industries.map((item, i) => (
                <li key={i}>
                  <a
                    href={item.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                    className={linkClass}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Locations */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <p className="text-xs font-bold text-white/25 uppercase tracking-[0.15em] mb-4">Locations</p>
            <ul className="space-y-0.5">
              {locations.map((item, i) => (
                <li key={i}>
                  <a
                    href={item.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                    className={linkClass}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="border-t border-white/[0.08] pt-8 flex flex-col md:flex-row justify-between items-center gap-5"
        >
          <p className="text-white/30 text-sm">
            &copy; {new Date().getFullYear()} Saanvi Careers. All rights reserved.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-2.5">
            {socialLinks.map((social, i) => (
              <motion.a
                key={i}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150 ${
                  social.name === "WhatsApp"
                    ? "bg-[#25D366] hover:bg-[#1ebe5d]"
                    : "bg-white/[0.08] hover:bg-white/[0.15]"
                }`}
                aria-label={social.name}
              >
                <social.icon size={16} className="text-white" />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
