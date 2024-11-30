'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { patentSchema, type PatentFormData } from '@/lib/validations'

interface PatentFormProps {
  onSubmit: (data: PatentFormData) => Promise<void>
  loading: boolean
  error: string | null
  onCancel: () => void
}

export function PatentForm({ onSubmit, loading, error, onCancel }: PatentFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<PatentFormData>({
    resolver: zodResolver(patentSchema)
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Title"
          {...register('title')}
          placeholder="Enter the title of your invention"
          error={!!errors.title}
          helperText={errors.title?.message}
        />

        <Textarea
          label="Description"
          {...register('description')}
          placeholder="Provide a brief overview of your invention"
          error={!!errors.description}
          helperText={errors.description?.message}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Applicant Name"
            {...register('applicant_name')}
            placeholder="Full legal name"
            error={!!errors.applicant_name}
            helperText={errors.applicant_name?.message}
          />

          <Input
            label="Company Name"
            {...register('company_name')}
            placeholder="Optional"
          />
        </div>

        <Textarea
          label="Technical Field"
          {...register('technical_field')}
          placeholder="Describe the technical field of your invention"
          error={!!errors.technical_field}
          helperText={errors.technical_field?.message}
        />

        <Textarea
          label="Background Art"
          {...register('background_art')}
          placeholder="Describe the existing technology or solutions"
          error={!!errors.background_art}
          helperText={errors.background_art?.message}
        />

        <Textarea
          label="Invention Description"
          {...register('invention_description')}
          placeholder="Detailed description of your invention"
          error={!!errors.invention_description}
          helperText={errors.invention_description?.message}
        />

        <Textarea
          label="Advantages"
          {...register('advantages')}
          placeholder="List the advantages of your invention"
          error={!!errors.advantages}
          helperText={errors.advantages?.message}
        />

        <Textarea
          label="Claims"
          {...register('claims')}
          placeholder="List your patent claims"
          error={!!errors.claims}
          helperText={errors.claims?.message}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Phone Number"
            {...register('phone_number')}
            type="tel"
            placeholder="Optional"
          />

          <Input
            label="Email"
            {...register('email')}
            type="email"
            placeholder="Optional"
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-900 text-red-100 rounded-md">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? <LoadingSpinner size="sm" /> : 'Submit Application'}
        </Button>
      </div>
    </form>
  )
}
