"use client";

import { TestimonialCard } from '../cards/TestimonialCard';
import { users } from '../../data/testimonials';

export function Testimonials() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold text-center text-[#0A2540]">What Our Users Say</h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {users.map((user) => (
            <TestimonialCard
              key={user.id}
              name={user.name}
              role={user.role}
              feedback={user.feedback}
              image={user.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 