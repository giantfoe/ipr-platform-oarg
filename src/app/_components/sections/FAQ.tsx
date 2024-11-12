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
  // Use the initialized data
  const [faqs] = useState<FAQ[]>(faqData);

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold text-center text-[#0A2540]">
          Frequently Asked Questions
        </h2>
        <div className="mt-12 space-y-6">
          {faqs?.map((faq) => (
            <FAQItem
              key={faq.id}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 