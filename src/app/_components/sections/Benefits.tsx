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
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Why Choose IP Register?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Comprehensive IP protection made simple and accessible
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon
            return (
              <div
                key={benefit.title}
                className="relative flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-center text-gray-500">
                  {benefit.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
} 