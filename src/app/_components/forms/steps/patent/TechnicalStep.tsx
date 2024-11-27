'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/app/_components/ui/input'
import { Textarea } from '@/app/_components/ui/textarea'
import { PatentFormData } from '@/lib/validations'

const technicalSchema = z.object({
  technical_field: z.string().min(1, 'Technical field is required'),
  background_art: z.string().min(1, 'Background art is required'),
  technical_problem: z.string().min(1, 'Technical problem is required'),
  technical_solution: z.string().min(1, 'Technical solution is required'),
  industrial_applicability: z.string().min(1, 'Industrial applicability is required'),
  keywords: z.array(z.string()).min(1, 'At least one keyword is required'),
})

type TechnicalStepData = z.infer<typeof technicalSchema>

interface TechnicalStepProps {
  data: Partial<PatentFormData>
  onUpdate: (data: Partial<PatentFormData>) => void
}

export function TechnicalStep({ data, onUpdate }: TechnicalStepProps) {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<TechnicalStepData>({
    resolver: zodResolver(technicalSchema),
    defaultValues: {
      technical_field: data.technical_field || '',
      background_art: data.background_art || '',
      technical_problem: data.technical_problem || '',
      technical_solution: data.technical_solution || '',
      industrial_applicability: data.industrial_applicability || '',
      keywords: data.keywords || [],
    }
  })

  const onSubmit = (formData: TechnicalStepData) => {
    onUpdate(formData)
  }

  // Auto-save on field change
  const handleFieldChange = handleSubmit(onSubmit)

  return (
    <form onChange={handleFieldChange} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Technical Field</label>
        <Textarea
          {...register('technical_field')}
          placeholder="Describe the technical field of your invention"
          rows={3}
          className="mt-1"
        />
        {errors.technical_field && (
          <p className="mt-1 text-sm text-red-600">{errors.technical_field.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Background Art</label>
        <Textarea
          {...register('background_art')}
          placeholder="Describe the existing technology or background art"
          rows={4}
          className="mt-1"
        />
        {errors.background_art && (
          <p className="mt-1 text-sm text-red-600">{errors.background_art.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Technical Problem</label>
        <Textarea
          {...register('technical_problem')}
          placeholder="What technical problem does your invention solve?"
          rows={3}
          className="mt-1"
        />
        {errors.technical_problem && (
          <p className="mt-1 text-sm text-red-600">{errors.technical_problem.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Technical Solution</label>
        <Textarea
          {...register('technical_solution')}
          placeholder="How does your invention solve the technical problem?"
          rows={4}
          className="mt-1"
        />
        {errors.technical_solution && (
          <p className="mt-1 text-sm text-red-600">{errors.technical_solution.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Industrial Applicability</label>
        <Textarea
          {...register('industrial_applicability')}
          placeholder="How can your invention be applied in industry?"
          rows={3}
          className="mt-1"
        />
        {errors.industrial_applicability && (
          <p className="mt-1 text-sm text-red-600">{errors.industrial_applicability.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Keywords</label>
        <div className="mt-1 flex flex-wrap gap-2">
          {watch('keywords').map((keyword, index) => (
            <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
              <span className="text-sm">{keyword}</span>
              <button
                type="button"
                onClick={() => {
                  const newKeywords = watch('keywords').filter((_, i) => i !== index)
                  onUpdate({ ...data, keywords: newKeywords })
                }}
                className="ml-2 text-gray-500 hover:text-red-500"
              >
                ×
              </button>
            </div>
          ))}
          <Input
            type="text"
            placeholder="Add keyword"
            className="!mt-0 w-32"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                const input = e.target as HTMLInputElement
                const value = input.value.trim()
                if (value) {
                  const newKeywords = [...watch('keywords'), value]
                  onUpdate({ ...data, keywords: newKeywords })
                  input.value = ''
                }
              }
            }}
          />
        </div>
        {errors.keywords && (
          <p className="mt-1 text-sm text-red-600">{errors.keywords.message}</p>
        )}
      </div>
    </form>
  )
} 