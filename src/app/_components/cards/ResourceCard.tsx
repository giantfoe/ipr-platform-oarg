'use client';

interface ResourceCardProps {
  title: string;
  description: string;
  link: string;
}

export function ResourceCard({ title, description, link }: ResourceCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
      <h3 className="text-xl font-semibold text-[#0A2540]">{title}</h3>
      <p className="mt-2 text-gray-600 flex-grow">{description}</p>
      <a href={link} className="mt-4 text-[#635BFF] hover:underline">
        Learn More
      </a>
    </div>
  );
} 