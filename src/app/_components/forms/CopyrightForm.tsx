'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { copyrightSchema, type CopyrightFormData } from '@/lib/validations'

interface CopyrightFormProps {
  onSubmit: (data: CopyrightFormData) => Promise<void>
  loading: boolean
  error: string | null
  onCancel: () => void
}

export function CopyrightForm({ onSubmit, loading, error, onCancel }: CopyrightFormProps) {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<CopyrightFormData>({
    resolver: zodResolver(copyrightSchema),
    defaultValues: {
      authors: '',
      regions: ''
    }
  })

  const onSubmitForm = async (data: CopyrightFormData) => {
    try {
      await onSubmit(data)
    } catch (err) {
      console.error('Form submission error:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
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
          label="Authors (one per line)"
          {...register('authors')}
          placeholder="List all authors and their contributions"
          error={!!errors.authors}
          helperText={errors.authors?.message}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Mobile Number"
            {...register('mobile_number')}
            type="tel"
            placeholder="Enter your mobile number"
            error={!!errors.mobile_number}
            helperText={errors.mobile_number?.message}
          />

          <Input
            label="Email"
            {...register('email')}
            type="email"
            placeholder="Enter your email"
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </div>

        <Textarea
          label="Regions (one per line)"
          {...register('regions')}
          placeholder="List the regions for registration"
          error={!!errors.regions}
          helperText={errors.regions?.message}
        />
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
          disabled={loading || isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading || isSubmitting}
        >
          {loading || isSubmitting ? <LoadingSpinner size="sm" /> : 'Submit Application'}
        </Button>
      </div>
    </form>
  )
}
