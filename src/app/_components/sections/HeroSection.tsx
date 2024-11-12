"use client";

import Link from 'next/link';
import { Button } from '../ui/Button';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-[#635BFF] to-[#00D4FF] text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold">
            Streamline Your Intellectual Property Registration with OARG.
          </h1>
          <p className="mt-4 text-lg sm:text-xl">
            Efficient, secure, and accessible IP registration and tracking in Sierra Leone.
          </p>
          <div className="mt-8 flex space-x-4">
            <Link href="/register">
              <Button variant="primary">Register Now</Button>
            </Link>
            <Link href="/learn-more">
              <Button variant="outline">Learn More</Button>
            </Link>
          </div>
        </div>
        <div className="mt-10 md:mt-0 md:w-1/2">
          <img
            src="/assets/hero-graphic.svg"
            alt="IP Registration"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
} 