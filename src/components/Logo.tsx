'use client';

import React from 'react';

type LogoSize = 'small' | 'default' | 'large';
interface LogoProps {
  className?: string;
  size?: LogoSize;
  light?: boolean;
}

const cfg = {
  small:   { box: 30, name: 14,   sub: 6,   gap: 9  },
  default: { box: 38, name: 18.5, sub: 7.5, gap: 11 },
  large:   { box: 52, name: 25,   sub: 10,  gap: 14 },
};

/* ─────────────────────────────────────────────────────────────
   CONCEPT — "Aurora"

   A single stroke traces the letter S — the brand initial.
   The stroke is rendered as a layered neon aurora:
   six overlapping passes from a wide, near-invisible halo
   all the way down to a razor-thin bright filament at the core.

   The effect looks like light passing through charged particles —
   the same phenomenon that makes the northern lights glow.

   Career metaphor:
     Origin dot  (deep indigo, bottom-left) = today
     Destination (blazing violet, top-right)  = the offer you land

   The journey between them glows.
───────────────────────────────────────────────────────────── */

// S path: bottom-left origin → top-right destination
// Bottom bowl bulges right; top bowl bulges left — clean S geometry.
const PATH = 'M 13,34 C 28,34 31,22 22,22 C 13,22 16,10 31,10';

// Faint echo offset by +1 in x and y — creates floating depth
const ECHO = 'M 14,35 C 29,35 32,23 23,23 C 14,23 17,11 32,11';

export default function Logo({ className = '', size = 'default', light = false }: LogoProps) {
  const { box, name, sub, gap } = cfg[size] ?? cfg.default;

  return (
    <div className={`inline-flex items-center select-none ${className}`} style={{ gap }}>

      {/* ── Mark ───────────────────────────────────────── */}
      <svg
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: box, height: box, flexShrink: 0, display: 'block' }}
        aria-hidden="true"
      >
        <defs>
          {/* Deep space background */}
          <linearGradient id="sky" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#09102a" />
            <stop offset="100%" stopColor="#040810" />
          </linearGradient>

          {/* Subtle top-left glass sheen */}
          <linearGradient id="sheen" x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="white" stopOpacity="0.06" />
            <stop offset="100%" stopColor="white" stopOpacity="0"    />
          </linearGradient>

          {/* Main aurora gradient — deep indigo at origin → blazing violet at destination */}
          <linearGradient id="aurora" x1="13" y1="34" x2="31" y2="10" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#3730a3" />
            <stop offset="38%"  stopColor="#635bff" />
            <stop offset="72%"  stopColor="#818cf8" />
            <stop offset="100%" stopColor="#ddd6fe" />
          </linearGradient>

          {/* Wide outer-glow gradient — broader colour spread */}
          <linearGradient id="halo" x1="13" y1="34" x2="31" y2="10" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#4338ca" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>

          {/* Destination radial glow */}
          <radialGradient id="d-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#ddd6fe" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#ddd6fe" stopOpacity="0"    />
          </radialGradient>

          {/* Origin radial glow */}
          <radialGradient id="o-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#4338ca" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#4338ca" stopOpacity="0"    />
          </radialGradient>
        </defs>

        {/* ── Night-sky background ───────────────── */}
        <rect width="44" height="44" rx="11" fill="url(#sky)"  />
        <rect width="44" height="44" rx="11" fill="url(#sheen)"/>

        {/* Ambient stardust — micro dots for depth */}
        <circle cx="6"  cy="7"  r="0.5"  fill="white" opacity="0.28" />
        <circle cx="38" cy="12" r="0.45" fill="white" opacity="0.22" />
        <circle cx="9"  cy="38" r="0.4"  fill="white" opacity="0.18" />
        <circle cx="37" cy="37" r="0.5"  fill="white" opacity="0.14" />
        <circle cx="21" cy="3"  r="0.35" fill="white" opacity="0.20" />

        {/* ── Depth echo (faint offset S — floating effect) ── */}
        <path d={ECHO} stroke="#635bff" strokeWidth="2.5"
          strokeLinecap="round" opacity="0.07" />

        {/* ── Aurora glow stack (wide → tight → core) ───── */}
        {/* Layer 1 — outermost diffuse halo */}
        <path d={PATH} stroke="url(#halo)" strokeWidth="20"
          strokeLinecap="round" opacity="0.04" />
        {/* Layer 2 */}
        <path d={PATH} stroke="url(#halo)" strokeWidth="14"
          strokeLinecap="round" opacity="0.07" />
        {/* Layer 3 */}
        <path d={PATH} stroke="url(#halo)" strokeWidth="9.5"
          strokeLinecap="round" opacity="0.12" />
        {/* Layer 4 — mid aurora band */}
        <path d={PATH} stroke="url(#aurora)" strokeWidth="6"
          strokeLinecap="round" opacity="0.22" />
        {/* Layer 5 — main stroke */}
        <path d={PATH} stroke="url(#aurora)" strokeWidth="3.6"
          strokeLinecap="round" />
        {/* Layer 6 — bright core filament */}
        <path d={PATH} stroke="white" strokeWidth="1.1"
          strokeLinecap="round" opacity="0.52" />

        {/* ── Origin dot — where the journey starts ── */}
        <circle cx="13" cy="34" r="8"   fill="url(#o-glow)" />
        <circle cx="13" cy="34" r="3.0" fill="#3730a3" />
        <circle cx="13" cy="34" r="1.2" fill="white"   opacity="0.38" />

        {/* ── Destination — where they land ──────── */}
        <circle cx="31" cy="10" r="12"  fill="url(#d-glow)" />
        <circle cx="31" cy="10" r="3.6" fill="#ddd6fe" />
        <circle cx="31" cy="10" r="1.6" fill="white"   opacity="0.96" />

        {/* 4-point star-burst on destination */}
        <line x1="31" y1="5.0"  x2="31" y2="15.0"
          stroke="white" strokeWidth="0.85" strokeLinecap="round" opacity="0.72" />
        <line x1="26.0" y1="10" x2="36.0" y2="10"
          stroke="white" strokeWidth="0.85" strokeLinecap="round" opacity="0.72" />
        <line x1="27.8" y1="6.8"  x2="34.2" y2="13.2"
          stroke="white" strokeWidth="0.55" strokeLinecap="round" opacity="0.30" />
        <line x1="34.2" y1="6.8"  x2="27.8" y2="13.2"
          stroke="white" strokeWidth="0.55" strokeLinecap="round" opacity="0.30" />

      </svg>

      {/* ── Wordmark ─────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3.5, lineHeight: 1 }}>

        {/* Brand name */}
        <span style={{
          fontSize: name,
          fontWeight: 800,
          letterSpacing: '-0.028em',
          color: light ? '#ffffff' : '#0a2540',
          lineHeight: 1,
        }}>
          Saanvi
        </span>

        {/* Descriptor */}
        <span style={{
          fontSize: sub,
          fontWeight: 700,
          letterSpacing: '0.19em',
          textTransform: 'uppercase' as const,
          color: '#635bff',
          lineHeight: 1,
        }}>
          Careers
        </span>

      </div>

    </div>
  );
}
