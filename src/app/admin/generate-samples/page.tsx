'use client'

import { useState } from 'react'
import { useWallet } from "@solana/wallet-adapter-react"
import { generateSampleApplications, generateApplicationsForWallet } from '@/lib/firebase/generate-samples'

export default function GenerateSamplesPage() {
  const { publicKey } = useWallet()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleGenerateRandom = async () => {
    setLoading(true)
    setMessage('Generating random applications...')
    try {
      await generateSampleApplications(20)
      setMessage('Successfully generated 20 random applications!')
    } catch (error) {
      setMessage('Error generating applications: ' + error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateForWallet = async () => {
    if (!publicKey) {
      setMessage('Please connect your wallet first')
      return
    }
    
    setLoading(true)
    setMessage('Generating applications for your wallet...')
    try {
      await generateApplicationsForWallet(publicKey.toBase58(), 5)
      setMessage('Successfully generated 5 applications for your wallet!')
    } catch (error) {
      setMessage('Error generating applications: ' + error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Generate Sample Applications</h1>
      
      <div className="space-y-4">
        <button
          onClick={handleGenerateRandom}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Generate 20 Random Applications
        </button>

        <button
          onClick={handleGenerateForWallet}
          disabled={loading || !publicKey}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 ml-4"
        >
          Generate 5 Applications for My Wallet
        </button>

        {message && (
          <div className={`p-4 rounded ${
            message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  )
} 