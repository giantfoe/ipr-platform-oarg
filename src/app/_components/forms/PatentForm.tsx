'use client'

import { useMultiStepForm, FormStep } from '@/hooks/useMultiStepForm'
import { MultiStepForm } from './MultiStepForm'
import { useFormPersistence } from '@/hooks/useFormPersistence'
import { PatentFormData } from '@/lib/validations'
import { BasicInfoStep } from './steps/patent/BasicInfoStep'
import { TechnicalStep } from './steps/patent/TechnicalStep'
import { InventionStep } from './steps/patent/InventionStep'
import { ClaimsStep } from './steps/patent/ClaimsStep'
import { PreviewStep } from './steps/PreviewStep'

const PATENT_STEPS: FormStep[] = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Enter the basic details about your patent application'
  },
  {
    id: 'technical',
    title: 'Technical Details',
    description: 'Provide technical information about your invention'
  },
  {
    id: 'invention',
    title: 'Invention Description',
    description: 'Describe your invention in detail'
  },
  {
    id: 'claims',
    title: 'Patent Claims',
    description: 'List the claims for your patent'
  },
  {
    id: 'preview',
    title: 'Review & Submit',
    description: 'Review your application before submission'
  }
]

interface PatentFormProps {
  onSubmit: (data: PatentFormData) => Promise<void>
  loading: boolean
  error: string | null
  onCancel: () => void
}

export function PatentForm({ onSubmit, loading, error, onCancel }: PatentFormProps) {
  const {
    currentStep,
    currentStepIndex,
    steps,
    isFirstStep,
    isLastStep,
    progress,
    formData,
    goToNext,
    goToPrevious,
    updateFormData,
    handleComplete
  } = useMultiStepForm<PatentFormData>({
    steps: PATENT_STEPS,
    onComplete: onSubmit
  })

  const { lastSaved } = useFormPersistence('patent-form', formData)

  const renderStep = () => {
    switch (currentStep.id) {
      case 'basic-info':
        return (
          <BasicInfoStep
            data={formData}
            onUpdate={updateFormData}
          />
        )
      case 'technical':
        return (
          <TechnicalStep
            data={formData}
            onUpdate={updateFormData}
          />
        )
      case 'invention':
        return (
          <InventionStep
            data={formData}
            onUpdate={updateFormData}
          />
        )
      case 'claims':
        return (
          <ClaimsStep
            data={formData}
            onUpdate={updateFormData}
          />
        )
      case 'preview':
        return (
          <PreviewStep
            data={formData}
            type="patent"
          />
        )
      default:
        return null
    }
  }

  return (
    <MultiStepForm
      formId="patent-form"
      currentStep={currentStep}
      steps={steps}
      currentStepIndex={currentStepIndex}
      progress={progress}
      isFirstStep={isFirstStep}
      isLastStep={isLastStep}
      loading={loading}
      error={error}
      formData={formData}
      onNext={goToNext}
      onPrevious={goToPrevious}
      onStepSubmit={updateFormData}
      onComplete={handleComplete}
      onCancel={onCancel}
    >
      {renderStep()}
    </MultiStepForm>
  )
}
