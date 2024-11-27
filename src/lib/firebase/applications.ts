import { 
  collection, 
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  CollectionReference,
  DocumentReference
} from 'firebase/firestore'
import { db } from './config'
import type { Application, StatusHistory } from './schema'

export const firebaseDb = {
  // Collection References
  applications: collection(db, 'applications'),
  getStatusHistoryRef: (applicationId: string) => 
    collection(db, 'applications', applicationId, 'statusHistory'),

  // Create new application
  async createApplication(data: Omit<Application, 'id' | 'created_at' | 'updated_at'>) {
    const docRef = await addDoc(this.applications, {
      ...data,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    })

    // Create initial status history
    await addDoc(this.getStatusHistoryRef(docRef.id), {
      application_id: docRef.id,
      status: data.status,
      notes: 'Initial application submission',
      created_at: serverTimestamp(),
      created_by: data.wallet_address
    })

    return docRef.id
  },

  // Get application by ID with status history
  async getApplication(id: string) {
    const docRef = doc(this.applications, id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) return null

    // Get status history
    const historyRef = this.getStatusHistoryRef(id)
    const historySnap = await getDocs(query(
      historyRef,
      orderBy('created_at', 'desc')
    ))

    const history = historySnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return {
      id: docSnap.id,
      ...docSnap.data(),
      statusHistory: history
    }
  },

  // Get all applications for a wallet
  async getApplicationsByWallet(walletAddress: string) {
    const q = query(
      this.applications,
      where('wallet_address', '==', walletAddress),
      orderBy('created_at', 'desc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  },

  // Update application status
  async updateApplicationStatus(
    applicationId: string, 
    status: ApplicationStatus, 
    updatedBy: string,
    notes?: string
  ) {
    const appRef = doc(this.applications, applicationId)
    const historyRef = this.getStatusHistoryRef(applicationId)

    // Update application status
    await updateDoc(appRef, {
      status,
      updated_at: serverTimestamp()
    })

    // Add status history
    await addDoc(historyRef, {
      application_id: applicationId,
      status,
      notes: notes || `Status updated to ${status}`,
      created_at: serverTimestamp(),
      created_by: updatedBy
    })
  }
} 