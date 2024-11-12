"use client";

interface ProcessStepProps {
  step: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function ProcessStep({ step, icon, title, description }: ProcessStepProps) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md">
      <div className="bg-[#635BFF] text-white rounded-full p-4">
        {icon}
      </div>
      <h3 className="mt-4 text-xl font-semibold text-[#0A2540]">Step {step}: {title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  );
} 