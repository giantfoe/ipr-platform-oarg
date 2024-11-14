'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/app/_components/ui/button'

interface Resource {
  id: string
  title: string
  type: 'patent' | 'trademark' | 'copyright'
  description: string
  content: string
  slug: string
  author: string
  created_at: string
}

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    type: 'patent',
    description: '',
    content: '',
    author: ''
  })

  useEffect(() => {
    loadResources()
  }, [])

  async function loadResources() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('educational_resources')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setResources(data || [])
    } catch (error) {
      console.error('Error loading resources:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const supabase = createClient()
      
      // Generate slug from title
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      if (isEditing) {
        // Update existing resource
        const { error } = await supabase
          .from('educational_resources')
          .update({
            ...formData,
            slug,
            updated_at: new Date().toISOString()
          })
          .eq('id', isEditing)

        if (error) throw error
      } else {
        // Create new resource
        const { error } = await supabase
          .from('educational_resources')
          .insert([{
            ...formData,
            slug
          }])

        if (error) throw error
      }

      // Reset form and reload resources
      setFormData({
        title: '',
        type: 'patent',
        description: '',
        content: '',
        author: ''
      })
      setIsEditing(null)
      loadResources()
    } catch (error) {
      console.error('Error saving resource:', error)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this resource?')) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('educational_resources')
        .delete()
        .eq('id', id)

      if (error) throw error
      loadResources()
    } catch (error) {
      console.error('Error deleting resource:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
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
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
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
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
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
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
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
                    author: ''
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                          author: resource.author
                        })
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(resource.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 