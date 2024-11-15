'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import Link from 'next/link'

interface WrittenResource {
  id: string
  title: string
  slug: string
  type: 'patent' | 'trademark' | 'copyright'
  description: string
  content: string
  author: string
  published: boolean
  category: string
  reading_time?: number
  created_at: string
}

interface ResourcesListProps {
  resources: WrittenResource[]
}

const RESOURCE_TYPES = ['patent', 'trademark', 'copyright'] as const

export function ResourcesList({ resources = [] }: ResourcesListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const filteredResources = resources.filter(resource => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = !selectedType || resource.type === selectedType

    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search resources..."
            className="w-full pl-9 pr-4 py-2 bg-white text-gray-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {RESOURCE_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(selectedType === type ? null : type)}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                selectedType === type 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      {filteredResources.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No resources found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  {resource.reading_time && (
                    <div className="mt-2 text-sm text-gray-500">
                      {resource.reading_time} min read
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
} 