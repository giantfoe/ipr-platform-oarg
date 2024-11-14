'use client'

import { useEffect, useState } from 'react'
import { ResourcesList } from '@/app/_components/resources/ResourcesList'
import { createClient } from '@/utils/supabase/client'
import { Loader2 } from 'lucide-react'

interface Resource {
  id: string
  title: string
  type: 'patent' | 'trademark' | 'copyright'
  description: string
  fileUrl?: string
  author: string
  created_at: string
  slug: string
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadResources() {
      try {
        const supabase = createClient()
        const { data, error: fetchError } = await supabase
          .from('educational_resources')
          .select('*')
          .order('created_at', { ascending: false })

        if (fetchError) throw fetchError
        setResources(data || [])
      } catch (err) {
        console.error('Error loading resources:', err)
        setError('Failed to load resources')
      } finally {
        setLoading(false)
      }
    }

    loadResources()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Educational Resources</h1>
          <p className="text-muted-foreground mt-1">
            Learn about intellectual property registration and protection
          </p>
        </div>
      </div>

      <ResourcesList resources={resources} />
    </div>
  )
} 