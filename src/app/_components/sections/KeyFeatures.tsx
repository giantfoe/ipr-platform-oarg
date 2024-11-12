"use client";

import { FeatureCard } from '../cards/FeatureCard';
import { FastSpeedIcon, RealTimeIcon, AccessibilityIcon, EducationIcon, BlockchainIcon } from '../icons';

export function KeyFeatures() {
  const features = [
    {
      icon: <FastSpeedIcon />,
      title: "Fast and Secure Registration",
      description: "Quick submission with secure data handling ensures your IP is registered without delays.",
    },
    {
      icon: <RealTimeIcon />,
      title: "Real-time Tracking",
      description: "Monitor the status of your IP registration at every step of the process.",
    },
    {
      icon: <AccessibilityIcon />,
      title: "Easy Access",
      description: "Accessible design for all users, including persons with disabilities.",
    },
    {
      icon: <EducationIcon />,
      title: "Educational Resources",
      description: "Learn about IP rights, policies, and procedures with our comprehensive resources.",
    },
    {
      icon: <BlockchainIcon />,
      title: "Digital Storage with Solana",
      description: "Using Solana blockchain for tamper-proof IP records and enhanced security.",
    },
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold text-center text-[#0A2540]">Key Features</h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 