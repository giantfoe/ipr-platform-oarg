import { z } from 'zod'

// Helper function for phone validation
const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/

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
  advantages: z.string().transform((str) => str.split('\n').filter(Boolean)),
  claims: z.string().transform((str) => str.split('\n').filter(Boolean)),
  mobile_number: z.string()
    .min(1, 'Mobile number is required')
    .regex(phoneRegex, 'Please enter a valid mobile number'),
  email: z.string().email('Invalid email').optional(),
  regions: z.string().transform((str) => str.split('\n').filter(Boolean))
})

export type PatentFormData = z.infer<typeof patentSchema>

export const trademarkSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  applicant_name: z.string().min(1, 'Applicant name is required'),
  company_name: z.string().optional(),
  mark_type: z.string().nonempty('Mark type is required'),
  goods_services: z.string().min(1, 'Goods/Services description is required'),
  prior_registrations: z.string().transform((str) => str.split('\n').filter(Boolean)),
  mobile_number: z.string()
    .min(1, 'Mobile number is required')
    .regex(phoneRegex, 'Please enter a valid mobile number'),
  email: z.string().email('Invalid email').optional(),
  regions: z.string().transform((str) => str.split('\n').filter(Boolean))
})

export type TrademarkFormData = z.infer<typeof trademarkSchema>

export const copyrightSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  applicant_name: z.string().min(1, 'Applicant name is required'),
  company_name: z.string().optional(),
  work_type: z.enum(['literary', 'musical', 'artistic', 'dramatic', 'audiovisual', 'software', 'other'], {
    required_error: 'Please select a work type'
  }),
  creation_date: z.string().min(1, 'Creation date is required'),
  first_publication: z.string().optional(),
  authors: z.string().transform((str) => str.split('\n').filter(Boolean)),
  mobile_number: z.string()
    .min(1, 'Mobile number is required')
    .regex(phoneRegex, 'Please enter a valid mobile number'),
  email: z.string().email('Invalid email').optional(),
  regions: z.string().transform((str) => str.split('\n').filter(Boolean))
})

export type CopyrightFormData = z.infer<typeof copyrightSchema> 