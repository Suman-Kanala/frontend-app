'use client';

import React from 'react';

type LogoSize = 'small' | 'default' | 'large';

interface LogoProps {
  className?: string;
  size?: LogoSize;
}

const sizeMap = {
  small:   { iconH: 28, nameSize: 15, tagSize: 7.5 },
  default: { iconH: 36, nameSize: 19, tagSize: 9 },
  large:   { iconH: 52, nameSize: 27, tagSize: 12 },
};

export default function Logo({ className = '', size = 'default' }: LogoProps) {
  const { iconH, nameSize, tagSize } = sizeMap[size] ?? sizeMap.default;

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ height: iconH, width: iconH, flexShrink: 0 }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="saanvi-bg"
            x1="0" y1="0" x2="40" y2="40"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#0a2540" />
            <stop offset="100%" stopColor="#635bff" />
          </linearGradient>
          <clipPath id="saanvi-clip">
            <rect width="40" height="40" rx="10" />
          </clipPath>
        </defs>

        {/* Gradient background */}
        <rect width="40" height="40" rx="10" fill="url(#saanvi-bg)" />

        {/* Subtle top highlight */}
        <rect
          width="40"
          height="22"
          fill="white"
          fillOpacity="0.07"
          clipPath="url(#saanvi-clip)"
        />

        {/* S lettermark — smooth flowing path suggesting upward growth */}
        <path
          d="M26 12C26 8 14 8 14 15C14 20 26 20 26 25C26 32 14 32 14 28"
          stroke="white"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* 4-pointed star sparkle accent (top-right) */}
        <path
          d="M30 7L30.7 9.3L33 10L30.7 10.7L30 13L29.3 10.7L27 10L29.3 9.3Z"
          fill="white"
          fillOpacity="0.95"
        />
      </svg>

      <div className="flex flex-col leading-none gap-px">
        <span
          className="font-bold tracking-tight text-[#0a2540] dark:text-white"
          style={{ fontSize: nameSize }}
        >
          Saanvi
        </span>
        <span
          className="font-semibold tracking-[0.2em] uppercase text-slate-500"
          style={{ fontSize: tagSize }}
        >
          Careers
        </span>
      </div>
    </div>
  );
}
