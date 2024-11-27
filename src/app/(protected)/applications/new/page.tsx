'use client'

import { useState } from 'react'
import { useWallet } from "@solana/wallet-adapter-react"
import { useRouter } from 'next/navigation'
import { createBrowserSupabaseClient } from '@/utils/supabase/client-utils'
import { PatentForm } from '@/app/_components/forms/PatentForm'
import { TrademarkForm } from '@/app/_components/forms/TrademarkForm'
import { CopyrightForm } from '@/app/_components/forms/CopyrightForm'
import { useToast } from "@/components/ui/use-toast"

export default function NewApplicationPage() {
  const { publicKey } = useWallet()
  const router = useRouter()
  const { toast } = useToast()
  const [selectedType, setSelectedType] = useState<'patent' | 'trademark' | 'copyright' | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (formData: any) => {
    if (!publicKey) return
    setLoading(true)
    setError(null)

    try {
      const supabase = createBrowserSupabaseClient()

      // Create the application
      const { data, error: submitError } = await supabase
        .from('ip_applications')
        .insert([{
          ...formData,
          application_type: selectedType,
          wallet_address: publicKey.toBase58(),
          status: 'draft'
        }])
        .select()
        .single()

      if (submitError) throw submitError

      toast({
        title: 'Success',
        description: 'Application created successfully'
      })

      router.push('/applications')
    } catch (err) {
      console.error('Error submitting application:', err)
      setError('Failed to submit application')
      toast({
        title: 'Error',
        description: 'Failed to create application',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  if (!publicKey) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-yellow-50 text-yellow-700 p-4 rounded-md">
          Please connect your wallet to create an application.
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">New IP Application</h1>

      {!selectedType ? (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Select Application Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setSelectedType('patent')}
              className="p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <h3 className="font-medium">Patent</h3>
              <p className="text-sm text-gray-500">Protect your inventions</p>
            </button>
            <button
              onClick={() => setSelectedType('trademark')}
              className="p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <h3 className="font-medium">Trademark</h3>
              <p className="text-sm text-gray-500">Protect your brand</p>
            </button>
            <button
              onClick={() => setSelectedType('copyright')}
              className="p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <h3 className="font-medium">Copyright</h3>
              <p className="text-sm text-gray-500">Protect your creative works</p>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6">
          {selectedType === 'patent' && (
            <PatentForm 
              onSubmit={handleSubmit} 
              loading={loading}
              error={error}
              onCancel={() => setSelectedType(null)}
            />
          )}
          {selectedType === 'trademark' && (
            <TrademarkForm 
              onSubmit={handleSubmit} 
              loading={loading}
              error={error}
              onCancel={() => setSelectedType(null)}
            />
          )}
          {selectedType === 'copyright' && (
            <CopyrightForm 
              onSubmit={handleSubmit} 
              loading={loading}
              error={error}
              onCancel={() => setSelectedType(null)}
            />
          )}
        </div>
      )}
    </div>
  )
} 