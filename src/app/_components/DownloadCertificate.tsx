'use client'

import { useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import { CertificatePDF } from './Certificate'
import { Button } from './ui/button'
import { LoadingSpinner } from './ui/LoadingSpinner'

interface DownloadCertificateProps {
  applicationData: {
    id: string
    title: string
    applicant_name: string
    company_name: string
    application_type: string
    created_at: string
    approved_at: string
  }
}

export function DownloadCertificate({ applicationData }: DownloadCertificateProps) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    try {
      const blob = await pdf(<CertificatePDF applicationData={applicationData} />).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `certificate-${applicationData.id}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating certificate:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={loading}
      className="bg-green-600 hover:bg-green-700 text-white"
    >
      {loading ? (
        <>
          <LoadingSpinner size="sm" className="mr-2" />
          Generating Certificate...
        </>
      ) : (
        'Download Certificate'
      )}
    </Button>
  )
} 