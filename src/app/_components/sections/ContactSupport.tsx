"use client";

import { MailIcon, PhoneContactIcon, ChatIcon } from '../icons';
import Link from 'next/link';

export function ContactSupport() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-semibold text-[#0A2540]">Need Assistance?</h2>
        <p className="mt-4 text-gray-600">
          Our support team is here to help you with any questions or issues you may have.
        </p>
        <div className="mt-8 flex justify-center space-x-6">
          <a href="mailto:support@oarg.sl" className="flex flex-col items-center text-[#635BFF] hover:text-[#0A2540]">
            <MailIcon className="h-6 w-6" />
            <span>Email Us</span>
          </a>
          <a href="tel:+1234567890" className="flex flex-col items-center text-[#635BFF] hover:text-[#0A2540]">
            <PhoneContactIcon className="h-6 w-6" aria-hidden="true" />
            <span>Call Us</span>
          </a>
          <Link href="/chat" className="flex flex-col items-center text-[#635BFF] hover:text-[#0A2540]">
            <ChatIcon className="h-6 w-6" aria-hidden="true" />
            <span>Live Chat</span>
          </Link>
        </div>
      </div>
    </section>
  );
} 