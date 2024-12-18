"use client";

import { BenefitsIcons } from '@/app/_components/icons/BenefitsIcons'

const benefits = [
  {
    title: 'Secure Protection',
    description: 'Protect your intellectual property with robust legal safeguards.',
    icon: BenefitsIcons.ShieldCheckIcon
  },
  {
    title: 'Easy Registration',
    description: 'Simple and streamlined process for registering your IP.',
    icon: BenefitsIcons.DocumentCheckIcon
  },
  {
    title: 'Global Coverage',
    description: 'Protect your IP across multiple jurisdictions.',
    icon: BenefitsIcons.GlobeAltIcon
  },
  {
    title: 'Expert Support',
    description: 'Access to professional IP registration support.',
    icon: BenefitsIcons.UserGroupIcon
  }
]

export function Benefits() {
  return (
    <div className="relative py-16 sm:py-24 overflow-hidden">
      {/* Background with Sierra Leone colors */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              135deg,
              rgba(27, 75, 115, 0.08) 0%,    /* OARG Blue */
              rgba(255, 255, 255, 0.95) 35%,  /* White */
              rgba(17, 138, 78, 0.08) 70%,    /* SL Green */
              rgba(27, 75, 115, 0.08) 100%    /* OARG Blue */
            )
          `
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#1B4B73] sm:text-4xl">
            Why Choose OARG?
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-[15px] text-gray-600">
            Comprehensive IP protection made simple and accessible
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon
            return (
              <div
                key={benefit.title}
                className="relative rounded-2xl p-6 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#1B4B73] to-[#118A4E] text-white flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-[#1B4B73]">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-[15px] text-gray-600">
                  {benefit.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
} 