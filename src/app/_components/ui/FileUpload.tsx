'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { createClient } from '@/utils/supabase/client'
import { LoadingSpinner } from './LoadingSpinner'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  applicationId: string
  onUploadComplete: (urls: string[]) => void
  maxFiles?: number
  acceptedFileTypes?: Record<string, string[]>
}

export function FileUpload({
  applicationId,
  onUploadComplete,
  maxFiles = 5,
  acceptedFileTypes = {
    'application/pdf': ['.pdf'],
    'image/*': ['.png', '.jpg', '.jpeg'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
  }
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true)
    setError(null)
    const uploadedUrls: string[] = []

    try {
      const supabase = createClient()

      for (const file of acceptedFiles) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${applicationId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

        const { error: uploadError, data } = await supabase
          .storage
          .from('application-documents')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) throw uploadError

        if (data) {
          const { data: { publicUrl } } = supabase
            .storage
            .from('application-documents')
            .getPublicUrl(fileName)

          uploadedUrls.push(publicUrl)

          // Add to documents table
          await supabase
            .from('documents')
            .insert({
              application_id: applicationId,
              file_path: fileName,
              file_type: file.type,
              file_name: file.name,
              file_size: file.size,
              mime_type: file.type,
              public_url: publicUrl
            })
        }
      }

      onUploadComplete(uploadedUrls)
    } catch (err) {
      console.error('Upload error:', err)
      setError('Failed to upload files. Please try again.')
    } finally {
      setUploading(false)
    }
  }, [applicationId, onUploadComplete])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    accept: acceptedFileTypes,
    disabled: uploading
  })

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary",
          uploading && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="flex items-center justify-center space-x-2">
            <LoadingSpinner size="sm" />
            <span>Uploading...</span>
          </div>
        ) : isDragActive ? (
          <p className="text-sm text-gray-600">Drop the files here...</p>
        ) : (
          <div>
            <p className="text-sm text-gray-600">
              Drag and drop files here, or click to select files
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Maximum {maxFiles} files. Supported formats: PDF, Images, Word documents
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
} 