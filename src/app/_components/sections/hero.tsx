'use client'

import { Button } from "../ui/button"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const router = useRouter()

  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
        Protect Your Intellectual Property
      </h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-[600px]">
        Register and manage your IP rights with our secure, streamlined platform.
      </p>
      <div className="flex gap-4">
        <Button 
          size="lg"
          onClick={() => router.push('/register')}
          className="bg-gradient-to-r from-primary to-primary/90"
        >
          Get Started
        </Button>
        <Button 
          size="lg" 
          variant="outline"
          onClick={() => router.push('/about')}
        >
          Learn More
        </Button>
      </div>
    </section>
  )
} 