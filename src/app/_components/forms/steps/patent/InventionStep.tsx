'use client'

import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/app/_components/ui/input'
import { Textarea } from '@/app/_components/ui/textarea'
import { Button } from '@/app/_components/ui/button'
import { PatentFormData } from '@/lib/validations'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

const inventionSchema = z.object({
  invention_description: z.string().min(1, 'Invention description is required'),
  advantages: z.array(z.string()).min(1, 'At least one advantage is required'),
  inventors: z.array(z.object({
    name: z.string().min(1, 'Inventor name is required'),
    address: z.string().min(1, 'Address is required'),
    nationality: z.string().min(1, 'Nationality is required'),
    contribution: z.string().min(1, 'Contribution is required')
  })).min(1, 'At least one inventor is required'),
  drawings_description: z.string().optional(),
  best_mode: z.string().min(1, 'Best mode of implementation is required')
})

type InventionStepData = z.infer<typeof inventionSchema>

interface InventionStepProps {
  data: Partial<PatentFormData>
  onUpdate: (data: Partial<PatentFormData>) => void
}

export function InventionStep({ data, onUpdate }: InventionStepProps) {
  const { register, control, handleSubmit, formState: { errors } } = useForm<InventionStepData>({
    resolver: zodResolver(inventionSchema),
    defaultValues: {
      invention_description: data.invention_description || '',
      advantages: data.advantages || [''],
      inventors: data.inventors || [{ name: '', address: '', nationality: '', contribution: '' }],
      drawings_description: data.drawings_description || '',
      best_mode: data.best_mode || ''
    }
  })

  const { fields: advantageFields, append: appendAdvantage, remove: removeAdvantage } = 
    useFieldArray({ control, name: 'advantages' })
  
  const { fields: inventorFields, append: appendInventor, remove: removeInventor } = 
    useFieldArray({ control, name: 'inventors' })

  const onSubmit = (formData: InventionStepData) => {
    onUpdate(formData)
  }

  // Auto-save on field change
  const handleFieldChange = handleSubmit(onSubmit)

  return (
    <form onChange={handleFieldChange} className="space-y-8">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Detailed Description
        </label>
        <Textarea
          {...register('invention_description')}
          placeholder="Provide a detailed description of your invention"
          rows={6}
          className="mt-1"
        />
        {errors.invention_description && (
          <p className="mt-1 text-sm text-red-600">{errors.invention_description.message}</p>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Advantages
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendAdvantage('')}
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Advantage
          </Button>
        </div>
        <div className="space-y-3">
          {advantageFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                {...register(`advantages.${index}`)}
                placeholder={`Advantage ${index + 1}`}
              />
              {index > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAdvantage(index)}
                >
                  <TrashIcon className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>
          ))}
        </div>
        {errors.advantages && (
          <p className="mt-1 text-sm text-red-600">{errors.advantages.message}</p>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Inventors
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendInventor({ name: '', address: '', nationality: '', contribution: '' })}
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Inventor
          </Button>
        </div>
        <div className="space-y-6">
          {inventorFields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-lg relative">
              {index > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => removeInventor(index)}
                >
                  <TrashIcon className="h-4 w-4 text-red-500" />
                </Button>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <Input
                    {...register(`inventors.${index}.name`)}
                    placeholder="Full name"
                    className="mt-1"
                  />
                  {errors.inventors?.[index]?.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.inventors[index]?.name?.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nationality</label>
                  <Input
                    {...register(`inventors.${index}.nationality`)}
                    placeholder="Nationality"
                    className="mt-1"
                  />
                  {errors.inventors?.[index]?.nationality && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.inventors[index]?.nationality?.message}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <Input
                    {...register(`inventors.${index}.address`)}
                    placeholder="Full address"
                    className="mt-1"
                  />
                  {errors.inventors?.[index]?.address && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.inventors[index]?.address?.message}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Contribution</label>
                  <Textarea
                    {...register(`inventors.${index}.contribution`)}
                    placeholder="Describe the inventor's contribution"
                    rows={2}
                    className="mt-1"
                  />
                  {errors.inventors?.[index]?.contribution && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.inventors[index]?.contribution?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Drawings Description
        </label>
        <Textarea
          {...register('drawings_description')}
          placeholder="Describe any drawings or figures (optional)"
          rows={4}
          className="mt-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Best Mode of Implementation
        </label>
        <Textarea
          {...register('best_mode')}
          placeholder="Describe the best way to implement your invention"
          rows={4}
          className="mt-1"
        />
        {errors.best_mode && (
          <p className="mt-1 text-sm text-red-600">{errors.best_mode.message}</p>
        )}
      </div>
    </form>
  )
} 