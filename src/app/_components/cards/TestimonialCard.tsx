"use client";

interface TestimonialCardProps {
  name: string;
  role: string;
  feedback: string;
  image: string;
}

export function TestimonialCard({ name, role, feedback, image }: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
      <img src={image} alt={`${name}'s picture`} className="w-16 h-16 rounded-full object-cover" />
      <h3 className="mt-4 text-xl font-semibold text-[#0A2540]">{name}</h3>
      <p className="text-gray-500">{role}</p>
      <p className="mt-4 text-gray-600">"{feedback}"</p>
    </div>
  );
} 