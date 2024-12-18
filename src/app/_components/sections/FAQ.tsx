"use client";

import { useState } from 'react';
import { FAQItem } from '../cards/FAQItem';

// Define the FAQ data structure
interface FAQ {
  id: number;
  question: string;
  answer: string;
}

// Initialize the FAQ data
const faqData: FAQ[] = [
  {
    id: 1,
    question: "What types of intellectual property can I register?",
    answer: "You can register various types of intellectual property including patents, trademarks, copyrights, and industrial designs through our platform."
  },
  {
    id: 2,
    question: "How long does the registration process take?",
    answer: "The registration timeline varies depending on the type of IP and jurisdiction. Generally, it can take anywhere from a few months to several years."
  },
  {
    id: 3,
    question: "What documents do I need to submit?",
    answer: "Required documents typically include proof of identity, detailed description of your IP, and any supporting documentation specific to your IP type."
  },
  {
    id: 4,
    question: "How much does registration cost?",
    answer: "Costs vary based on the type of IP and jurisdiction. Our platform provides transparent pricing for each service."
  }
];

export function FAQ() {
  const [faqs] = useState<FAQ[]>(faqData);

  return (
    <div className="relative py-16 sm:py-24 overflow-hidden">
      {/* Background with Sierra Leone colors */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              135deg,
              rgba(27, 75, 115, 0.08) 0%,
              rgba(255, 255, 255, 0.95) 35%,
              rgba(17, 138, 78, 0.08) 70%,
              rgba(27, 75, 115, 0.08) 100%
            )
          `
        }}
      />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#1B4B73] sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-[15px] text-gray-600">
            Find answers to common questions about our services
          </p>
        </div>

        <div className="mt-12 space-y-6">
          {faqs.map((faq) => (
            <FAQItem
              key={faq.id}
              question={faq.question}
              answer={faq.answer}
              className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl"
            />
          ))}
        </div>
      </div>
    </div>
  )
} 