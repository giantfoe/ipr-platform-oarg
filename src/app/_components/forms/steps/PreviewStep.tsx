'use client'

import { PatentFormData } from '@/lib/validations'
import { Button } from '@/app/_components/ui/button'
import { FileUpload } from '@/app/_components/ui/FileUpload'

interface PreviewStepProps {
  data: Partial<PatentFormData>
  type: 'patent' | 'trademark' | 'copyright'
  onEdit?: (step: string) => void
}

export function PreviewStep({ data, type, onEdit }: PreviewStepProps) {
  const renderSection = (title: string, content: React.ReactNode) => (
    <div className="border-b border-gray-200 pb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {onEdit && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onEdit(title.toLowerCase())}
          >
            Edit
          </Button>
        )}
      </div>
      {content}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4 mb-6">
        <h3 className="text-sm font-medium text-yellow-800 mb-2">
          Final Review
        </h3>
        <p className="text-sm text-yellow-700">
          Please review all information carefully before submission. Once submitted,
          modifications may require additional processing time and fees.
        </p>
      </div>

      <div className="space-y-6">
        {renderSection('Basic Information', (
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Title</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.title}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Applicant Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.applicant_name}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.description}</dd>
            </div>
          </dl>
        ))}

        {type === 'patent' && (
          <>
            {renderSection('Technical Details', (
              <dl className="grid grid-cols-1 gap-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Technical Field</dt>
                  <dd className="mt-1 text-sm text-gray-900">{data.technical_field}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Background Art</dt>
                  <dd className="mt-1 text-sm text-gray-900">{data.background_art}</dd>
                </div>
              </dl>
            ))}

            {renderSection('Claims', (
              <div className="space-y-4">
                {data.claims?.map((claim, index) => (
                  <div key={index}>
                    <h4 className="text-sm font-medium text-gray-500">
                      Claim {index + 1}
                    </h4>
                    <p className="mt-1 text-sm text-gray-900">{claim.text}</p>
                  </div>
                ))}
              </div>
            ))}
          </>
        )}

        {renderSection('Supporting Documents', (
          <div className="space-y-4">
            <FileUpload
              applicationId="preview"
              onUploadComplete={() => {}}
              maxFiles={5}
              acceptedFileTypes={['application/pdf', 'image/*']}
            />
            <p className="text-sm text-gray-500">
              Upload any supporting documents, drawings, or additional materials.
            </p>
          </div>
        ))}
      </div>
    </div>
  )
} 