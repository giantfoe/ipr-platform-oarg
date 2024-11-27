import { useState } from 'react'

export interface FormStep {
  id: string
  title: string
  description: string
  isValid?: boolean
  isOptional?: boolean
}

interface UseMultiStepFormProps<T> {
  steps: FormStep[]
  initialData?: T
  onComplete: (data: T) => Promise<void>
}

export function useMultiStepForm<T>({ 
  steps, 
  initialData, 
  onComplete 
}: UseMultiStepFormProps<T>) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [formData, setFormData] = useState<Partial<T>>(initialData || {})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentStep = steps[currentStepIndex]
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === steps.length - 1
  const progress = Math.round(((currentStepIndex + 1) / steps.length) * 100)

  const goToNext = () => {
    if (!isLastStep) {
      setCurrentStepIndex(i => i + 1)
    }
  }

  const goToPrevious = () => {
    if (!isFirstStep) {
      setCurrentStepIndex(i => i - 1)
    }
  }

  const goToStep = (index: number) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStepIndex(index)
    }
  }

  const updateFormData = (stepData: Partial<T>) => {
    setFormData(prev => ({ ...prev, ...stepData }))
  }

  const handleComplete = async () => {
    setLoading(true)
    setError(null)

    try {
      await onComplete(formData as T)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    currentStep,
    currentStepIndex,
    steps,
    isFirstStep,
    isLastStep,
    progress,
    formData,
    loading,
    error,
    goToNext,
    goToPrevious,
    goToStep,
    updateFormData,
    handleComplete
  }
} 