'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckIcon } from '@heroicons/react/24/solid'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { useFormPersistence } from '@/hooks/useFormPersistence'
import { FormStep } from '@/hooks/useMultiStepForm'
import { Button } from '../ui/button'

interface MultiStepFormProps<T> {
  formId: string
  currentStep: FormStep
  steps: FormStep[]
  currentStepIndex: number
  progress: number
  isFirstStep: boolean
  isLastStep: boolean
  loading: boolean
  error: string | null
  formData: Partial<T>
  onNext: () => void
  onPrevious: () => void
  onStepSubmit: (data: Partial<T>) => void
  onComplete: () => Promise<void>
  children: React.ReactNode
}

export function MultiStepForm<T>({
  formId,
  currentStep,
  steps,
  currentStepIndex,
  progress,
  isFirstStep,
  isLastStep,
  loading,
  error,
  formData,
  onNext,
  onPrevious,
  onStepSubmit,
  onComplete,
  children
}: MultiStepFormProps<T>) {
  const { updateFormData: persistForm, lastSaved } = useFormPersistence<T>(
    formId,
    formData as T
  )

  useEffect(() => {
    persistForm(formData as T)
  }, [formData, persistForm])

  return (
    <div className="space-y-8">
      {/* Progress bar */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">
            Step {currentStepIndex + 1} of {steps.length}
          </span>
          {lastSaved && (
            <span className="text-sm text-gray-500">
              Last saved: {new Date(lastSaved).toLocaleTimeString()}
            </span>
          )}
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Steps indicator */}
      <nav aria-label="Progress">
        <ol className="flex items-center justify-between w-full">
          {steps.map((step, index) => (
            <li key={step.id} className="flex items-center">
              <span
                className={`
                  w-8 h-8 flex items-center justify-center rounded-full
                  ${index < currentStepIndex
                    ? 'bg-primary text-white'
                    : index === currentStepIndex
                    ? 'border-2 border-primary text-primary'
                    : 'border-2 border-gray-300 text-gray-300'
                  }
                `}
              >
                {index < currentStepIndex ? (
                  <CheckIcon className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </span>
              {index < steps.length - 1 && (
                <div className="hidden sm:block w-full bg-gray-200 h-0.5 mx-4">
                  <div
                    className="bg-primary h-0.5 transition-all duration-500"
                    style={{
                      width: index < currentStepIndex ? '100%' : '0%'
                    }}
                  />
                </div>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Form content */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-1">{currentStep.title}</h2>
        <p className="text-gray-600 mb-6">{currentStep.description}</p>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={isFirstStep || loading}
        >
          Previous
        </Button>

        <Button
          type="button"
          onClick={isLastStep ? onComplete : onNext}
          disabled={loading}
        >
          {loading ? (
            <LoadingSpinner size="sm" />
          ) : isLastStep ? (
            'Submit Application'
          ) : (
            'Next'
          )}
        </Button>
      </div>
    </div>
  )
} 