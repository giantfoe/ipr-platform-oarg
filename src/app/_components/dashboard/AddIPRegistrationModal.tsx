'use client'

import React, { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { Button } from '../ui/button'
import { useForm } from 'react-hook-form'

interface AddIPFormInputs {
  ip_name: string
  ip_type: string
}

const AddIPRegistrationModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { register, handleSubmit, reset } = useForm<AddIPFormInputs>()

  const onSubmit = async (data: AddIPFormInputs) => {
    try {
      const response = await fetch('/api/ip-registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        // Refresh the page or update state to reflect the new IP registration
        reset()
        setIsOpen(false)
        // Optionally, trigger a re-fetch of the IP registrations
      } else {
        console.error('Failed to add IP registration')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="bg-[#635BFF] hover:bg-[#0A2540]">
        Add IP Registration
      </Button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <div className="relative bg-white rounded-lg max-w-sm mx-auto p-6">
            <Dialog.Title className="text-lg font-semibold text-[#0A2540]">Add New IP Registration</Dialog.Title>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">IP Name</label>
                <input 
                  type="text" 
                  {...register('ip_name', { required: true })} 
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">IP Type</label>
                <select 
                  {...register('ip_type', { required: true })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Trademark">Trademark</option>
                  <option value="Patent">Patent</option>
                  <option value="Copyright">Copyright</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" onClick={() => setIsOpen(false)} variant="ghost">
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#635BFF] hover:bg-[#0A2540]">
                  Add
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default AddIPRegistrationModal 