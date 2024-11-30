'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { trademarkSchema, type TrademarkFormData } from '@/lib/validations'
import { useState } from 'react'

interface TrademarkFormProps {
  onSubmit: (data: TrademarkFormData) => Promise<void>
  loading: boolean
  error: string | null
  onCancel: () => void
}

export function TrademarkForm({ onSubmit, loading, error, onCancel }: TrademarkFormProps) {
  const [debugValues, setDebugValues] = useState({
    mark_type: '',
    title: '',
    description: '',
    applicant_name: ''
  })

  const { 
    register, 
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<TrademarkFormData>({
    resolver: zodResolver(trademarkSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      applicant_name: '',
      company_name: '',
      mark_type: '',
      goods_services: '',
      prior_registrations: '',
      mobile_number: '',
      email: '',
      regions: ''
    }
  })

  const onSubmitForm = async (data: TrademarkFormData) => {
    try {
      console.log('Form data:', data)
      await onSubmit(data)
    } catch (err) {
      console.error('Form submission error:', err)
    }
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setDebugValues(prev => ({ ...prev, mark_type: value }))
    register('mark_type').onChange(e)
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Title"
          {...register('title', {
            onChange: (e) => setDebugValues(prev => ({ ...prev, title: e.target.value }))
          })}
          placeholder="Enter the trademark name"
          error={!!errors.title}
          helperText={errors.title?.message}
        />

        <Textarea
          label="Description"
          {...register('description', {
            onChange: (e) => setDebugValues(prev => ({ ...prev, description: e.target.value }))
          })}
          placeholder="Provide a description of your trademark"
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
            Mark Type <span className="text-red-500">*</span>
          </label>
          <select
            {...register('mark_type')}
            onChange={handleSelectChange}
            className={`w-full px-3 py-2 bg-white text-gray-900 rounded-md border ${
              errors.mark_type ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select mark type...</option>
            <option value="word">Word Mark</option>
            <option value="logo">Logo Mark</option>
            <option value="combined">Combined Mark</option>
            <option value="sound">Sound Mark</option>
            <option value="other">Other</option>
          </select>
          {errors.mark_type && (
            <p className="mt-1 text-sm text-red-500">
              {errors.mark_type.message}
            </p>
          )}
        </div>

        <Textarea
          label="Goods/Services"
          {...register('goods_services')}
          placeholder="Describe the goods/services associated with this trademark"
          error={!!errors.goods_services}
          helperText={errors.goods_services?.message}
        />

        <Textarea
          label="Prior Registrations (one per line)"
          {...register('prior_registrations')}
          placeholder="List any prior trademark registrations"
          error={!!errors.prior_registrations}
          helperText={errors.prior_registrations?.message}
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
