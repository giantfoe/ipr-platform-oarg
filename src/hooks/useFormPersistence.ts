import { useState, useEffect } from 'react'
import { useWallet } from "@solana/wallet-adapter-react"
import { debounce } from 'lodash'

export function useFormPersistence<T>(
  formId: string,
  initialData?: T,
  autosaveDelay = 1000
) {
  const { publicKey } = useWallet()
  const [formData, setFormData] = useState<T | undefined>(initialData)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)

  // Load saved data on mount
  useEffect(() => {
    if (!publicKey) return

    const savedData = localStorage.getItem(
      `form_${formId}_${publicKey.toBase58()}`
    )
    if (savedData) {
      try {
        const { data, timestamp } = JSON.parse(savedData)
        setFormData(data)
        setLastSaved(new Date(timestamp))
      } catch (err) {
        console.error('Error loading saved form data:', err)
      }
    }
    setLoading(false)
  }, [formId, publicKey])

  // Autosave
  const saveForm = debounce((data: T) => {
    if (!publicKey) return

    try {
      localStorage.setItem(
        `form_${formId}_${publicKey.toBase58()}`,
        JSON.stringify({
          data,
          timestamp: new Date().toISOString()
        })
      )
      setLastSaved(new Date())
    } catch (err) {
      console.error('Error saving form data:', err)
    }
  }, autosaveDelay)

  const updateFormData = (data: T) => {
    setFormData(data)
    saveForm(data)
  }

  const clearSavedData = () => {
    if (!publicKey) return
    localStorage.removeItem(`form_${formId}_${publicKey.toBase58()}`)
    setLastSaved(null)
  }

  return {
    formData,
    updateFormData,
    clearSavedData,
    lastSaved,
    loading
  }
} 