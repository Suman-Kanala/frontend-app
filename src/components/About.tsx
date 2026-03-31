'use client';

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { Target, Users, Award, Zap, FileText, Briefcase, LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface AboutProps {
  // Currently no props needed
}

const About: React.FC<AboutProps> = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const features: Feature[] = [
    {
      icon: Target,
      title: "Precision Matching",
      description:
        "Advanced algorithms match candidates with perfect-fit opportunities",
    },
    {
      icon: Users,
      title: "Expert Guidance",
      description: "Dedicated career consultants provide personalized support",
    },
    {
      icon: FileText,
      title: "Resume Guidance",
      description: "Craft a standout resume with our expert assistance",
    },
    {
      icon: Briefcase,
      title: "Interview Coaching",
      description: "Prepare to impress with our tailored interview coaching",
    },
    {
      icon: Award,
      title: "Quality Assurance",
      description: "Rigorous vetting process ensures top-tier placements",
    },
    {
      icon: Zap,
      title: "Fast Placement",
      description: "Streamlined process gets you hired 3x faster",
    },
  ];

  return (
    <section id="about" className="py-20 relative bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-gray-100">
            About <span className="gradient-text">Saanvi Careers</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            We're not just another employment service. We're career architects,
            building bridges between exceptional talent and transformative
            opportunities across the globe.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img
              alt="Professional IT team working on computers in a modern office"
              className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              src="https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aXQlMjBjb21wYW55fGVufDB8fDB8fHww"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Transforming Careers, One Connection at a Time
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-base">
              Founded with a vision to revolutionize employment services, Saanvi
              Careers has become a trusted partner for both job seekers and
              employers worldwide. Our innovative approach combines cutting-edge
              technology with human expertise.
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-base">
              We specialize in connecting top talent with leading companies
              across IT & Software, Engineering, Healthcare, Finance, and
              entry-level positions, ensuring perfect matches that drive mutual
              success.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 * index }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="neumorphism dark:bg-gray-800 dark:shadow-none rounded-2xl p-6 text-center group"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="text-white" size={32} />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
                {feature.title}
              </h4>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
