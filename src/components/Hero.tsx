'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

const Tilt = dynamic(() => import("react-parallax-tilt"), { ssr: false });

interface MousePosition {
  x: number;
  y: number;
}

interface HeroProps {
  // Currently no props needed
}

const Hero: React.FC<HeroProps> = () => {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent): void => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleGetStarted = () => {
    const contactElement = document.querySelector("#contact");
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleGenAIProgram = () => {
    router.push("/ai-program");
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      suppressHydrationWarning
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0" suppressHydrationWarning>
        <motion.div
          animate={{
            x: mousePosition.x * 0.02,
            y: mousePosition.y * 0.02,
          }}
          className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"
          suppressHydrationWarning
        />
        <motion.div
          animate={{
            x: mousePosition.x * -0.02,
            y: mousePosition.y * -0.02,
          }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          suppressHydrationWarning
        />
        <motion.div
          animate={{
            x: mousePosition.x * 0.01,
            y: mousePosition.y * 0.01,
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"
          suppressHydrationWarning
        />
      </div>

      {/* 3D Tilt effect on main hero content */}
      <Tilt
        glareEnable={true}
        glareMaxOpacity={0.2}
        glareColor="#5050ff"
        glarePosition="all"
        scale={1.04}
        perspective={1200}
        className="container mx-auto px-6 text-center relative z-10"
        tiltMaxAngleX={15}
        tiltMaxAngleY={15}
        glareBorderRadius="32px"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          suppressHydrationWarning
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
          >
            <span className="gradient-text">Careers Connected</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10 max-w-3xl mx-auto"
          >
            Bridging talent with opportunities across IT, Engineering,
            Healthcare, and Finance sectors globally. Your next career move
            starts here.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex justify-center items-center gap-4 mb-12 flex-wrap"
          >
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-10 py-6 rounded-full text-xl font-semibold group shadow-lg hover:shadow-xl transition-shadow"
            >
              Get Started
              <ArrowRight
                className="ml-3 group-hover:translate-x-1 transition-transform"
                size={24}
              />
            </Button>
            <Button
              onClick={handleGenAIProgram}
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-10 py-6 rounded-full text-xl font-semibold group shadow-lg hover:shadow-xl transition-shadow"
            >
              <Sparkles className="mr-3 group-hover:rotate-12 transition-transform" size={24} />
              Gen AI Program
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto"
          >
            {[
              { number: "10K+", label: "Jobs Placed" },
              { number: "500+", label: "Companies" },
              { number: "6", label: "Regions" },
              { number: "95%", label: "Success Rate" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-lg p-4 shadow-sm"
              >
                <div className="text-3xl md:text-4xl font-bold gradient-text">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </Tilt>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-32 left-10 w-16 h-16 bg-blue-500/10 rounded-full hidden lg:block"
      />
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute bottom-32 right-10 w-20 h-20 bg-purple-500/10 rounded-full hidden lg:block"
      />
    </section>
  );
};

export default Hero;
