'use client';

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { Users } from "lucide-react";

interface GlobalPresenceProps {
  // Currently no props needed
}

const GlobalPresence: React.FC<GlobalPresenceProps> = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.2,
  });

  return (
    <section id="global" className="py-20 relative">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-gray-100">
            Global <span className="gradient-text">Presence</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            With a presence across six major regions, we provide 24/7 support
            and local expertise to connect talent worldwide.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* India */}
          <motion.div
            initial={{ opacity: 0, y: 50, rotateY: -15 }}
            animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            whileHover={{
              scale: 1.05,
              y: -10,
              rotateY: 5,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 group cursor-pointer shadow-md overflow-hidden"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="relative h-48 mb-6 -m-6">
              <img
                alt="Modern cityscape of Mumbai, India"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                src="https://images.unsplash.com/photo-1518918249916-0a72d4f98658?w=600&q=60&auto=format&fit=crop"
                loading="lazy"
                width="600"
                height="300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white">
                India
              </h3>
            </div>
            <div className="flex items-start space-x-2">
              <Users className="text-purple-500 mt-1 flex-shrink-0" size={16} />
              <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                IT, Engineering, Healthcare
              </span>
            </div>
          </motion.div>
          {/* United States */}
          <motion.div
            initial={{ opacity: 0, y: 50, rotateY: -15 }}
            animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{
              scale: 1.05,
              y: -10,
              rotateY: 5,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 group cursor-pointer shadow-md overflow-hidden"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="relative h-48 mb-6 -m-6">
              <img
                alt="New York City skyline"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                src="https://images.unsplash.com/photo-1555503071-60fe61ffbb8d?w=600&q=60&auto=format&fit=crop"
                loading="lazy"
                width="600"
                height="300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white">
                United States
              </h3>
            </div>
            <div className="flex items-start space-x-2">
              <Users className="text-purple-500 mt-1 flex-shrink-0" size={16} />
              <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                Tech, Finance, Healthcare
              </span>
            </div>
          </motion.div>
          {/* United Kingdom */}
          <motion.div
            initial={{ opacity: 0, y: 50, rotateY: -15 }}
            animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            whileHover={{
              scale: 1.05,
              y: -10,
              rotateY: 5,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 group cursor-pointer shadow-md overflow-hidden"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="relative h-48 mb-6 -m-6">
              <img
                alt="Tower Bridge in London"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                src="https://images.unsplash.com/photo-1696521006529-94e5b7dd1486?w=600&q=60&auto=format&fit=crop"
                loading="lazy"
                width="600"
                height="300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white">
                United Kingdom
              </h3>
            </div>
            <div className="flex items-start space-x-2">
              <Users className="text-purple-500 mt-1 flex-shrink-0" size={16} />
              <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                Finance, Engineering, IT
              </span>
            </div>
          </motion.div>
          {/* Australia */}
          <motion.div
            initial={{ opacity: 0, y: 50, rotateY: -15 }}
            animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{
              scale: 1.05,
              y: -10,
              rotateY: 5,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 group cursor-pointer shadow-md overflow-hidden"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="relative h-48 mb-6 -m-6">
              <img
                alt="Sydney Opera House and Harbour Bridge"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                src="https://images.unsplash.com/photo-1464852848170-56339e078bd4?w=600&q=60&auto=format&fit=crop"
                loading="lazy"
                width="600"
                height="300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white">
                Australia
              </h3>
            </div>
            <div className="flex items-start space-x-2">
              <Users className="text-purple-500 mt-1 flex-shrink-0" size={16} />
              <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                Mining, Healthcare, IT
              </span>
            </div>
          </motion.div>
          {/* European Union */}
          <motion.div
            initial={{ opacity: 0, y: 50, rotateY: -15 }}
            animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            whileHover={{
              scale: 1.05,
              y: -10,
              rotateY: 5,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 group cursor-pointer shadow-md overflow-hidden"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="relative h-48 mb-6 -m-6">
              <img
                alt="Brandenburg Gate in Berlin"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                src="https://images.unsplash.com/photo-1641253522290-d4d9f70546ee?w=600&q=60&auto=format&fit=crop"
                loading="lazy"
                width="600"
                height="300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white">
                European Union
              </h3>
            </div>
            <div className="flex items-start space-x-2">
              <Users className="text-purple-500 mt-1 flex-shrink-0" size={16} />
              <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                Tech, Finance, Engineering
              </span>
            </div>
          </motion.div>
          {/* Gulf Countries */}
          <motion.div
            initial={{ opacity: 0, y: 50, rotateY: -15 }}
            animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{
              scale: 1.05,
              y: -10,
              rotateY: 5,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 group cursor-pointer shadow-md overflow-hidden"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="relative h-48 mb-6 -m-6">
              <img
                alt="Dubai skyline with Burj Khalifa"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                src="https://images.unsplash.com/photo-1673744943665-fc0514a23845?w=600&q=60&auto=format&fit=crop"
                loading="lazy"
                width="600"
                height="300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white">
                Gulf Countries
              </h3>
            </div>
            <div className="flex items-start space-x-2">
              <Users className="text-purple-500 mt-1 flex-shrink-0" size={16} />
              <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                Oil & Gas, Construction, Finance
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default GlobalPresence;
