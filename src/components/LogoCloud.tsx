'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/* Stripe Partners-page shadow: 0 11px 17px rgba(15,37,61,.15), 0 4px 7px rgba(15,37,61,.1) */
const CARD_SHADOW = '0 11px 17px rgba(15,37,61,.13), 0 4px 7px rgba(15,37,61,.08)';

const logos = [
  { name: 'TCS',           src: '/logos/tcs.svg'          },
  { name: 'Infosys',       src: '/logos/infosys.svg'      },
  { name: 'Wipro',         src: '/logos/wipro.svg'        },
  { name: 'HCLTech',       src: '/logos/hcltech.svg'      },
  { name: 'Google',        src: '/logos/google.svg'       },
  { name: 'Microsoft',     src: '/logos/microsoft.png'    },
  { name: 'Amazon',        src: '/logos/amazon.png'       },
  { name: 'Flipkart',      src: '/logos/flipkart.png'     },
  { name: 'Goldman Sachs', src: '/logos/goldmansachs.svg' },
  { name: 'Deloitte',      src: '/logos/deloitte.png'     },
  { name: 'Accenture',     src: '/logos/accenture.svg'    },
  { name: 'IBM',           src: '/logos/ibm.png'          },
  { name: 'Meta',          src: '/logos/meta.svg'         },
  { name: 'Razorpay',      src: '/logos/razorpay.svg'     },
  { name: 'Zoho',          src: '/logos/zoho.svg'         },
  { name: 'Zomato',        src: '/logos/zomato.svg'       },
];

const row1 = logos.slice(0, 8);
const row2 = logos.slice(8);

/* Single logo card — Stripe Partners style */
function LogoCard({ name, src }: { name: string; src: string }) {
  return (
    <div
      className="
        flex-shrink-0 group
        w-[104px] h-[76px]
        bg-white dark:bg-[#0d1f33]
        rounded-2xl
        flex flex-col items-center justify-center gap-2
        cursor-default
        transition-transform duration-300
        hover:-translate-y-1
      "
      style={{ boxShadow: CARD_SHADOW }}
    >
      <img
        src={src}
        alt={name}
        loading="lazy"
        className="
          h-7 w-auto max-w-[72px] object-contain
          grayscale opacity-50
          group-hover:grayscale-0 group-hover:opacity-100
          transition-all duration-350
        "
      />
    </div>
  );
}

/* ──────────────────────────────────────────────── */

export default function LogoCloud() {
  const ref      = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section
      ref={ref}
      className="py-20 bg-white dark:bg-[#07101d] border-y border-[#E6EBF1] dark:border-white/[0.05] overflow-hidden"
    >
      {/* Label */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="
          text-center text-[11px] font-bold uppercase
          tracking-[0.22em] text-[#697386] dark:text-[#8898aa]
          mb-10
        "
      >
        Our candidates work at
      </motion.p>

      {/* Row 1 — scrolls left */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative mb-5"
      >
        {/* Fade masks */}
        <div className="absolute left-0 inset-y-0 w-28 z-10 pointer-events-none
          bg-gradient-to-r from-white dark:from-[#07101d] to-transparent" />
        <div className="absolute right-0 inset-y-0 w-28 z-10 pointer-events-none
          bg-gradient-to-l from-white dark:from-[#07101d] to-transparent" />

        <div
          className="flex gap-4 items-center marquee-left"
          style={{ width: 'max-content' }}
        >
          {[...row1, ...row1, ...row1, ...row1].map((l, i) => (
            <LogoCard key={i} name={l.name} src={l.src} />
          ))}
        </div>
      </motion.div>

      {/* Row 2 — scrolls right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.18 }}
        className="relative"
      >
        <div className="absolute left-0 inset-y-0 w-28 z-10 pointer-events-none
          bg-gradient-to-r from-white dark:from-[#07101d] to-transparent" />
        <div className="absolute right-0 inset-y-0 w-28 z-10 pointer-events-none
          bg-gradient-to-l from-white dark:from-[#07101d] to-transparent" />

        <div
          className="flex gap-4 items-center marquee-right"
          style={{ width: 'max-content' }}
        >
          {[...row2, ...row2, ...row2, ...row2].map((l, i) => (
            <LogoCard key={i} name={l.name} src={l.src} />
          ))}
        </div>
      </motion.div>

      {/* Stats footnote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex items-center justify-center gap-8 mt-10 flex-wrap"
      >
        {[
          { v: '3,200+', l: 'successful placements' },
          { v: '120+',   l: 'hiring partners'       },
          { v: '18',     l: 'countries reached'     },
        ].map((s, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <span className="hidden sm:block w-px h-7 bg-[#E6EBF1] dark:bg-white/10" />
            )}
            <div className="text-center">
              <p className="text-xl font-extrabold text-[#0a2540] dark:text-white tracking-tight leading-none">
                {s.v}
              </p>
              <p className="text-[11px] text-[#697386] mt-1">{s.l}</p>
            </div>
          </React.Fragment>
        ))}
      </motion.div>
    </section>
  );
}
