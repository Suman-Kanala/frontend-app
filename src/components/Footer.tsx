'use client';

import React from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Send,
  MessageCircle,
  LucideIcon,
} from "lucide-react";
import { useRouter, usePathname } from 'next/navigation';
import Logo from "@/components/Logo";

interface FooterLink {
  name: string;
  href: string;
  isRoute?: boolean;
}

interface SocialLink {
  icon: LucideIcon;
  name: string;
  url: string;
}

interface FooterProps {
  // Currently no props needed - component uses context
}

const Footer: React.FC<FooterProps> = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavClick = (href: string): void => {
    if (pathname !== '/') {
      router.push('/');
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const quickLinks: FooterLink[] = [
    { name: "About Us", href: "#about" },
    { name: "Industries", href: "#industries" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Global Presence", href: "#global" },
    { name: "Contact Us", href: "#contact" },
    { name: "Gen AI Program", href: "/ai-program", isRoute: true },
  ];

  const industries: FooterLink[] = [
    { name: "IT & Software", href: "#industries" },
    { name: "Engineering", href: "#industries" },
    { name: "Healthcare", href: "#industries" },
    { name: "Finance", href: "#industries" },
    { name: "Entry Level", href: "#industries" },
  ];

  const locations: FooterLink[] = [
    { name: "India", href: "#global" },
    { name: "United States", href: "#global" },
    { name: "Canada", href: "#global" },
    { name: "Australia", href: "#global" },
    { name: "European Union", href: "#global" },
    { name: "Gulf Countries", href: "#global" },
  ];

  const socialLinks: SocialLink[] = [
    {
      icon: Linkedin,
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/saanvi-careers-8a86a2379",
    },
    {
      icon: Facebook,
      name: "Facebook",
      url: "https://www.facebook.com/profile.php?id=61579327944939",
    },
    {
      icon: Twitter,
      name: "X",
      url: "https://x.com/SaanviCareers",
    },
    {
      icon: Instagram,
      name: "Instagram",
      url: "https://www.instagram.com/saanvicareers/",
    },
    {
      icon: Send,
      name: "Telegram",
      url: "https://t.me/SaanviCareers",
    },
    {
      icon: MessageCircle,
      name: "WhatsApp",
      url: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918074172398"}?text=Hi%2C%20I%20want%20to%20know%20about%20Saanvi%20Careers`,
    },
  ];

  return (
    <footer className="bg-gray-100 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-5 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                <Logo size="default" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                Connecting exceptional talent with transformative opportunities
                across the globe. Your trusted partner in career advancement and
                talent acquisition.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="text-blue-500" size={18} />
                  <span className="text-gray-600 dark:text-gray-400">
                    contact@saanvicareers.com
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="text-green-500" size={18} />
                  <span className="text-gray-600 dark:text-gray-400">+91 8074172398</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="text-purple-500" size={18} />
                  <span className="text-gray-600 dark:text-gray-400">
                    Global Offices Worldwide
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4 block">
              Quick Links
            </span>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      if (link.isRoute) {
                        router.push(link.href);
                        window.scrollTo(0, 0);
                      } else {
                        handleNavClick(link.href);
                      }
                    }}
                    className={`hover:text-blue-500 transition-colors duration-200 text-left block ${
                      link.isRoute
                        ? "text-blue-600 font-semibold"
                        : "text-gray-600"
                    }`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Industries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4 block">
              Industries
            </span>
            <ul className="space-y-2">
              {industries.map((industry, index) => (
                <li key={index}>
                  <a
                    href={industry.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(industry.href);
                    }}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 text-left block"
                  >
                    {industry.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Locations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <span className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4 block">
              Locations
            </span>
            <ul className="space-y-2">
              {locations.map((location, index) => (
                <li key={index}>
                  <a
                    href={location.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(location.href);
                    }}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 text-left block"
                  >
                    {location.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <p className="text-gray-500 dark:text-gray-400 text-center md:text-left">
              &copy; 2024 Saanvi Careers. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                    social.name === "WhatsApp"
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  }`}
                  aria-label={social.name}
                >
                  <social.icon className="text-white" size={18} />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
