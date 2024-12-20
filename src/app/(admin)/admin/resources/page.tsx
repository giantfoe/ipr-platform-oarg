'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { LoadingSpinner } from '@/app/_components/ui/LoadingSpinner'
import { Plus, Pencil } from 'lucide-react'
import { Button } from '@/app/_components/ui/button'
import ClientOnly from '@/app/_components/ClientOnly'
import { useWallet } from "@solana/wallet-adapter-react"

interface WrittenResource {
  id: string
  title: string
  slug: string
  type: 'patent' | 'trademark' | 'copyright'
  description: string
  content: string
  author: string
  published: boolean
  created_at: string
  updated_at: string
  category: string
  reading_time?: number
}

export default function AdminResourcesPage() {
  const { publicKey } = useWallet()
  const [resources, setResources] = useState<WrittenResource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    type: 'patent' as const,
    description: '',
    content: '',
    author: '',
    published: true,
    category: 'general',
    reading_time: 5
  })

  const loadResources = useCallback(async () => {
    if (!publicKey) {
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

      // Then fetch resources
      const { data, error } = await supabase
        .from('written_resources')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setResources(data || [])
    } catch (err) {
      console.error('Error loading resources:', err)
      setError(err instanceof Error ? err.message : 'Failed to load resources')
    } finally {
      setLoading(false)
    }
  }, [publicKey])

  useEffect(() => {
    loadResources()
  }, [loadResources])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!publicKey) return

    try {
      setError(null)
      const walletAddress = publicKey.toBase58()

      // Generate slug from title
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      const resourceData = {
        title: formData.title,
        type: formData.type,
        description: formData.description,
        content: formData.content,
        author: formData.author,
        published: formData.published,
        category: formData.category,
        reading_time: formData.reading_time,
        updated_at: new Date().toISOString()
      }

      const supabase = createClient()

      if (isEditing && isEditing !== 'new') {
        // Update existing resource
        const { error: updateError } = await supabase
          .from('written_resources')
          .update(resourceData)
          .eq('id', isEditing)
          .select()

        if (updateError) throw updateError
      } else {
        // Create new resource
        const { error: insertError } = await supabase
          .from('written_resources')
          .insert([{
            ...resourceData,
            slug,
            created_by: walletAddress,
            created_at: new Date().toISOString()
          }])
          .select()

        if (insertError) throw insertError
      }

      // Reset form
      setFormData({
        title: '',
        type: 'patent',
        description: '',
        content: '',
        author: '',
        published: true,
        category: 'general',
        reading_time: 5
      })
      setIsEditing(null)

      // Reload resources
      await loadResources()

    } catch (err: any) {
      console.error('Error saving resource:', err)
      setError(err.message || 'Failed to save resource')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <ClientOnly>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manage Resources</h1>
          <Button
            onClick={() => setIsEditing('new')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Resource
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-md">
            {error}
          </div>
        )}

        {(isEditing === 'new' || isEditing) && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">
              {isEditing === 'new' ? 'Add New Resource' : 'Edit Resource'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900 focus:border-primary focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                >
                  <option value="patent">Patent</option>
                  <option value="trademark">Trademark</option>
                  <option value="copyright">Copyright</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900 focus:border-primary focus:ring-primary"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900 focus:border-primary focus:ring-primary"
                  rows={10}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Author</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900 focus:border-primary focus:ring-primary"
                  required
                />
              </div>

              <div className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="published" className="text-sm font-medium text-gray-700">
                  Publish Resource
                </label>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(null)
                    setFormData({
                      title: '',
                      type: 'patent',
                      description: '',
                      content: '',
                      author: '',
                      published: true,
                      category: 'general',
                      reading_time: 5
                    })
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditing === 'new' ? 'Create Resource' : 'Update Resource'}
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {resources.map((resource) => (
                <tr key={resource.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{resource.title}</div>
                    <div className="text-sm text-gray-500">{resource.description.substring(0, 100)}...</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 capitalize">{resource.type}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{resource.author}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsEditing(resource.id)
                          setFormData({
                            title: resource.title,
                            type: resource.type,
                            description: resource.description,
                            content: resource.content,
                            author: resource.author,
                            published: resource.published,
                            category: resource.category,
                            reading_time: resource.reading_time
                          })
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ClientOnly>
  )
} 