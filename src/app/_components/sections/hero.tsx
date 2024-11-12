'use client'

import { Button } from "../ui/button"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const router = useRouter()

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-[#F6F9FC] pt-32 pb-24">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-[#0A2540] sm:text-6xl lg:text-7xl">
            Modern IP Registration for{' '}
            <span className="text-[#635BFF]">African Markets</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[#425466]">
            Streamline your intellectual property registration process with our modern platform. 
            Built for African markets, compliant with ARIPO requirements.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button 
              onClick={() => router.push('/register')}
              className="rounded-full bg-[#635BFF] px-8 py-3 text-sm font-medium text-white hover:bg-[#0A2540] transition-colors"
            >
              Get Started
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push('/about')}
              className="rounded-full border-[#E6E6E6] px-8 py-3 text-sm font-medium text-[#425466] hover:text-[#0A2540] hover:border-[#0A2540] transition-colors"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
} 