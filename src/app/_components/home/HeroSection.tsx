import Image from 'next/image'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <div className="relative bg-primary h-[600px]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/sierra-leone-flag.jpg" // Add their flag or relevant image
          alt="Sierra Leone Flag"
          fill
          className="object-cover opacity-20"
        />
      </div>
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        <div className="text-center">
          <Image
            src="/images/oarg-logo.png" // Add their logo
            alt="OARG Logo"
            width={150}
            height={150}
            className="mx-auto mb-8"
          />
          <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
            Office of the Administrator and Registrar General
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Sierra Leone's Official Intellectual Property Registration Platform
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                href="/register"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-secondary hover:bg-green-600 md:py-4 md:text-lg md:px-10"
              >
                Register Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 