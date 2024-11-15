"use client";

import { ProcessIcons } from '@/app/_components/icons/ProcessIcons'

const steps = [
  {
    title: 'Submit Application',
    description: 'Fill out the application form with your IP details.',
    icon: ProcessIcons.DocumentIcon
  },
  {
    title: 'Review Process',
    description: 'Our team reviews your application for completeness.',
    icon: ProcessIcons.ClipboardDocumentCheckIcon
  },
  {
    title: 'Verification',
    description: 'Application is verified against legal requirements.',
    icon: ProcessIcons.CheckBadgeIcon
  },
  {
    title: 'Registration Complete',
    description: 'Your IP is officially registered and protected.',
    icon: ProcessIcons.DocumentDuplicateIcon
  }
]

export function ProcessOverview() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Simple steps to protect your intellectual property
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={step.title} className="relative flex flex-col items-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-center text-gray-600">
                    {step.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
} 