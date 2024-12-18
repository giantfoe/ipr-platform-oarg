"use client";

import { TestimonialCard } from '../cards/TestimonialCard';
import { users } from '../../data/testimonials';

export function Testimonials() {
  return (
    <div className="relative py-16 sm:py-24 overflow-hidden">
      {/* Background with Sierra Leone colors - matching hero section */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              135deg,
              rgba(27, 75, 115, 0.08) 0%,    /* OARG Blue */
              rgba(255, 255, 255, 0.95) 35%,  /* White */
              rgba(17, 138, 78, 0.08) 70%,    /* SL Green */
              rgba(27, 75, 115, 0.08) 100%    /* OARG Blue */
            )
          `
        }}
      />

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 -translate-y-1/2 translate-x-1/2">
        <div className="absolute inset-0 bg-gradient-to-br from-[#118A4E]/20 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#1B4B73] sm:text-4xl">
            What Our Users Say
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-[15px] text-gray-600">
            Hear from businesses and individuals who have successfully registered through our platform
          </p>
        </div>

        <div className="mt-12 space-y-8">
          {users.map((user) => (
            <div
              key={user.id}
              className="relative rounded-2xl p-6 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="relative">
                <p className="text-[15px] text-gray-700">
                  "{user.feedback}"
                </p>
                <div className="mt-4">
                  <h3 className="text-[#1B4B73] font-semibold">{user.name}</h3>
                  <p className="text-[#118A4E] text-sm">{user.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 