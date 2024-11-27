'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { LoadingSpinner } from '@/app/_components/ui/LoadingSpinner'
import { Button } from '@/app/_components/ui/button'
import { Input } from '@/app/_components/ui/input'
import { Textarea } from '@/app/_components/ui/textarea'

const trademarkSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  applicant_name: z.string().min(1, 'Applicant name is required'),
  company_name: z.string().optional(),
  mark_type: z.enum(['word', 'logo', 'combined', 'sound', 'other']),
  goods_services: z.string().min(1, 'Goods/Services description is required'),
  prior_registrations: z.string().optional(),
  phone_number: z.string().optional(),
  email: z.string().email('Invalid email').optional(),
})

type TrademarkFormData = z.infer<typeof trademarkSchema>

interface TrademarkFormProps {
  onSubmit: (data: TrademarkFormData) => Promise<void>
  loading: boolean
  error: string | null
  onCancel: () => void
}

export function TrademarkForm({ onSubmit, loading, error, onCancel }: TrademarkFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<TrademarkFormData>({
    resolver: zodResolver(trademarkSchema)
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <Input
            {...register('title')}
            placeholder="Enter the trademark name"
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
            placeholder="Provide a brief description of your trademark"
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
          <label className="block text-sm font-medium text-gray-700">Mark Type</label>
          <select
            {...register('mark_type')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">Select mark type...</option>
            <option value="word">Word Mark</option>
            <option value="logo">Logo Mark</option>
            <option value="combined">Combined Mark</option>
            <option value="sound">Sound Mark</option>
            <option value="other">Other</option>
          </select>
          {errors.mark_type && (
            <p className="mt-1 text-sm text-red-600">{errors.mark_type.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Goods/Services</label>
          <Textarea
            {...register('goods_services')}
            placeholder="Describe the goods/services associated with this trademark"
            rows={4}
            className="mt-1"
          />
          {errors.goods_services && (
            <p className="mt-1 text-sm text-red-600">{errors.goods_services.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Prior Registrations</label>
          <Textarea
            {...register('prior_registrations')}
            placeholder="List any prior trademark registrations (optional)"
            rows={3}
            className="mt-1"
          />
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
