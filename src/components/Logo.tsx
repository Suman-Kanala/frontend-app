'use client';

import React from 'react';

type LogoSize = 'small' | 'default' | 'large';

interface SizeConfig {
  height: number;
  fontSize: number;
  subSize: number;
}

interface LogoProps {
  className?: string;
  size?: LogoSize;
}

export default function Logo({ className = '', size = 'default' }: LogoProps) {
  const sizes: Record<LogoSize, SizeConfig> = {
    small: { height: 28, fontSize: 16, subSize: 8 },
    default: { height: 36, fontSize: 20, subSize: 9 },
    large: { height: 48, fontSize: 28, subSize: 12 },
  };

  const s = sizes[size] || sizes.default;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Icon mark */}
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ height: s.height, width: s.height }}
      >
        <defs>
          <linearGradient id="logo-grad-1" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <linearGradient id="logo-grad-2" x1="10" y1="8" x2="30" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
        {/* Rounded square background */}
        <rect x="0" y="0" width="40" height="40" rx="10" fill="url(#logo-grad-1)" />
        {/* Abstract "S" path — stylized career growth arrow */}
        <path
          d="M12 28C12 28 15 22 20 22C25 22 25 18 20 18C15 18 15 14 20 14C25 14 28 8 28 8"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Upward arrow tip */}
        <path
          d="M25 8L28 8L28 11"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Small dot accent */}
        <circle cx="12" cy="30" r="2" fill="url(#logo-grad-2)" opacity="0.8" />
      </svg>

      {/* Text */}
      <div className="flex flex-col leading-none">
        <span
          className="font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          style={{ fontSize: s.fontSize }}
        >
          Saanvi
        </span>
        <span
          className="font-medium tracking-widest uppercase text-gray-500"
          style={{ fontSize: s.subSize }}
        >
          Careers
        </span>
      </div>
    </div>
  );
}
