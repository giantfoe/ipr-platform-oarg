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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#1B4B73] sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-[15px] text-gray-600">
            Simple steps to protect your intellectual property
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={step.title} className="relative rounded-2xl p-6 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#1B4B73] to-[#118A4E] text-white flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-[#1B4B73]">
                  {step.title}
                </h3>
                <p className="mt-2 text-[15px] text-gray-600">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
} 