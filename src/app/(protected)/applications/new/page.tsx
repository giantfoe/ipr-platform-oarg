import { IPRegistrationForm } from '@/app/_components/forms/IPRegistrationForm'

export default function NewApplicationPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">New IP Application</h1>
      <IPRegistrationForm />
    </div>
  )
} 