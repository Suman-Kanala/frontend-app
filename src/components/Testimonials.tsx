'use client';

import React, { useRef } from "react";
import {
  Star,
  Quote,
  MapPin,
  Building2,
  Award,
  TrendingUp,
} from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  company: string;
  location: string;
  rating: number;
  text: string;
  salaryIncrease: string;
}

interface CompanyLogo {
  name: string;
  logo: string;
}

interface TestimonialsProps {
  // Currently no props needed
}

const Testimonials: React.FC<TestimonialsProps> = () => {
  const ref = useRef<HTMLDivElement>(null);

  const testimonials: Testimonial[] = [
    {
      name: "Priya Sharma",
      role: "Senior Software Engineer",
      company: "Google India",
      location: "Bengaluru, India",
      rating: 5,
      text: "Saanvi Careers helped me transition from a startup to Google. Their technical interview preparation and salary negotiation guidance were invaluable.",
      salaryIncrease: "65%",
    },
    {
      name: "Rajesh Kumar",
      role: "Data Science Manager",
      company: "Amazon",
      location: "Hyderabad, India",
      rating: 4,
      text: "Professional approach and deep understanding of the Indian tech market. They connected me with the right opportunities at the right time.",
      salaryIncrease: "38%",
    },
    {
      name: "Arjun Patel",
      role: "Investment Banking VP",
      company: "Goldman Sachs",
      location: "Mumbai, India",
      rating: 5,
      text: "Exceptional market knowledge and network. They understood my career aspirations and delivered beyond expectations with perfect role matching.",
      salaryIncrease: "55%",
    },
    {
      name: "Anita Desai",
      role: "Consulting Director",
      company: "McKinsey & Company",
      location: "Delhi, India",
      rating: 5,
      text: "Their strategic approach to career development and understanding of consulting industry dynamics helped me achieve partner track success.",
      salaryIncrease: "71%",
    },
    {
      name: "Vikram Reddy",
      role: "Full Stack Developer",
      company: "Flipkart",
      location: "Bengaluru, India",
      rating: 5,
      text: "As a fresher, I was struggling to break into top tech companies. Saanvi Careers prepared me with mock interviews and resume tips that landed me my dream role.",
      salaryIncrease: "52%",
    },
    {
      name: "Sneha Iyer",
      role: "Cloud Architect",
      company: "TCS",
      location: "Chennai, India",
      rating: 5,
      text: "Their understanding of the Indian IT services landscape is outstanding. Helped me move from a mid-level role to a senior architect position seamlessly.",
      salaryIncrease: "44%",
    },
    {
      name: "Rohit Mehra",
      role: "Product Lead",
      company: "Razorpay",
      location: "Bengaluru, India",
      rating: 4,
      text: "Saanvi Careers understands the startup ecosystem very well. They matched me with a role that aligned perfectly with my skills and growth goals.",
      salaryIncrease: "60%",
    },
    {
      name: "Deepa Nair",
      role: "AI/ML Engineer",
      company: "Infosys",
      location: "Pune, India",
      rating: 5,
      text: "Transitioning into AI was daunting, but the team at Saanvi Careers guided me every step of the way. From upskilling advice to placement — truly end-to-end support.",
      salaryIncrease: "48%",
    },
    {
      name: "Sarah Chen",
      role: "Product Manager",
      company: "Microsoft",
      location: "Seattle, USA",
      rating: 5,
      text: "The personalized career coaching and global network access at Saanvi Careers made my dream role achievable. Exceptional service quality.",
      salaryIncrease: "42%",
    },
    {
      name: "Kavita Singh",
      role: "Research Scientist",
      company: "Pfizer",
      location: "Pune, India",
      rating: 4,
      text: "Excellent understanding of pharmaceutical R&D landscape. They guided me through complex international opportunities with great success.",
      salaryIncrease: "31%",
    },
    {
      name: "Emily Johnson",
      role: "Healthcare Director",
      company: "Johnson & Johnson",
      location: "London, UK",
      rating: 5,
      text: "Their healthcare sector expertise is unmatched. Guided me through complex international relocation and visa processes seamlessly.",
      salaryIncrease: "33%",
    },
    {
      name: "Michael Chen",
      role: "Engineering Manager",
      company: "Tesla",
      location: "Austin, USA",
      rating: 4,
      text: "Great support throughout the interview process. The team's automotive industry insights and technical guidance were spot-on.",
      salaryIncrease: "47%",
    },
  ];

  const renderStars = (rating: number): React.ReactNode[] => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
        size={16}
      />
    ));
  };

  const companyLogos: CompanyLogo[] = [
    // Indian Companies (15)
    { name: "TCS", logo: "/logos/tcs.svg" },
    { name: "Infosys", logo: "/logos/infosys.svg" },
    { name: "Wipro", logo: "/logos/wipro.svg" },
    { name: "HCLTech", logo: "/logos/hcltech.svg" },
    { name: "Reliance", logo: "/logos/reliance.png" },
    { name: "Tech Mahindra", logo: "/logos/techmahindra.png" },
    { name: "Flipkart", logo: "/logos/flipkart.png" },
    { name: "Zoho", logo: "/logos/zoho.svg" },
    { name: "Razorpay", logo: "/logos/razorpay.svg" },
    { name: "Swiggy", logo: "/logos/swiggy.svg" },
    { name: "Zomato", logo: "/logos/zomato.svg" },
    { name: "Paytm", logo: "/logos/paytm.svg" },
    { name: "BYJU'S", logo: "/logos/byjus.svg" },
    { name: "Ola", logo: "/logos/ola.png" },
    { name: "PhonePe", logo: "/logos/phonepe.svg" },
    // Global Companies (15)
    { name: "Google", logo: "/logos/google.svg" },
    { name: "Microsoft", logo: "/logos/microsoft.png" },
    { name: "Amazon", logo: "/logos/amazon.png" },
    { name: "Apple", logo: "/logos/apple.svg" },
    { name: "Meta", logo: "/logos/meta.svg" },
    { name: "Tesla", logo: "/logos/tesla.svg" },
    { name: "Netflix", logo: "/logos/netflix.svg" },
    { name: "Goldman Sachs", logo: "/logos/goldmansachs.svg" },
    { name: "McKinsey", logo: "/logos/mckinsey.png" },
    { name: "Deloitte", logo: "/logos/deloitte.png" },
    { name: "Accenture", logo: "/logos/accenture.svg" },
    { name: "IBM", logo: "/logos/ibm.png" },
    { name: "Salesforce", logo: "/logos/salesforce.png" },
    { name: "Adobe", logo: "/logos/adobe.png" },
    { name: "Pfizer", logo: "/logos/pfizer.png" },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Award className="mr-2" size={16} />
            Client Success Stories
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-gray-100">
            Trusted by{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Professionals Worldwide
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Join thousands of professionals who have accelerated their careers
            with our expert guidance and global network.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group hover:-translate-y-1"
            >
              <Quote
                className="text-blue-100 mb-4 group-hover:text-blue-200 transition-colors"
                size={32}
              />
              <div className="flex items-center mb-4">
                {renderStars(testimonial.rating)}
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {testimonial.rating}/5
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <img
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-gray-100 dark:border-gray-700"
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      testimonial.name
                    )}&background=3b82f6&color=ffffff&size=48`}
                  />
                  <div>
                    <h4 className="text-gray-800 dark:text-gray-100 font-semibold text-sm">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">
                      {testimonial.role}
                    </p>
                    <div className="flex items-center text-xs text-gray-400 dark:text-gray-500">
                      <Building2 size={12} className="mr-1" />
                      {testimonial.company}
                    </div>
                    <div className="flex items-center text-xs text-gray-400 mt-1">
                      <MapPin size={12} className="mr-1" />
                      {testimonial.location}
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 text-green-600 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                  <TrendingUp size={12} className="mr-1" />+
                  {testimonial.salaryIncrease}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h3 className="text-3xl font-bold text-center mb-8">
            Our Track Record Speaks for Itself
          </h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">4.8/5</div>
              <div className="text-blue-100">Average Client Rating</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">97%</div>
              <div className="text-blue-100">Would Recommend Us</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">3,200+</div>
              <div className="text-blue-100">Successful Placements</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">48%</div>
              <div className="text-blue-100">Average Salary Increase</div>
            </div>
          </div>
        </div>

        {/* Company Logos Carousel */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">
            Our clients work at leading companies worldwide
          </p>
          <div className="overflow-hidden relative py-6">
            <div className="flex scroll-animation space-x-10 items-center">
              {companyLogos.concat(companyLogos).map((company, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center min-w-max"
                >
                  <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl px-6 py-4 hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-3">
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="h-10 w-10 object-contain rounded"
                    />
                    <span className="text-gray-800 dark:text-gray-100 font-bold text-base whitespace-nowrap">
                      {company.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
