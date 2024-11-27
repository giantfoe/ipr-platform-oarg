'use client'

import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Textarea } from '@/app/_components/ui/textarea'
import { Button } from '@/app/_components/ui/button'
import { PatentFormData } from '@/lib/validations'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

const claimsSchema = z.object({
  claims: z.array(z.object({
    text: z.string().min(1, 'Claim text is required'),
    type: z.enum(['independent', 'dependent']),
    dependentOn: z.number().optional()
  })).min(1, 'At least one claim is required'),
  abstract: z.string().min(1, 'Abstract is required')
})

type ClaimsStepData = z.infer<typeof claimsSchema>

interface ClaimsStepProps {
  data: Partial<PatentFormData>
  onUpdate: (data: Partial<PatentFormData>) => void
}

export function ClaimsStep({ data, onUpdate }: ClaimsStepProps) {
  const { register, control, handleSubmit, formState: { errors }, watch } = useForm<ClaimsStepData>({
    resolver: zodResolver(claimsSchema),
    defaultValues: {
      claims: data.claims || [{ text: '', type: 'independent' }],
      abstract: data.abstract || ''
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'claims'
  })

  const onSubmit = (formData: ClaimsStepData) => {
    onUpdate(formData)
  }

  const handleFieldChange = handleSubmit(onSubmit)
  const watchClaims = watch('claims')

  return (
    <form onChange={handleFieldChange} className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Patent Claims
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ text: '', type: 'independent' })}
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Claim
          </Button>
        </div>

        <div className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-lg relative">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">Claim {index + 1}</span>
                  <select
                    {...register(`claims.${index}.type`)}
                    className="text-sm border rounded-md"
                  >
                    <option value="independent">Independent</option>
                    <option value="dependent">Dependent</option>
                  </select>
                  {watchClaims[index]?.type === 'dependent' && (
                    <select
                      {...register(`claims.${index}.dependentOn`)}
                      className="text-sm border rounded-md"
                    >
                      {fields.slice(0, index).map((_, i) => (
                        <option key={i} value={i + 1}>
                          Depends on Claim {i + 1}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                {index > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <TrashIcon className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>

              <Textarea
                {...register(`claims.${index}.text`)}
                placeholder={`What is claimed is...`}
                rows={4}
              />
              {errors.claims?.[index]?.text && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.claims[index]?.text?.message}
                </p>
              )}
            </div>
          ))}
        </div>
        {errors.claims && (
          <p className="mt-1 text-sm text-red-600">{errors.claims.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Abstract
        </label>
        <Textarea
          {...register('abstract')}
          placeholder="Provide a brief abstract of your invention"
          rows={4}
          className="mt-1"
        />
        {errors.abstract && (
          <p className="mt-1 text-sm text-red-600">{errors.abstract.message}</p>
        )}
      </div>

      <div className="bg-yellow-50 p-4 rounded-md">
        <h4 className="text-sm font-medium text-yellow-800 mb-2">Tips for Writing Claims:</h4>
        <ul className="text-sm text-yellow-700 list-disc list-inside space-y-1">
          <li>Start with your broadest independent claims</li>
          <li>Use clear and precise language</li>
          <li>Each claim should be a single sentence</li>
          <li>Dependent claims should reference previous claims</li>
          <li>Avoid relative terms and unclear limitations</li>
        </ul>
      </div>
    </form>
  )
} 