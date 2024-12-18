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
    <div className="relative py-16 sm:py-24 overflow-hidden">
      {/* Background with Sierra Leone colors */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              135deg,
              rgba(0, 83, 159, 0.08) 0%,    /* SL Blue */
              rgba(255, 255, 255, 0.95) 35%, /* White */
              rgba(0, 137, 48, 0.08) 70%,    /* SL Green */
              rgba(0, 83, 159, 0.08) 100%    /* SL Blue */
            )
          `
        }}
      />

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 -translate-y-1/2 translate-x-1/2">
        <div className="absolute inset-0 bg-gradient-to-br from-[#008930]/20 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#00539F] sm:text-4xl">
            Key Features
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-[15px] text-gray-600">
            Streamlined registration process for businesses and intellectual property
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative rounded-2xl p-6 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="relative">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#00539F] to-[#008930] text-white flex items-center justify-center text-2xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-[#00539F] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[15px] text-gray-600">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 