"use client";

import { BenefitCard } from '../cards/BenefitCard';
import { ProtectionIcon, BusinessGrowthIcon, LegalIcon } from '../icons';

export function Benefits() {
  const benefits = [
    {
      icon: <ProtectionIcon />,
      title: "Protect Your Work",
      description: "Prevent unauthorized use of your creations with official IP protection.",
    },
    {
      icon: <BusinessGrowthIcon />,
      title: "Boost Business Value",
      description: "Strengthen your brand and increase market value through recognized IP rights.",
    },
    {
      icon: <LegalIcon />,
      title: "Legal Assurance",
      description: "Gain protection under Sierra Leonean law, ensuring your rights are upheld.",
    },
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold text-center text-[#0A2540]">Benefits of IP Registration</h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <BenefitCard
              key={index}
              icon={benefit.icon}
              title={benefit.title}
              description={benefit.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 