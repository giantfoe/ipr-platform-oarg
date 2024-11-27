'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/app/_components/ui/input'
import { Textarea } from '@/app/_components/ui/textarea'
import { PatentFormData } from '@/lib/validations'

const basicInfoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  applicant_name: z.string().min(1, 'Applicant name is required'),
  company_name: z.string().optional(),
  phone_number: z.string().optional(),
  email: z.string().email('Invalid email').optional(),
})

type BasicInfoData = z.infer<typeof basicInfoSchema>

interface BasicInfoStepProps {
  data: Partial<PatentFormData>
  onUpdate: (data: Partial<PatentFormData>) => void
}

export function BasicInfoStep({ data, onUpdate }: BasicInfoStepProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<BasicInfoData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      title: data.title || '',
      description: data.description || '',
      applicant_name: data.applicant_name || '',
      company_name: data.company_name || '',
      phone_number: data.phone_number || '',
      email: data.email || '',
    }
  })

  const onSubmit = (formData: BasicInfoData) => {
    onUpdate(formData)
  }

  // Auto-save on field change
  const handleFieldChange = handleSubmit(onSubmit)

  return (
    <form onChange={handleFieldChange} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <Input
          {...register('title')}
          placeholder="Enter the title of your invention"
          className="mt-1"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <Textarea
          {...register('description')}
          placeholder="Provide a brief overview of your invention"
          rows={3}
          className="mt-1"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Applicant Name</label>
          <Input
            {...register('applicant_name')}
            placeholder="Full legal name"
            className="mt-1"
          />
          {errors.applicant_name && (
            <p className="mt-1 text-sm text-red-600">{errors.applicant_name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Company Name</label>
          <Input
            {...register('company_name')}
            placeholder="Optional"
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <Input
            {...register('phone_number')}
            type="tel"
            placeholder="Optional"
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <Input
            {...register('email')}
            type="email"
            placeholder="Optional"
            className="mt-1"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
      </div>
    </form>
  )
} 