'use client'

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { Application } from '@/types/database'

interface ApplicationsPDFProps {
  applications: Application[]
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff'
  },
  title: {
    fontSize: 24,
    marginBottom: 20
  },
  table: {
    display: 'table',
    width: 'auto',
    marginBottom: 10
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    alignItems: 'center',
    minHeight: 24
  },
  tableHeader: {
    backgroundColor: '#f0f0f0'
  },
  tableCell: {
    width: '25%',
    padding: 5,
    fontSize: 10
  }
})

export function ApplicationsPDF({ applications }: ApplicationsPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Applications Report</Text>
        
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Title</Text>
            <Text style={styles.tableCell}>Type</Text>
            <Text style={styles.tableCell}>Status</Text>
            <Text style={styles.tableCell}>Date</Text>
          </View>

          {/* Table Body */}
          {applications.map((app) => (
            <View key={app.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{app.title}</Text>
              <Text style={styles.tableCell}>{app.application_type}</Text>
              <Text style={styles.tableCell}>{app.status}</Text>
              <Text style={styles.tableCell}>
                {new Date(app.created_at).toLocaleDateString()}
              </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  )
} 