"use client";

import { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
}

export function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        className="w-full px-4 py-5 flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium text-[#0A2540]">{question}</span>
        <span className="ml-6 flex-shrink-0">
          {isOpen ? (
            <span className="text-[#635BFF]">−</span>
          ) : (
            <span className="text-[#635BFF]">+</span>
          )}
        </span>
      </button>
      {isOpen && (
        <div className="px-4 pb-5">
          <p className="text-gray-600">{answer}</p>
        </div>
      )}
    </div>
  );
} 