'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { LoadingSpinner } from '@/app/_components/ui/LoadingSpinner'
import { Search } from 'lucide-react'
import { Button } from '@/app/_components/ui/button'
import ClientOnly from '@/app/_components/ClientOnly'

interface Resource {
  id: string
  title: string
  type: 'patent' | 'trademark' | 'copyright'
  description: string
  content: string
  file_url?: string
  author: string
  created_at: string
  slug: string
  published: boolean
}

const RESOURCE_TYPES = ['patent', 'trademark', 'copyright'] as const

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string | null>(null)

  useEffect(() => {
    async function loadResources() {
      try {
        const supabase = createClient()
        const { data, error: fetchError } = await supabase
          .from('educational_resources')
          .select('*')
          .eq('published', true)
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

  // Filter resources based on search and type
  const filteredResources = resources.filter(resource => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = !selectedType || resource.type === selectedType

    return matchesSearch && matchesType
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <ClientOnly>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Educational Resources</h1>
            <p className="text-muted-foreground mt-1">
              Learn about intellectual property registration and protection
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search resources..."
                className="w-full pl-9 pr-4 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              {RESOURCE_TYPES.map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedType(selectedType === type ? null : type)}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {/* Resources Grid */}
          {filteredResources.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">No resources found</p>
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {filteredResources.map((resource) => (
                  <Link 
                    key={resource.id}
                    href={`/resources/${resource.slug}`}
                    className="block bg-white rounded-lg border hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="p-6">
                      <div className="flex flex-col h-full">
                        <div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                            {resource.type}
                          </span>
                          <h3 className="mt-2 text-lg font-medium text-gray-900">
                            {resource.title}
                          </h3>
                          <p className="mt-2 text-sm text-gray-500 line-clamp-3">
                            {resource.description}
                          </p>
                        </div>
                        <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm text-gray-500">
                          <span>{resource.author}</span>
                          <span>{new Date(resource.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ClientOnly>
  )
} 