'use client'

import { useState } from 'react'
import { useWallet } from "@solana/wallet-adapter-react"
import { Button } from '@/app/_components/ui/button'
import { LoadingSpinner } from '@/app/_components/ui/LoadingSpinner'
import { createClient } from '@/utils/supabase/client'
import { inputStyles, selectStyles, textareaStyles } from '@/app/_components/ui/input-styles'

interface Inventor {
  name: string
  address: string
  nationality: string
  contribution: string
}

interface PatentFormData {
  // Basic Information
  title: string
  description: string
  applicant_name: string
  company_name: string
  national_id: string
  phone_number: string
  email: string
  
  // Patent Specific
  technical_field: string
  background_art: string
  invention: {
    problem: string
    solution: string
    advantages: string[]
  }
  claims: string[]
  inventors: Inventor[]
  priority_claim?: {
    country: string
    applicationNumber: string
    filingDate: string
  }
}

interface PatentFormProps {
  onSubmit: (data: PatentFormData) => Promise<void>
  loading: boolean
  error: string | null
  onCancel: () => void
}

const TABLE_NAME = 'ip_applications'

export function PatentForm({ onSubmit, loading: parentLoading, error: parentError, onCancel }: PatentFormProps) {
  const { publicKey } = useWallet()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<PatentFormData>({
    title: '',
    description: '',
    applicant_name: '',
    company_name: '',
    national_id: '',
    phone_number: '',
    email: '',
    technical_field: '',
    background_art: '',
    invention: {
      problem: '',
      solution: '',
      advantages: ['']
    },
    claims: [''],
    inventors: [{
      name: '',
      address: '',
      nationality: '',
      contribution: ''
    }]
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!publicKey) {
      setError('Please connect your wallet')
      return
    }

    setSubmitting(true)
    setError(null)
    
    try {
      const supabase = createClient()

      // Format the application data
      const applicationData = {
        title: formData.title,
        description: formData.description,
        applicant_name: formData.applicant_name,
        company_name: formData.company_name,
        national_id: formData.national_id,
        phone_number: formData.phone_number,
        email: formData.email,
        application_type: 'patent',
        technical_field: formData.technical_field,
        background_art: formData.background_art,
        invention: formData.invention,
        claims: formData.claims,
        inventors: formData.inventors,
        wallet_address: publicKey.toBase58(),
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: publicKey.toBase58()
      }

      console.log('Submitting application to', TABLE_NAME, ':', applicationData)

      // Insert the application
      const { data, error: insertError } = await supabase
        .from(TABLE_NAME)
        .insert([applicationData])
        .select()
        .single()

      if (insertError) {
        console.error('Supabase error:', insertError)
        throw new Error(insertError.message)
      }

      if (!data) {
        throw new Error('No data returned from insert')
      }

      console.log('Application submitted successfully:', data)

      // Create initial status history
      const { error: historyError } = await supabase
        .from('application_history')
        .insert([{
          application_id: data.id,
          status: 'draft',
          changed_by: publicKey.toBase58(),
          notes: 'Initial submission',
          created_at: new Date().toISOString()
        }])

      if (historyError) {
        console.error('History creation error:', historyError)
        // Don't throw here, as the application was created successfully
      }

      await onSubmit(data)
    } catch (err) {
      console.error('Error submitting application:', err)
      setError(err instanceof Error ? err.message : 'Failed to submit application')
    } finally {
      setSubmitting(false)
    }
  }

  if (!publicKey) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md">
        Please connect your wallet to submit an application.
      </div>
    )
  }

  const isLoading = submitting || parentLoading

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title of Invention
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className={inputStyles}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Applicant Name
            </label>
            <input
              type="text"
              value={formData.applicant_name}
              onChange={(e) => setFormData(prev => ({ ...prev, applicant_name: e.target.value }))}
              className={inputStyles}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Company Name
            </label>
            <input
              type="text"
              value={formData.company_name}
              onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
              className={inputStyles}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              National ID
            </label>
            <input
              type="text"
              value={formData.national_id}
              onChange={(e) => setFormData(prev => ({ ...prev, national_id: e.target.value }))}
              className={inputStyles}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone_number}
              onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
              className={inputStyles}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className={inputStyles}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            className={textareaStyles}
            required
          />
        </div>
      </div>

      {/* Technical Details */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900">Technical Details</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Technical Field
          </label>
          <textarea
            value={formData.technical_field}
            onChange={(e) => setFormData(prev => ({ ...prev, technical_field: e.target.value }))}
            rows={3}
            className={textareaStyles}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Background Art
          </label>
          <textarea
            value={formData.background_art}
            onChange={(e) => setFormData(prev => ({ ...prev, background_art: e.target.value }))}
            rows={3}
            className={textareaStyles}
            required
          />
        </div>
      </div>

      {/* Invention Details */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900">Invention Details</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Problem Addressed
          </label>
          <textarea
            value={formData.invention.problem}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              invention: { ...prev.invention, problem: e.target.value }
            }))}
            rows={3}
            className={textareaStyles}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Proposed Solution
          </label>
          <textarea
            value={formData.invention.solution}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              invention: { ...prev.invention, solution: e.target.value }
            }))}
            rows={3}
            className={textareaStyles}
            required
          />
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
              onClick={addAdvantage}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Advantage
            </Button>
          </div>
          {formData.invention.advantages.map((advantage, index) => (
            <div key={index} className="flex gap-2 mt-2">
              <input
                type="text"
                value={advantage}
                onChange={(e) => {
                  const newAdvantages = [...formData.invention.advantages]
                  newAdvantages[index] = e.target.value
                  setFormData(prev => ({
                    ...prev,
                    invention: { ...prev.invention, advantages: newAdvantages }
                  }))
                }}
                className={inputStyles}
                placeholder={`Advantage ${index + 1}`}
                required
              />
              {formData.invention.advantages.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeAdvantage(index)}
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Claims */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Claims</h2>
          <Button
            type="button"
            variant="outline"
            onClick={addClaim}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Claim
          </Button>
        </div>
        
        {formData.claims.map((claim, index) => (
          <div key={index} className="flex gap-2">
            <div className="flex-grow">
              <label className="block text-sm font-medium text-gray-700">
                Claim {index + 1}
              </label>
              <textarea
                value={claim}
                onChange={(e) => updateClaim(index, e.target.value)}
                rows={3}
                className={textareaStyles}
                required
              />
            </div>
            {formData.claims.length > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => removeClaim(index)}
              >
                <MinusCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Inventors */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Inventors</h2>
          <Button
            type="button"
            variant="outline"
            onClick={addInventor}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Inventor
          </Button>
        </div>
        
        {formData.inventors.map((inventor, index) => (
          <div key={index} className="space-y-4 p-4 border rounded-lg relative">
            {formData.inventors.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => removeInventor(index)}
              >
                <MinusCircle className="h-4 w-4" />
              </Button>
            )}
            
            <h3 className="font-medium">Inventor {index + 1}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={inventor.name}
                  onChange={(e) => updateInventor(index, 'name', e.target.value)}
                  className={inputStyles}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  value={inventor.address}
                  onChange={(e) => updateInventor(index, 'address', e.target.value)}
                  className={inputStyles}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Nationality</label>
                <input
                  type="text"
                  value={inventor.nationality}
                  onChange={(e) => updateInventor(index, 'nationality', e.target.value)}
                  className={inputStyles}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Contribution</label>
                <input
                  type="text"
                  value={inventor.contribution}
                  onChange={(e) => updateInventor(index, 'contribution', e.target.value)}
                  className={inputStyles}
                  required
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Submitting...
            </>
          ) : (
            'Submit Application'
          )}
        </Button>
      </div>

      {(error || parentError) && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          {error || parentError}
        </div>
      )}
    </form>
  )
} 