import Link from 'next/link'
import { AuthChoice } from './_components/auth/auth-choice'
import { ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Modern IP Registration for{' '}
            <span className="text-primary">African Markets</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Streamline your intellectual property registration process with our modern platform. 
            Built for African markets, compliant with ARIPO requirements.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-y-6">
            <AuthChoice />
            <Link
              href="/pricing"
              className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
            >
              View Pricing <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to protect your IP
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Our platform simplifies the complex process of intellectual property registration
              in African markets.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="text-lg font-semibold leading-7">
                    <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </main>
  )
}

const features = [
  {
    name: 'ARIPO Compliant',
    description: 'Built according to African Regional Intellectual Property Organization standards and requirements.',
    icon: Shield,
  },
  {
    name: 'Smart Document Generation',
    description: 'Automatically generate required documentation based on your inputs, saving time and reducing errors.',
    icon: FileText,
  },
  {
    name: 'Real-time Status Tracking',
    description: 'Track your application status in real-time with detailed progress updates and notifications.',
    icon: Activity,
  },
]

// Import these icons from lucide-react
import { Shield, FileText, Activity } from 'lucide-react'