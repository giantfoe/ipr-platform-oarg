'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/app/_components/ui/button'

interface ResourceDetail {
  id: string
  title: string
  type: 'patent' | 'trademark' | 'copyright'
  description: string
  content: string
  file_url?: string
  author: string
  created_at: string
  slug: string
}

export default function ResourceDetailPage({
  params
}: {
  params: { slug: string }
}) {
  const [resource, setResource] = useState<ResourceDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadResource() {
      if (!params.slug) return

      try {
        const supabase = createClient()
        console.log('Fetching resource with slug:', params.slug) // Debug log

        const { data, error: fetchError } = await supabase
          .from('educational_resources')
          .select(`
            id,
            title,
            type,
            description,
            content,
            file_url,
            author,
            created_at,
            slug
          `)
          .eq('slug', params.slug)
          .single()

        if (fetchError) {
          console.error('Supabase error:', fetchError) // Debug log
          throw fetchError
        }

        console.log('Resource data:', data) // Debug log
        setResource(data)
      } catch (err) {
        console.error('Error loading resource:', err)
        setError('Failed to load resource')
      } finally {
        setLoading(false)
      }
    }

    loadResource()
  }, [params.slug])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !resource) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          <p>{error || 'Resource not found'}</p>
          <Link href="/resources" className="mt-4 inline-block text-sm underline">
            Return to Resources
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/resources">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Resources
          </Button>
        </Link>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{resource.title}</h1>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{resource.author}</span>
              <span>•</span>
              <span>{new Date(resource.created_at).toLocaleDateString()}</span>
              <span>•</span>
              <span className="capitalize">{resource.type}</span>
            </div>
          </div>

          <div className="prose prose-gray max-w-none">
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Overview</h2>
              <p>{resource.description}</p>
            </div>

            <div className="space-y-4">
              <div 
                dangerouslySetInnerHTML={{ __html: resource.content }} 
                className="formatted-content"
              />
            </div>

            {resource.file_url && (
              <div className="mt-8 p-4 bg-accent/50 rounded-lg">
                <h3 className="font-semibold mb-2">Additional Resources</h3>
                <a 
                  href={resource.file_url}
                  download
                  className="text-primary hover:underline inline-flex items-center"
                >
                  <span>Download Resource Material</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 