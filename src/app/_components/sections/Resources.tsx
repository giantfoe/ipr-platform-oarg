"use client";

import { ResourceCard } from '../cards/ResourceCard';
import { resources } from '../../data/resources';
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export function Resources() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold text-center text-[#0A2540]">Resources & Educational Materials</h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource) => (
            <ResourceCard
              key={resource.id}
              title={resource.title}
              description={resource.description}
              link={resource.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 