'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { LoadingSpinner } from '@/app/_components/ui/LoadingSpinner'
import { Button } from '@/app/_components/ui/button'
import { Input } from '@/app/_components/ui/input'
import { Textarea } from '@/app/_components/ui/textarea'

const copyrightSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  applicant_name: z.string().min(1, 'Applicant name is required'),
  company_name: z.string().optional(),
  work_type: z.enum(['literary', 'musical', 'artistic', 'dramatic', 'audiovisual', 'software', 'other']),
  creation_date: z.string().min(1, 'Creation date is required'),
  first_publication: z.string().optional(),
  authors: z.array(z.object({
    name: z.string(),
    nationality: z.string()
  })).min(1, 'At least one author is required'),
  phone_number: z.string().optional(),
  email: z.string().email('Invalid email').optional(),
})

type CopyrightFormData = z.infer<typeof copyrightSchema>

interface CopyrightFormProps {
  onSubmit: (data: CopyrightFormData) => Promise<void>
  loading: boolean
  error: string | null
  onCancel: () => void
}

export function CopyrightForm({ onSubmit, loading, error, onCancel }: CopyrightFormProps) {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<CopyrightFormData>({
    resolver: zodResolver(copyrightSchema),
    defaultValues: {
      authors: [{ name: '', nationality: '' }]
    }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <Input
            {...register('title')}
            placeholder="Enter the title of your work"
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
            placeholder="Provide a description of your work"
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

        <div>
          <label className="block text-sm font-medium text-gray-700">Work Type</label>
          <select
            {...register('work_type')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">Select work type...</option>
            <option value="literary">Literary Work</option>
            <option value="musical">Musical Work</option>
            <option value="artistic">Artistic Work</option>
            <option value="dramatic">Dramatic Work</option>
            <option value="audiovisual">Audiovisual Work</option>
            <option value="software">Software</option>
            <option value="other">Other</option>
          </select>
          {errors.work_type && (
            <p className="mt-1 text-sm text-red-600">{errors.work_type.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Creation Date</label>
            <Input
              {...register('creation_date')}
              type="date"
              className="mt-1"
            />
            {errors.creation_date && (
              <p className="mt-1 text-sm text-red-600">{errors.creation_date.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">First Publication Date</label>
            <Input
              {...register('first_publication')}
              type="date"
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
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
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
