'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Select } from '@/components/ui/Select'
import { trademarkSchema, type TrademarkFormData } from '@/lib/validations'

interface TrademarkFormProps {
  onSubmit: (data: TrademarkFormData) => Promise<void>
  loading: boolean
  error: string | null
  onCancel: () => void
}

export function TrademarkForm({ onSubmit, loading, error, onCancel }: TrademarkFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(trademarkSchema)
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Title"
          {...register('title')}
          placeholder="Enter the trademark name"
          error={!!errors.title}
          helperText={errors.title?.message}
        />

        <Textarea
          label="Description"
          {...register('description')}
          placeholder="Provide a description of your trademark"
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
          label="Mark Type"
          {...register('mark_type')}
          error={!!errors.mark_type}
          helperText={errors.mark_type?.message}
        >
          <option value="">Select mark type...</option>
          <option value="word">Word Mark</option>
          <option value="logo">Logo Mark</option>
          <option value="combined">Combined Mark</option>
          <option value="sound">Sound Mark</option>
          <option value="other">Other</option>
        </Select>

        <Textarea
          label="Goods/Services"
          {...register('goods_services')}
          placeholder="Describe the goods/services associated with this trademark"
          error={!!errors.goods_services}
          helperText={errors.goods_services?.message}
        />

        <Textarea
          label="Prior Registrations"
          {...register('prior_registrations')}
          placeholder="List any prior trademark registrations (optional)"
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
