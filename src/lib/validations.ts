import { z } from 'zod'

export const applicationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  application_type: z.enum(['patent', 'trademark', 'copyright']),
  applicant_name: z.string().min(1, 'Applicant name is required'),
  company_name: z.string().optional(),
  national_id: z.string().optional(),
  phone_number: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
  technical_field: z.string().optional(),
  background_art: z.string().optional(),
  invention: z.object({
    problem: z.string(),
    solution: z.string(),
    advantages: z.array(z.string())
  }).optional(),
  claims: z.array(z.string()).optional(),
  inventors: z.array(z.object({
    name: z.string(),
    address: z.string(),
    nationality: z.string(),
    contribution: z.string()
  })).optional()
})

export type ApplicationFormData = z.infer<typeof applicationSchema>

export const patentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  applicant_name: z.string().min(1, 'Applicant name is required'),
  company_name: z.string().optional(),
  technical_field: z.string().min(1, 'Technical field is required'),
  background_art: z.string().min(1, 'Background art is required'),
  invention_description: z.string().min(1, 'Invention description is required'),
  advantages: z.string().min(1, 'Advantages are required'),
  claims: z.string().min(1, 'At least one claim is required'),
  phone_number: z.string().optional(),
  email: z.string().email('Invalid email').optional(),
})

export type PatentFormData = z.infer<typeof patentSchema>

export const trademarkSchema = z.object({
  // ... trademark validation schema
})

export const copyrightSchema = z.object({
  // ... copyright validation schema
}) 