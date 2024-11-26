import { Application, ApplicationType } from '@/types/database'

interface ApplicationFormProps {
  type: ApplicationType
  initialData?: Partial<Application>
  onSubmit: (data: Partial<Application>) => Promise<void>
}

export function ApplicationForm({ type, initialData, onSubmit }: ApplicationFormProps) {
  // Form implementation based on application type
  // Use initialData to populate form fields
  // Call onSubmit with form data
} 