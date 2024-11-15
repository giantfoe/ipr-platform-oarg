'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { LoadingSpinner } from '@/app/_components/ui/LoadingSpinner'
import { useWallet } from "@solana/wallet-adapter-react"
import Link from 'next/link'
import { ArrowLeft, Clock } from 'lucide-react'
import { StatusBadge } from '@/app/_components/ui/StatusBadge'
import { Button } from '@/app/_components/ui/button'
import ClientOnly from '@/app/_components/ClientOnly'

interface ApplicationDetail {
  id: string
  title: string
  description: string
  application_type: string
  status: string
  regions: string[]
  created_at: string
  updated_at: string
  wallet_address: string
  documents?: any[]
  profiles?: {
    full_name: string
    company_name: string | null
    phone_number: string | null
    email: string | null
  }
  status_history?: {
    status: string
    notes: string
    created_at: string
    created_by: string
  }[]
}

interface PageProps {
  params: { id: string }
}

export default function AdminApplicationDetailPage({ params }: PageProps) {
  const { publicKey } = useWallet()
  const [application, setApplication] = useState<ApplicationDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)
  const [statusNote, setStatusNote] = useState('')

  useEffect(() => {
    async function loadApplication() {
      if (!publicKey || !params.id) {
        setLoading(false)
        return
      }

      try {
        const supabase = createClient()
        
        // First verify admin status
        const { data: adminCheck, error: adminError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('wallet_address', publicKey.toBase58())
          .single()

        if (adminError || !adminCheck?.is_admin) {
          throw new Error('Admin access required')
        }

        const { data, error: fetchError } = await supabase
          .from('ip_applications')
          .select(`
            *,
            profiles (
              full_name,
              company_name,
              phone_number,
              email
            ),
            status_history (
              status,
              notes,
              created_at,
              created_by
            )
          `)
          .eq('id', params.id)
          .single()

        if (fetchError) throw fetchError
        setApplication(data)
      } catch (err) {
        console.error('Error loading application:', err)
        setError(err instanceof Error ? err.message : 'Failed to load application')
      } finally {
        setLoading(false)
      }
    }

    loadApplication()
  }, [publicKey, params.id])

  const handleStatusChange = async (newStatus: string) => {
    if (!publicKey || !application) return
    setUpdating(true)

    try {
      const supabase = createClient()
      const { error: updateError } = await supabase
        .from('ip_applications')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', application.id)

      if (updateError) throw updateError

      // Add status history entry
      const { error: historyError } = await supabase
        .from('status_history')
        .insert({
          application_id: application.id,
          status: newStatus,
          notes: statusNote,
          created_by: publicKey.toBase58()
        })

      if (historyError) throw historyError

      // Reload application
      const { data, error: fetchError } = await supabase
        .from('ip_applications')
        .select(`
          *,
          profiles (
            full_name,
            company_name,
            phone_number,
            email
          ),
          status_history (
            status,
            notes,
            created_at,
            created_by
          )
        `)
        .eq('id', application.id)
        .single()

      if (fetchError) throw fetchError
      setApplication(data)
      setStatusNote('')
    } catch (err) {
      console.error('Error updating status:', err)
      setError(err instanceof Error ? err.message : 'Failed to update status')
    } finally {
      setUpdating(false)
    }
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
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          <p>{error || 'Application not found'}</p>
          <Link href="/admin/applications" className="mt-4 inline-block text-sm underline">
            Return to Applications
          </Link>
        </div>
      </div>
    )
  }

  return (
    <ClientOnly>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/admin/applications" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Applications
        </Link>

        <div className="bg-white shadow rounded-lg p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{application.title}</h1>
              <p className="text-sm text-gray-500 mt-1">
                Submitted on {new Date(application.created_at).toLocaleDateString()}
              </p>
            </div>
            <StatusBadge status={application.status} />
          </div>

          {/* Applicant Information */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h2 className="text-lg font-medium mb-4">Applicant Information</h2>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{application.profiles?.full_name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Company</dt>
                <dd className="mt-1 text-sm text-gray-900">{application.profiles?.company_name || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900">{application.profiles?.phone_number || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{application.profiles?.email || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Wallet Address</dt>
                <dd className="mt-1 text-sm text-gray-900 font-mono">{application.wallet_address}</dd>
              </div>
            </dl>
          </div>

          {/* Application Details */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h2 className="text-lg font-medium mb-4">Application Details</h2>
            <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Application Type</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">{application.application_type}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Regions</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {application.regions?.join(', ') || 'No regions specified'}
                </dd>
              </div>

              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                  {application.description}
                </dd>
              </div>
            </dl>
          </div>

          {/* Status History */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h2 className="text-lg font-medium mb-4">Status History</h2>
            <div className="space-y-4">
              {application.status_history?.map((history, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">
                      Status changed to <span className="font-medium">{history.status}</span>
                    </p>
                    {history.notes && (
                      <p className="mt-1 text-sm text-gray-500">{history.notes}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-400">
                      {new Date(history.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Update Form */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-medium mb-4">Update Status</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  New Status
                </label>
                <select
                  id="status"
                  value={application.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={updating}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm bg-white text-gray-900"
                >
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                  <option value="in-review">In Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  id="notes"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white text-gray-900"
                  placeholder="Add any notes about this status change..."
                />
              </div>

              {updating && (
                <div className="flex items-center justify-center">
                  <LoadingSpinner size="sm" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>
  )
} 