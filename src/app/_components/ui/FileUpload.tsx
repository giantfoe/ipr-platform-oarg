'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { createClient } from '@/utils/supabase/client'
import { LoadingSpinner } from './LoadingSpinner'
import { cn } from '@/lib/utils'
import { useToast } from "@/components/ui/use-toast"
import { useWallet } from "@solana/wallet-adapter-react"

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
  const { publicKey } = useWallet()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!publicKey) {
      toast({
        title: "Error",
        description: "Please connect your wallet to upload files",
        variant: "destructive"
      })
      return
    }

    setUploading(true)
    setError(null)
    const uploadedUrls: string[] = []

    try {
      const supabase = createClient()
      const walletAddress = publicKey.toBase58()

      for (const file of acceptedFiles) {
        // Create a folder structure using wallet address and application ID
        const fileExt = file.name.split('.').pop()
        const fileName = `${walletAddress}/${applicationId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

        // Upload file
        const { error: uploadError, data } = await supabase
          .storage
          .from('application-documents')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) {
          console.error('Upload error:', uploadError)
          throw new Error(`Failed to upload ${file.name}`)
        }

        if (data) {
          // Get public URL
          const { data: { publicUrl } } = supabase
            .storage
            .from('application-documents')
            .getPublicUrl(fileName)

          // Create document record
          const { error: docError } = await supabase
            .from('documents')
            .insert({
              application_id: applicationId,
              file_path: fileName,
              file_name: file.name,
              file_type: file.type,
              file_size: file.size,
              mime_type: file.type,
              public_url: publicUrl
            })

          if (docError) {
            console.error('Document record error:', docError)
            throw new Error(`Failed to record document ${file.name}`)
          }

          uploadedUrls.push(publicUrl)
        }
      }

      onUploadComplete(uploadedUrls)
      toast({
        title: 'Success',
        description: `Successfully uploaded ${acceptedFiles.length} file(s)`,
      })
    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'Failed to upload files')
      toast({
        title: 'Error',
        description: 'Failed to upload files. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setUploading(false)
    }
  }, [applicationId, publicKey, onUploadComplete])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    accept: acceptedFileTypes,
    disabled: uploading || !publicKey
  })

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary",
          (uploading || !publicKey) && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="flex items-center justify-center space-x-2">
            <LoadingSpinner size="sm" />
            <span>Uploading...</span>
          </div>
        ) : !publicKey ? (
          <p className="text-sm text-gray-600">
            Please connect your wallet to upload files
          </p>
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