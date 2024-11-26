'use client'

import { useState } from 'react'
import { Button } from '@/app/_components/ui/button'
import { LoadingSpinner } from '@/app/_components/ui/LoadingSpinner'
import { PlusCircle, MinusCircle } from 'lucide-react'
import { inputStyles, selectStyles, textareaStyles } from '@/app/_components/ui/input-styles'

interface NiceClass {
  class: number
  specifications: string[]
}

interface TrademarkFormData {
  // Basic Information
  title: string
  description: string
  applicant_name: string
  company_name: string
  national_id: string
  phone_number: string
  email: string
  
  // Trademark Specific
  mark_type: 'Word' | 'Logo' | 'Combined' | 'Sound' | '3D'
  mark_text?: string
  mark_description: string
  color_claim?: string
  nice_classifications: NiceClass[]
  use_status: 'In Use' | 'Intent to Use'
  first_use_date?: string
  disclaimers: string[]
}

interface TrademarkFormProps {
  onSubmit: (data: TrademarkFormData) => Promise<void>
  loading: boolean
  error: string | null
  onCancel: () => void
}

const NICE_CLASSES = Array.from({ length: 45 }, (_, i) => i + 1)

export function TrademarkForm({ onSubmit, loading, error, onCancel }: TrademarkFormProps) {
  const [formData, setFormData] = useState<TrademarkFormData>({
    title: '',
    description: '',
    applicant_name: '',
    company_name: '',
    national_id: '',
    phone_number: '',
    email: '',
    mark_type: 'Word',
    mark_description: '',
    nice_classifications: [{
      class: 1,
      specifications: ['']
    }],
    use_status: 'Intent to Use',
    disclaimers: []
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const addClass = () => {
    setFormData(prev => ({
      ...prev,
      nice_classifications: [
        ...prev.nice_classifications,
        { class: 1, specifications: [''] }
      ]
    }))
  }

  const removeClass = (index: number) => {
    if (formData.nice_classifications.length > 1) {
      setFormData(prev => ({
        ...prev,
        nice_classifications: prev.nice_classifications.filter((_, i) => i !== index)
      }))
    }
  }

  const updateClass = (index: number, classNumber: number) => {
    const newClasses = [...formData.nice_classifications]
    newClasses[index] = { ...newClasses[index], class: classNumber }
    setFormData(prev => ({ ...prev, nice_classifications: newClasses }))
  }

  const addSpecification = (classIndex: number) => {
    const newClasses = [...formData.nice_classifications]
    newClasses[classIndex].specifications.push('')
    setFormData(prev => ({ ...prev, nice_classifications: newClasses }))
  }

  const removeSpecification = (classIndex: number, specIndex: number) => {
    if (formData.nice_classifications[classIndex].specifications.length > 1) {
      const newClasses = [...formData.nice_classifications]
      newClasses[classIndex].specifications = newClasses[classIndex].specifications
        .filter((_, i) => i !== specIndex)
      setFormData(prev => ({ ...prev, nice_classifications: newClasses }))
    }
  }

  const updateSpecification = (classIndex: number, specIndex: number, value: string) => {
    const newClasses = [...formData.nice_classifications]
    newClasses[classIndex].specifications[specIndex] = value
    setFormData(prev => ({ ...prev, nice_classifications: newClasses }))
  }

  const addDisclaimer = () => {
    setFormData(prev => ({
      ...prev,
      disclaimers: [...prev.disclaimers, '']
    }))
  }

  const removeDisclaimer = (index: number) => {
    setFormData(prev => ({
      ...prev,
      disclaimers: prev.disclaimers.filter((_, i) => i !== index)
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mark Name/Title
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

      {/* Mark Details */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900">Mark Details</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mark Type
          </label>
          <select
            value={formData.mark_type}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              mark_type: e.target.value as TrademarkFormData['mark_type']
            }))}
            className={selectStyles}
            required
          >
            <option value="Word">Word Mark</option>
            <option value="Logo">Logo Mark</option>
            <option value="Combined">Combined Mark</option>
            <option value="Sound">Sound Mark</option>
            <option value="3D">3D Mark</option>
          </select>
        </div>

        {formData.mark_type === 'Word' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mark Text
            </label>
            <input
              type="text"
              value={formData.mark_text}
              onChange={(e) => setFormData(prev => ({ ...prev, mark_text: e.target.value }))}
              className={inputStyles}
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mark Description
          </label>
          <textarea
            value={formData.mark_description}
            onChange={(e) => setFormData(prev => ({ ...prev, mark_description: e.target.value }))}
            rows={3}
            className={textareaStyles}
            required
          />
        </div>

        {(formData.mark_type === 'Logo' || formData.mark_type === 'Combined') && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Color Claim
            </label>
            <textarea
              value={formData.color_claim}
              onChange={(e) => setFormData(prev => ({ ...prev, color_claim: e.target.value }))}
              rows={2}
              className={textareaStyles}
            />
          </div>
        )}
      </div>

      {/* Nice Classifications */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Goods & Services</h2>
          <Button
            type="button"
            variant="outline"
            onClick={addClass}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Class
          </Button>
        </div>

        {formData.nice_classifications.map((classification, classIndex) => (
          <div key={classIndex} className="space-y-4 p-4 border rounded-lg relative">
            {formData.nice_classifications.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => removeClass(classIndex)}
              >
                <MinusCircle className="h-4 w-4" />
              </Button>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Nice Class</label>
              <select
                value={classification.class}
                onChange={(e) => updateClass(classIndex, parseInt(e.target.value))}
                className={selectStyles}
                required
              >
                {NICE_CLASSES.map(num => (
                  <option key={num} value={num}>Class {num}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">Specifications</label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => addSpecification(classIndex)}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Specification
                </Button>
              </div>

              {classification.specifications.map((spec, specIndex) => (
                <div key={specIndex} className="flex gap-2">
                  <input
                    type="text"
                    value={spec}
                    onChange={(e) => updateSpecification(classIndex, specIndex, e.target.value)}
                    className={inputStyles}
                    placeholder="Specify goods/services"
                    required
                  />
                  {classification.specifications.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeSpecification(classIndex, specIndex)}
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Use Status */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900">Use Information</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">Use Status</label>
          <select
            value={formData.use_status}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              use_status: e.target.value as TrademarkFormData['use_status']
            }))}
            className={selectStyles}
            required
          >
            <option value="In Use">Currently in Use</option>
            <option value="Intent to Use">Intent to Use</option>
          </select>
        </div>

        {formData.use_status === 'In Use' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">First Use Date</label>
            <input
              type="date"
              value={formData.first_use_date}
              onChange={(e) => setFormData(prev => ({ ...prev, first_use_date: e.target.value }))}
              className={inputStyles}
              required
            />
          </div>
        )}
      </div>

      {/* Disclaimers */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Disclaimers</h2>
          <Button
            type="button"
            variant="outline"
            onClick={addDisclaimer}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Disclaimer
          </Button>
        </div>

        {formData.disclaimers.map((disclaimer, index) => (
          <div key={index} className="flex gap-2">
            <textarea
              value={disclaimer}
              onChange={(e) => {
                const newDisclaimers = [...formData.disclaimers]
                newDisclaimers[index] = e.target.value
                setFormData(prev => ({ ...prev, disclaimers: newDisclaimers }))
              }}
              rows={2}
              className={textareaStyles}
              placeholder="Enter disclaimer text"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => removeDisclaimer(index)}
            >
              <MinusCircle className="h-4 w-4" />
            </Button>
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