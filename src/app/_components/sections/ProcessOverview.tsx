"use client";

import { ProcessStep } from '../cards/ProcessStep';
import { 
  AccountIcon, 
  SubmitIcon, 
  TrackIcon, 
  CertificateIcon 
} from '../icons/ProcessIcons';

export function ProcessOverview() {
  const steps = [
    {
      step: 1,
      icon: <AccountIcon />,
      title: "Create an Account",
      description: "Sign up and verify your identity to begin the registration process.",
    },
    {
      step: 2,
      icon: <SubmitIcon />,
      title: "Submit Details",
      description: "Provide comprehensive information about your intellectual property.",
    },
    {
      step: 3,
      icon: <TrackIcon />,
      title: "Track Progress",
      description: "Monitor your application status in real-time through our platform.",
    },
    {
      step: 4,
      icon: <CertificateIcon />,
      title: "Receive Certificate",
      description: "Get your official IP registration certificate upon approval.",
    },
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold text-center text-[#0A2540]">How It Works</h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps?.map((step) => (
            <ProcessStep
              key={step.step}
              step={step.step}
              icon={step.icon}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 