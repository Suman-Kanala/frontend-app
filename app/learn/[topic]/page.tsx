import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { learningTopics, topicBySlug } from '@/data/learningTopics';

export const revalidate = 86400; // daily

interface LearningTopic {
  slug: string;
  title: string;
  description: string;
  headline: string;
  keywords: string[];
  category: string;
  readTime: string;
  sections: Array<{
    heading: string;
    body: string;
  }>;
  faq: Array<{
    q: string;
    a: string;
  }>;
  relatedTopics: string[];
}

interface TopicParams {
  topic: string;
}

interface TopicPageProps {
  params: Promise<TopicParams>;
}

interface FAQEntity {
  '@type': string;
  name: string;
  acceptedAnswer: {
    '@type': string;
    text: string;
  };
}

interface FAQSchema {
  '@context': string;
  '@type': string;
  mainEntity: FAQEntity[];
}

interface ArticleSchema {
  '@context': string;
  '@type': string;
  headline: string;
  description: string;
  url: string;
  publisher: {
    '@type': string;
    name: string;
    url: string;
  };
}

export function generateStaticParams(): TopicParams[] {
  return learningTopics.map((t: LearningTopic) => ({ topic: t.slug }));
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const topic = topicBySlug[resolvedParams.topic] as LearningTopic | undefined;
  if (!topic) return {};
  return {
    title: topic.title,
    description: topic.description,
    keywords: topic.keywords,
    openGraph: {
      title: topic.title,
      description: topic.description,
      type: 'article',
      url: `https://saanvicareers.com/learn/${topic.slug}`,
    },
    alternates: { canonical: `https://saanvicareers.com/learn/${topic.slug}` },
  };
}

interface SchemaResult {
  faqSchema: FAQSchema;
  articleSchema: ArticleSchema;
}

function buildSchema(topic: LearningTopic): SchemaResult {
  const faqSchema: FAQSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: topic.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
  const articleSchema: ArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: topic.headline,
    description: topic.description,
    url: `https://saanvicareers.com/learn/${topic.slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'Saanvi Careers',
      url: 'https://saanvicareers.com',
    },
  };
  return { faqSchema, articleSchema };
}

interface CategoryColors {
  [key: string]: string;
}

const categoryColors: CategoryColors = {
  Roadmap: 'bg-blue-100 text-blue-700',
  Tutorial: 'bg-green-100 text-green-700',
  Career: 'bg-purple-100 text-purple-700',
  'AI & Career': 'bg-orange-100 text-orange-700',
};

export default async function LearnTopicPage({ params }: TopicPageProps): Promise<JSX.Element> {
  const resolvedParams = await params;
  const topic = topicBySlug[resolvedParams.topic] as LearningTopic | undefined;
  if (!topic) notFound();

  const { faqSchema, articleSchema } = buildSchema(topic);
  const relatedTopics = topic.relatedTopics
    .map((slug: string) => topicBySlug[slug] as LearningTopic | undefined)
    .filter(Boolean) as LearningTopic[];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <div className="min-h-screen bg-white dark:bg-gray-950">
        {/* Hero */}
        <section className="border-b border-gray-200/60 dark:border-gray-700/60 py-14 md:py-18 px-4 md:px-6 bg-gradient-to-br from-blue-50/60 via-white to-purple-50/40 dark:from-gray-900 dark:to-gray-950">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[topic.category] || 'bg-gray-100 text-gray-600'}`}>
                {topic.category}
              </span>
              <span className="text-xs text-gray-400">{topic.readTime}</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
              {topic.headline}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              {topic.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                Browse Courses →
              </Link>
              <Link
                href="/ai-program"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-purple-200 text-purple-700 text-sm font-semibold hover:bg-purple-50 transition-colors"
              >
                ✦ Gen AI Program
              </Link>
            </div>
          </div>
        </section>

        {/* Content */}
        <article className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="space-y-10">
            {topic.sections.map((section, i) => (
              <section key={i}>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {section.heading}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base md:text-lg">
                  {section.body}
                </p>
              </section>
            ))}
          </div>

          {/* CTA banner */}
          <div className="mt-14 p-6 md:p-8 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <h2 className="text-xl md:text-2xl font-bold mb-2">Ready to start learning?</h2>
            <p className="text-blue-100 mb-6 text-sm md:text-base">
              Saanvi Careers offers structured courses with expert mentorship and placement support.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/courses"
                className="px-5 py-2.5 rounded-xl bg-white text-blue-700 text-sm font-bold hover:bg-blue-50 transition-colors"
              >
                View All Courses
              </Link>
              <Link
                href="/ai-program"
                className="px-5 py-2.5 rounded-xl bg-white/10 border border-white/30 text-white text-sm font-semibold hover:bg-white/20 transition-colors"
              >
                Gen AI Program
              </Link>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-14">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {topic.faq.map((item, i) => (
                <div key={i} className="border-b border-gray-100 dark:border-gray-800 pb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.q}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </article>

        {/* Related topics */}
        {relatedTopics.length > 0 && (
          <section className="border-t border-gray-100 dark:border-gray-800 py-12 px-4 md:px-6 bg-gray-50/60 dark:bg-gray-900/40">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Related Guides</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {relatedTopics.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/learn/${related.slug}`}
                    className="group block p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                  >
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColors[related.category] || 'bg-gray-100 text-gray-600'}`}>
                      {related.category}
                    </span>
                    <p className="mt-2 text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {related.headline}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
