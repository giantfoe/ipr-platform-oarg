'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { copyrightSchema, type CopyrightFormData } from '@/lib/validations'
import { useState } from 'react'

interface CopyrightFormProps {
  onSubmit: (data: CopyrightFormData) => Promise<void>
  loading: boolean
  error: string | null
  onCancel: () => void
}

export function CopyrightForm({ onSubmit, loading, error, onCancel }: CopyrightFormProps) {
  const [debugValues, setDebugValues] = useState({
    title: '',
    description: '',
    applicant_name: '',
    work_type: '',
    authors: '',
    creation_date: ''
  })

  const { 
    register, 
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CopyrightFormData>({
    resolver: zodResolver(copyrightSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      applicant_name: '',
      company_name: '',
      work_type: '',
      creation_date: '',
      first_publication: '',
      authors: '',
      mobile_number: '',
      email: '',
      regions: ''
    }
  })

  const onSubmitForm = async (data: CopyrightFormData) => {
    try {
      console.log('Form data:', data)
      await onSubmit(data)
    } catch (err) {
      console.error('Form submission error:', err)
    }
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setDebugValues(prev => ({ ...prev, work_type: value }))
    register('work_type').onChange(e)
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Title"
          {...register('title', {
            onChange: (e) => setDebugValues(prev => ({ ...prev, title: e.target.value }))
          })}
          placeholder="Enter the title of your work"
          error={!!errors.title}
          helperText={errors.title?.message}
        />

        <Textarea
          label="Description"
          {...register('description', {
            onChange: (e) => setDebugValues(prev => ({ ...prev, description: e.target.value }))
          })}
          placeholder="Provide a description of your work"
          error={!!errors.description}
          helperText={errors.description?.message}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Applicant Name"
            {...register('applicant_name', {
              onChange: (e) => setDebugValues(prev => ({ ...prev, applicant_name: e.target.value }))
            })}
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

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-200">
            Work Type <span className="text-red-500">*</span>
          </label>
          <select
            {...register('work_type')}
            onChange={handleSelectChange}
            className={`w-full px-3 py-2 bg-white text-gray-900 rounded-md border ${
              errors.work_type ? 'border-red-500' : 'border-gray-300'
            }`}
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
            <p className="mt-1 text-sm text-red-500">
              {errors.work_type.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Creation Date"
            {...register('creation_date', {
              onChange: (e) => setDebugValues(prev => ({ ...prev, creation_date: e.target.value }))
            })}
            type="date"
            error={!!errors.creation_date}
            helperText={errors.creation_date?.message}
          />

          <Input
            label="First Publication Date (Optional)"
            {...register('first_publication')}
            type="date"
          />
        </div>

        <Textarea
          label="Authors (one per line)"
          {...register('authors', {
            onChange: (e) => setDebugValues(prev => ({ ...prev, authors: e.target.value }))
          })}
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

      {/* Safe debug info */}
      <pre className="mt-4 p-4 bg-gray-800 text-white rounded-md text-xs">
        {JSON.stringify({
          errors: Object.keys(errors).reduce((acc, key) => ({
            ...acc,
            [key]: errors[key]?.message
          }), {}),
          isSubmitting,
          currentValues: debugValues
        }, null, 2)}
      </pre>
    </form>
  )
}
