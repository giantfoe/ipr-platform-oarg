'use client'

import { useEffect, useState } from 'react'
import { useWallet } from "@solana/wallet-adapter-react"
import { LoadingSpinner } from '@/app/_components/ui/LoadingSpinner'
import { Application, ApplicationComment, ApplicationAttachment } from '@/types/database'
import { getApplicationById, addApplicationComment } from '@/utils/database'
import Link from 'next/link'
import { ArrowLeft, Paperclip, MessageCircle } from 'lucide-react'
import { StatusBadge } from '@/app/_components/ui/StatusBadge'
import { Button } from '@/app/_components/ui/button'

interface PageProps {
  params: { id: string }
}

export default function ApplicationDetailPage({ params }: PageProps) {
  const { publicKey } = useWallet()
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [comment, setComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)

  useEffect(() => {
    async function loadApplication() {
      if (!publicKey) return
      
      try {
        const data = await getApplicationById(params.id)
        setApplication(data)
      } catch (err) {
        console.error('Error loading application:', err)
        setError('Failed to load application')
      } finally {
        setLoading(false)
      }
    }

    loadApplication()
  }, [publicKey, params.id])

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!publicKey || !application || !comment.trim()) return

    setSubmittingComment(true)
    try {
      await addApplicationComment(application.id, comment)
      setComment('')
      // Reload application to get updated comments
      const updatedApp = await getApplicationById(params.id)
      setApplication(updatedApp)
    } catch (err) {
      console.error('Error adding comment:', err)
    } finally {
      setSubmittingComment(false)
    }
  }

  if (!publicKey) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md">
        Please connect your wallet to view this application.
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !application) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        {error || 'Application not found'}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/applications" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Applications
      </Link>

      <div className="bg-white shadow rounded-lg">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{application.title}</h1>
              <p className="mt-1 text-sm text-gray-500">
                Submitted on {new Date(application.created_at).toLocaleDateString()}
              </p>
            </div>
            <StatusBadge status={application.status} />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium">Application Details</h3>
              <dl className="mt-4 space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Type</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">{application.application_type}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900">{application.description}</dd>
                </div>
                {/* Render type-specific fields based on application_type */}
                {application.application_type === 'patent' && (
                  // Patent specific fields
                  <>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Technical Field</dt>
                      <dd className="mt-1 text-sm text-gray-900">{application.technical_field}</dd>
                    </div>
                    {/* Add other patent fields */}
                  </>
                )}
                {application.application_type === 'trademark' && (
                  // Trademark specific fields
                  <>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Mark Type</dt>
                      <dd className="mt-1 text-sm text-gray-900">{application.mark_type}</dd>
                    </div>
                    {/* Add other trademark fields */}
                  </>
                )}
                {application.application_type === 'copyright' && (
                  // Copyright specific fields
                  <>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Work Type</dt>
                      <dd className="mt-1 text-sm text-gray-900">{application.work_type}</dd>
                    </div>
                    {/* Add other copyright fields */}
                  </>
                )}
              </dl>
            </div>

            <div>
              <h3 className="text-lg font-medium">Applicant Information</h3>
              <dl className="mt-4 space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{application.applicant_name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Company</dt>
                  <dd className="mt-1 text-sm text-gray-900">{application.company_name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">{application.phone_number}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{application.email}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="px-6 py-4 border-t border-gray-200">
          <h3 className="text-lg font-medium mb-4">Comments</h3>
          <div className="space-y-4">
            {application.comments?.map((comment: ApplicationComment) => (
              <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <p className="text-sm text-gray-900">{comment.comment}</p>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
            <form onSubmit={handleAddComment} className="mt-4">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                rows={3}
                placeholder="Add a comment..."
              />
              <div className="mt-2 flex justify-end">
                <Button type="submit" disabled={submittingComment || !comment.trim()}>
                  {submittingComment ? 'Sending...' : 'Add Comment'}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Attachments Section */}
        <div className="px-6 py-4 border-t border-gray-200">
          <h3 className="text-lg font-medium mb-4">Attachments</h3>
          <div className="space-y-2">
            {application.attachments?.map((attachment: ApplicationAttachment) => (
              <div key={attachment.id} className="flex items-center space-x-2">
                <Paperclip className="h-4 w-4 text-gray-400" />
                <a 
                  href={attachment.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {attachment.file_name}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 