"use client";

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function BenefitCard({ icon, title, description }: BenefitCardProps) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md">
      <div className="bg-[#635BFF] text-white rounded-full p-4">
        {icon}
      </div>
      <h3 className="mt-4 text-xl font-semibold text-[#0A2540]">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  );
} 