'use client'

import { useState } from 'react'
import { Button } from '@/app/_components/ui/button'
import { LoadingSpinner } from '@/app/_components/ui/LoadingSpinner'
import { PlusCircle, MinusCircle } from 'lucide-react'

interface PatentFormProps {
  onSubmit: (data: any) => Promise<void>
  loading: boolean
  error: string | null
  onCancel: () => void
}

export function PatentForm({ onSubmit, loading, error, onCancel }: PatentFormProps) {
  const [formData, setFormData] = useState({
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
    await onSubmit(formData)
  }

  const addInventor = () => {
    setFormData(prev => ({
      ...prev,
      inventors: [
        ...prev.inventors,
        { name: '', address: '', nationality: '', contribution: '' }
      ]
    }))
  }

  const removeInventor = (index: number) => {
    if (formData.inventors.length > 1) {
      setFormData(prev => ({
        ...prev,
        inventors: prev.inventors.filter((_, i) => i !== index)
      }))
    }
  }

  const updateInventor = (index: number, field: string, value: string) => {
    const newInventors = [...formData.inventors]
    newInventors[index] = { ...newInventors[index], [field]: value }
    setFormData(prev => ({ ...prev, inventors: newInventors }))
  }

  const addClaim = () => {
    setFormData(prev => ({
      ...prev,
      claims: [...prev.claims, '']
    }))
  }

  const removeClaim = (index: number) => {
    if (formData.claims.length > 1) {
      setFormData(prev => ({
        ...prev,
        claims: prev.claims.filter((_, i) => i !== index)
      }))
    }
  }

  const updateClaim = (index: number, value: string) => {
    const newClaims = [...formData.claims]
    newClaims[index] = value
    setFormData(prev => ({ ...prev, claims: newClaims }))
  }

  const addAdvantage = () => {
    setFormData(prev => ({
      ...prev,
      invention: {
        ...prev.invention,
        advantages: [...prev.invention.advantages, '']
      }
    }))
  }

  const removeAdvantage = (index: number) => {
    if (formData.invention.advantages.length > 1) {
      setFormData(prev => ({
        ...prev,
        invention: {
          ...prev.invention,
          advantages: prev.invention.advantages.filter((_, i) => i !== index)
        }
      }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Basic Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Applicant Name</label>
            <input
              type="text"
              value={formData.applicant_name}
              onChange={(e) => setFormData(prev => ({ ...prev, applicant_name: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <input
              type="text"
              value={formData.company_name}
              onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">National ID</label>
            <input
              type="text"
              value={formData.national_id}
              onChange={(e) => setFormData(prev => ({ ...prev, national_id: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              value={formData.phone_number}
              onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white"
            required
          />
        </div>
      </div>

      {/* Technical Details */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Technical Details</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Technical Field</label>
          <textarea
            value={formData.technical_field}
            onChange={(e) => setFormData(prev => ({ ...prev, technical_field: e.target.value }))}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Background Art</label>
          <textarea
            value={formData.background_art}
            onChange={(e) => setFormData(prev => ({ ...prev, background_art: e.target.value }))}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white"
            required
          />
        </div>
      </div>

      {/* Invention Details */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Invention Details</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Problem Addressed</label>
          <textarea
            value={formData.invention.problem}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              invention: { ...prev.invention, problem: e.target.value }
            }))}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Proposed Solution</label>
          <textarea
            value={formData.invention.solution}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              invention: { ...prev.invention, solution: e.target.value }
            }))}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white"
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Advantages</label>
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
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white"
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
          <h2 className="text-lg font-medium">Claims</h2>
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white"
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
          <h2 className="text-lg font-medium">Inventors</h2>
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  value={inventor.address}
                  onChange={(e) => updateInventor(index, 'address', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Nationality</label>
                <input
                  type="text"
                  value={inventor.nationality}
                  onChange={(e) => updateInventor(index, 'nationality', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Contribution</label>
                <input
                  type="text"
                  value={inventor.contribution}
                  onChange={(e) => updateInventor(index, 'contribution', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white"
                  required
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Submitting...
            </>
          ) : (
            'Submit Application'
          )}
        </Button>
      </div>
    </form>
  )
} 