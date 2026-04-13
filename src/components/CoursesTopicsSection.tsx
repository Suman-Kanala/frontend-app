import React from 'react';
import Link from 'next/link';
import { learningTopics } from '@/data/learningTopics';

interface CategoryColors {
  [key: string]: string;
}

interface CoursesTopicsSectionProps {
  // Currently no props needed
}

const categoryColors: CategoryColors = {
  Roadmap: 'bg-[#f0effe] text-[#635bff] border-[#635bff]/20',
  Tutorial: 'bg-green-50 text-green-700 border-green-200',
  Career: 'bg-[#f0effe] text-[#0a2540] border-[#0a2540]/20',
  'AI & Career': 'bg-orange-50 text-orange-700 border-orange-200',
};

const CoursesTopicsSection: React.FC<CoursesTopicsSectionProps> = () => {
  return (
    <section className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/30 py-14 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Career Guides & Roadmaps
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Free guides to help you plan your learning path and career.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {learningTopics.map((topic) => (
            <Link
              key={topic.slug}
              href={`/learn/${topic.slug}`}
              className="group block p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-[#635bff]/40 dark:hover:border-[#635bff]/40 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${categoryColors[topic.category] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                  {topic.category}
                </span>
                <span className="text-xs text-gray-400">{topic.readTime}</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-[#635bff] dark:group-hover:text-[#7a73ff] transition-colors line-clamp-2">
                {topic.headline}
              </h3>
              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                {topic.description.slice(0, 100)}…
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesTopicsSection;
