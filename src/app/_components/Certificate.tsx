'use client'

import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer'

interface CertificateProps {
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

const styles = StyleSheet.create({
  page: {
    padding: 50,
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: '#1a365d',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#2d3748',
    textAlign: 'center',
  },
  content: {
    marginTop: 30,
    padding: 20,
    borderWidth: 2,
    borderColor: '#4a5568',
    borderStyle: 'solid',
  },
  text: {
    fontSize: 12,
    marginBottom: 10,
    color: '#2d3748',
  },
  footer: {
    marginTop: 50,
    textAlign: 'center',
    fontSize: 10,
    color: '#718096',
  },
})

export function CertificatePDF({ applicationData }: CertificateProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Certificate of Registration</Text>
          <Text style={styles.subtitle}>Intellectual Property Rights</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.text}>
            This certifies that the {applicationData.application_type.toUpperCase()}:
          </Text>
          <Text style={styles.text}>
            "{applicationData.title}"
          </Text>
          <Text style={styles.text}>
            Has been duly registered and protected under applicable intellectual property laws.
          </Text>

          <Text style={styles.text}>
            Applicant: {applicationData.applicant_name}
          </Text>
          {applicationData.company_name && (
            <Text style={styles.text}>
              Company: {applicationData.company_name}
            </Text>
          )}
          <Text style={styles.text}>
            Registration Date: {new Date(applicationData.approved_at).toLocaleDateString()}
          </Text>
          <Text style={styles.text}>
            Registration Number: {applicationData.id}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text>
            This certificate is electronically generated and is valid without a signature.
          </Text>
          <Text>
            Issued on: {new Date().toLocaleDateString()}
          </Text>
        </View>
      </Page>
    </Document>
  )
} 