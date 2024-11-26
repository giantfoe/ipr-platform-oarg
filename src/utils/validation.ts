import { z } from 'zod'

const inventorSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  nationality: z.string().min(1),
  contribution: z.string().min(1)
})

const patentSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  applicant_name: z.string().min(1),
  company_name: z.string().optional(),
  national_id: z.string().min(1),
  phone_number: z.string().min(1),
  email: z.string().email(),
  technical_field: z.string().min(1),
  background_art: z.string().min(1),
  invention: z.object({
    problem: z.string().min(1),
    solution: z.string().min(1),
    advantages: z.array(z.string().min(1))
  }),
  claims: z.array(z.string().min(1)),
  inventors: z.array(inventorSchema)
})

export function validateApplication(data: any): string | null {
  try {
    switch (data.application_type) {
      case 'patent':
        patentSchema.parse(data)
        break
      // Add other application types here
      default:
        return 'Invalid application type'
    }
    return null
  } catch (err) {
    if (err instanceof z.ZodError) {
      return err.errors[0].message
    }
    return 'Invalid application data'
  }
} 