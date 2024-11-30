'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Select } from '@/components/ui/Select'
import { copyrightSchema, type CopyrightFormData } from '@/lib/validations'

interface CopyrightFormProps {
  onSubmit: (data: CopyrightFormData) => Promise<void>
  loading: boolean
  error: string | null
  onCancel: () => void
}

export function CopyrightForm({ onSubmit, loading, error, onCancel }: CopyrightFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(copyrightSchema)
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Title"
          {...register('title')}
          placeholder="Enter the title of your work"
          error={!!errors.title}
          helperText={errors.title?.message}
        />

        <Textarea
          label="Description"
          {...register('description')}
          placeholder="Provide a description of your work"
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

        <Select
          label="Work Type"
          {...register('work_type')}
          error={!!errors.work_type}
          helperText={errors.work_type?.message}
        >
          <option value="">Select work type...</option>
          <option value="literary">Literary Work</option>
          <option value="musical">Musical Work</option>
          <option value="artistic">Artistic Work</option>
          <option value="dramatic">Dramatic Work</option>
          <option value="audiovisual">Audiovisual Work</option>
          <option value="software">Software</option>
          <option value="other">Other</option>
        </Select>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Creation Date"
            {...register('creation_date')}
            type="date"
            error={!!errors.creation_date}
            helperText={errors.creation_date?.message}
          />

          <Input
            label="First Publication Date"
            {...register('first_publication')}
            type="date"
          />
        </div>

        <Textarea
          label="Authors"
          {...register('authors')}
          placeholder="List all authors and their contributions"
          error={!!errors.authors}
          helperText={errors.authors?.message}
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
