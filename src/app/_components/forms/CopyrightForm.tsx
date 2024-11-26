'use client'

import { useState } from 'react'
import { Button } from '@/app/_components/ui/button'
import { LoadingSpinner } from '@/app/_components/ui/LoadingSpinner'
import { PlusCircle, MinusCircle } from 'lucide-react'
import { inputStyles, selectStyles, textareaStyles } from '@/app/_components/ui/input-styles'

interface Author {
  name: string
  nationality: string
  contribution: string
  isDeceased: boolean
  dateOfDeath?: string
}

interface CopyrightFormData {
  // Basic Information
  title: string
  description: string
  applicant_name: string
  company_name: string
  national_id: string
  phone_number: string
  email: string
  
  // Copyright Specific
  work_type: 'Literary' | 'Musical' | 'Dramatic' | 'Artistic' | 'Audiovisual' | 'Sound Recording' | 'Architectural'
  alternative_titles: string[]
  date_of_creation: string
  date_of_publication?: string
  country_of_origin: string
  authors: Author[]
  is_derivative: boolean
  preexisting_material?: string
  new_material?: string
  rights_ownership: 'Original Author' | 'Work for Hire' | 'Transfer of Rights'
}

interface CopyrightFormProps {
  onSubmit: (data: CopyrightFormData) => Promise<void>
  loading: boolean
  error: string | null
  onCancel: () => void
}

export function CopyrightForm({ onSubmit, loading, error, onCancel }: CopyrightFormProps) {
  const [formData, setFormData] = useState<CopyrightFormData>({
    title: '',
    description: '',
    applicant_name: '',
    company_name: '',
    national_id: '',
    phone_number: '',
    email: '',
    work_type: 'Literary',
    alternative_titles: [],
    date_of_creation: '',
    country_of_origin: 'Sierra Leone',
    authors: [{
      name: '',
      nationality: '',
      contribution: '',
      isDeceased: false
    }],
    is_derivative: false,
    rights_ownership: 'Original Author'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const addAuthor = () => {
    setFormData(prev => ({
      ...prev,
      authors: [
        ...prev.authors,
        { name: '', nationality: '', contribution: '', isDeceased: false }
      ]
    }))
  }

  const removeAuthor = (index: number) => {
    if (formData.authors.length > 1) {
      setFormData(prev => ({
        ...prev,
        authors: prev.authors.filter((_, i) => i !== index)
      }))
    }
  }

  const updateAuthor = (index: number, field: keyof Author, value: any) => {
    const newAuthors = [...formData.authors]
    newAuthors[index] = { ...newAuthors[index], [field]: value }
    setFormData(prev => ({ ...prev, authors: newAuthors }))
  }

  const addAlternativeTitle = () => {
    setFormData(prev => ({
      ...prev,
      alternative_titles: [...prev.alternative_titles, '']
    }))
  }

  const removeAlternativeTitle = (index: number) => {
    setFormData(prev => ({
      ...prev,
      alternative_titles: prev.alternative_titles.filter((_, i) => i !== index)
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
              Title of Work
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

      {/* Work Details */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900">Work Details</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Type of Work
          </label>
          <select
            value={formData.work_type}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              work_type: e.target.value as CopyrightFormData['work_type']
            }))}
            className={selectStyles}
            required
          >
            <option value="Literary">Literary Work</option>
            <option value="Musical">Musical Work</option>
            <option value="Dramatic">Dramatic Work</option>
            <option value="Artistic">Artistic Work</option>
            <option value="Audiovisual">Audiovisual Work</option>
            <option value="Sound Recording">Sound Recording</option>
            <option value="Architectural">Architectural Work</option>
          </select>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Alternative Titles
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addAlternativeTitle}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Title
            </Button>
          </div>
          {formData.alternative_titles.map((title, index) => (
            <div key={index} className="flex gap-2 mt-2">
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  const newTitles = [...formData.alternative_titles]
                  newTitles[index] = e.target.value
                  setFormData(prev => ({ ...prev, alternative_titles: newTitles }))
                }}
                className={inputStyles}
                placeholder="Alternative title"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeAlternativeTitle(index)}
              >
                <MinusCircle className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date of Creation
            </label>
            <input
              type="date"
              value={formData.date_of_creation}
              onChange={(e) => setFormData(prev => ({ ...prev, date_of_creation: e.target.value }))}
              className={inputStyles}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date of Publication (if published)
            </label>
            <input
              type="date"
              value={formData.date_of_publication}
              onChange={(e) => setFormData(prev => ({ ...prev, date_of_publication: e.target.value }))}
              className={inputStyles}
            />
          </div>
        </div>
      </div>

      {/* Authors */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Authors</h2>
          <Button
            type="button"
            variant="outline"
            onClick={addAuthor}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Author
          </Button>
        </div>
        
        {formData.authors.map((author, index) => (
          <div key={index} className="space-y-4 p-4 border rounded-lg relative">
            {formData.authors.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => removeAuthor(index)}
              >
                <MinusCircle className="h-4 w-4" />
              </Button>
            )}
            
            <h3 className="font-medium">Author {index + 1}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={author.name}
                  onChange={(e) => updateAuthor(index, 'name', e.target.value)}
                  className={inputStyles}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Nationality</label>
                <input
                  type="text"
                  value={author.nationality}
                  onChange={(e) => updateAuthor(index, 'nationality', e.target.value)}
                  className={inputStyles}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Contribution</label>
                <input
                  type="text"
                  value={author.contribution}
                  onChange={(e) => updateAuthor(index, 'contribution', e.target.value)}
                  className={inputStyles}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`deceased-${index}`}
                    checked={author.isDeceased}
                    onChange={(e) => updateAuthor(index, 'isDeceased', e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor={`deceased-${index}`} className="ml-2 block text-sm text-gray-700">
                    Deceased
                  </label>
                </div>

                {author.isDeceased && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Death</label>
                    <input
                      type="date"
                      value={author.dateOfDeath}
                      onChange={(e) => updateAuthor(index, 'dateOfDeath', e.target.value)}
                      className={inputStyles}
                      required
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Derivative Work */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="derivative"
            checked={formData.is_derivative}
            onChange={(e) => setFormData(prev => ({ ...prev, is_derivative: e.target.checked }))}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="derivative" className="text-sm font-medium text-gray-700">
            This is a derivative work
          </label>
        </div>

        {formData.is_derivative && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Preexisting Material
              </label>
              <textarea
                value={formData.preexisting_material}
                onChange={(e) => setFormData(prev => ({ ...prev, preexisting_material: e.target.value }))}
                rows={3}
                className={textareaStyles}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Material Added
              </label>
              <textarea
                value={formData.new_material}
                onChange={(e) => setFormData(prev => ({ ...prev, new_material: e.target.value }))}
                rows={3}
                className={textareaStyles}
                required
              />
            </div>
          </>
        )}
      </div>

      {/* Rights Ownership */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900">Rights Ownership</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Type of Ownership
          </label>
          <select
            value={formData.rights_ownership}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              rights_ownership: e.target.value as CopyrightFormData['rights_ownership']
            }))}
            className={selectStyles}
            required
          >
            <option value="Original Author">Original Author</option>
            <option value="Work for Hire">Work for Hire</option>
            <option value="Transfer of Rights">Transfer of Rights</option>
          </select>
        </div>
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