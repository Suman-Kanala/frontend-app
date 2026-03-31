'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { Code, Wrench, Heart, DollarSign, GraduationCap, LucideIcon } from 'lucide-react';

interface IndustryItem {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

interface IndustriesProps {
  // Currently no props needed
}

const Industries: React.FC<IndustriesProps> = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const industries: IndustryItem[] = [
    {
      icon: Code,
      title: 'IT & Software',
      description: 'Full-stack developers, DevOps engineers, data scientists, and tech leaders',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Wrench,
      title: 'Engineering',
      description: 'Mechanical, electrical, civil, and software engineering positions',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Heart,
      title: 'Healthcare',
      description: 'Medical professionals, nurses, healthcare administrators, and specialists',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: DollarSign,
      title: 'Finance',
      description: 'Financial analysts, accountants, investment advisors, and fintech experts',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: GraduationCap,
      title: 'Entry Level',
      description: 'Fresh graduates and career starters across all industries',
      color: 'from-indigo-500 to-blue-500',
    }
  ];

  return (
    <section id="industries" className="py-20 relative">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-gray-100">
            Industries We <span className="gradient-text">Serve</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            From cutting-edge technology to essential healthcare services, we connect talent across diverse sectors that shape our world.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {industries.map((industry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 * index }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 rounded-2xl p-8 group cursor-pointer shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${industry.color} rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <industry.icon className="text-white" size={32} />
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">{industry.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{industry.description}</p>
              
            </motion.div>
          ))}
        </div>

        {/* Industry Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="neumorphism rounded-2xl p-8"
        >
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold gradient-text mb-2">85%</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">Average Salary Increase</div>
            </div>
            <div>
              <div className="text-3xl font-bold gradient-text mb-2">30 Days</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">Average Placement Time</div>
            </div>
            <div>
              <div className="text-3xl font-bold gradient-text mb-2">98%</div>
              <div className="text-gray-600 dark:text-gray-400">Client Satisfaction Rate</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Industries;
