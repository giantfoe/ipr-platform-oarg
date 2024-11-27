import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from './config'

const sampleApplication = {
  applicant_name: "Ayorinde John",
  application_type: "Patent",
  company_name: "John Innovation Inc",
  created_at: serverTimestamp(),
  description: "This is my first IP Application",
  name: "Ayorinde John",
  status: "Draft",
  title: "My First Application",
  updated_at: serverTimestamp(),
  wallet_address: "cle37jdnvksdbkvsd"
}

// Function to add sample data
export async function addSampleApplication() {
  try {
    const docRef = await addDoc(collection(db, 'applications'), sampleApplication)
    console.log("Document written with ID: ", docRef.id)
    return docRef.id
  } catch (e) {
    console.error("Error adding document: ", e)
    throw e
  }
} 