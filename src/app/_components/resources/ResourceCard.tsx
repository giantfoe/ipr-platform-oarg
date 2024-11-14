'use client'

import { useState } from 'react'
import { FileText, Download, Share2 } from 'lucide-react'
import { Button } from '@/app/_components/ui/button'
import Link from 'next/link'

interface ResourceCardProps {
  id: string
  title: string
  type: 'patent' | 'trademark' | 'copyright'
  description: string
  fileUrl?: string
  author: string
  created_at: string
  slug: string
}

export function ResourceCard({
  title,
  type,
  description,
  fileUrl,
  author,
  created_at,
  slug
}: ResourceCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDownload = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(fileUrl as string)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = title
      a.click()
    } catch (error) {
      console.error('Download error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-card rounded-lg shadow-sm p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">By {author}</p>
        </div>
        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
          {type}
        </span>
      </div>

      <p className="text-sm text-card-foreground">{description}</p>

      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center space-x-4">
          {fileUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={isLoading}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          )}
          <Link href={`/resources/${slug}`}>
            <Button variant="default" size="sm">
              Learn More
            </Button>
          </Link>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <FileText className="h-4 w-4 mr-2" />
          {new Date(created_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  )
} 