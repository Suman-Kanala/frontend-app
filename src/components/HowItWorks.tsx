'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { UserPlus, Search, MessageSquare, Briefcase, Building, Users, LucideIcon } from 'lucide-react';

interface WorkStep {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface HowItWorksProps {
  // Currently no props needed
}

const HowItWorks: React.FC<HowItWorksProps> = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const jobSeekerSteps: WorkStep[] = [
    {
      icon: UserPlus,
      title: 'Create Profile',
      description: 'Build your professional profile with skills, experience, and career goals'
    },
    {
      icon: Search,
      title: 'Get Matched',
      description: 'Our AI algorithm finds opportunities that perfectly match your profile'
    },
    {
      icon: MessageSquare,
      title: 'Interview Prep',
      description: 'Receive personalized coaching and interview preparation support'
    },
    {
      icon: Briefcase,
      title: 'Land Your Job',
      description: 'Secure your dream position with our end-to-end placement support'
    }
  ];

  const employerSteps: WorkStep[] = [
    {
      icon: Building,
      title: 'Post Requirements',
      description: 'Share your hiring needs, company culture, and ideal candidate profile'
    },
    {
      icon: Users,
      title: 'Candidate Screening',
      description: 'We pre-screen and present only the most qualified candidates'
    },
    {
      icon: MessageSquare,
      title: 'Interview Process',
      description: 'Streamlined interview coordination and candidate evaluation'
    },
    {
      icon: Briefcase,
      title: 'Successful Hire',
      description: 'Onboard your new team member with our placement guarantee'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 relative bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-gray-100">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Our streamlined process ensures success for both job seekers and employers through personalized matching and expert guidance.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Job Seekers Process */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-center mb-8 gradient-text">For Job Seekers</h3>
            <div className="space-y-6">
              {jobSeekerSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-start space-x-4 glass-effect rounded-xl p-6"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <step.icon className="text-white" size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">{step.title}</h4>
                    <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                  </div>
                  <div className="text-2xl font-bold text-blue-400 dark:text-blue-500 flex-shrink-0">
                    {index + 1}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Employers Process */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold text-center mb-8 gradient-text">For Employers</h3>
            <div className="space-y-6">
              {employerSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-start space-x-4 glass-effect rounded-xl p-6"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <step.icon className="text-white" size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">{step.title}</h4>
                    <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                  </div>
                  <div className="text-2xl font-bold text-purple-400 dark:text-purple-500 flex-shrink-0">
                    {index + 1}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Success Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 neumorphism rounded-2xl p-8"
        >
          <h3 className="text-xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">Why Our Process Works</h3>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold gradient-text mb-2">72 Hours</div>
              <div className="text-gray-600 dark:text-gray-400">Average Response Time</div>
            </div>
            <div>
              <div className="text-2xl font-bold gradient-text mb-2">4.9/5</div>
              <div className="text-gray-600 dark:text-gray-400">Client Rating</div>
            </div>
            <div>
              <div className="text-2xl font-bold gradient-text mb-2">92%</div>
              <div className="text-gray-600 dark:text-gray-400">First Interview Success</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;