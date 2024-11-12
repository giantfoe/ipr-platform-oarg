"use client";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
      <div className="bg-[#635BFF] text-white rounded-full p-4">
        {icon}
      </div>
      <h3 className="mt-4 text-xl font-semibold text-[#0A2540]">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  );
} 