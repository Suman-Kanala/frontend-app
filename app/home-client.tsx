'use client';

import Hero from '@/components/Hero';
import Contact from '@/components/Contact';
import About from '@/components/About';
import Industries from '@/components/Industries';
import HowItWorks from '@/components/HowItWorks';
import GlobalPresence from '@/components/GlobalPresence';
import Testimonials from '@/components/Testimonials';
import LogoCloud from '@/components/LogoCloud';
import CtaSection from '@/components/CtaSection';
import PaymentStatusToast from '@/components/PaymentStatusToast';

export default function HomeClient() {
  return (
    <>
      <PaymentStatusToast />
      <Hero />
      <Contact />
      <About />
      <Industries />
      <HowItWorks />
      <GlobalPresence />
      <Testimonials />
      <LogoCloud />
      <CtaSection />
    </>
  );
}
