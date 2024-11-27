import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from './config'

// Sample data arrays for variation
const applicantNames = [
  "Ayorinde John",
  "Sarah Johnson",
  "Michael Chang",
  "Elena Rodriguez",
  "David Smith",
  "Aisha Patel",
  "James Wilson",
  "Maria Garcia",
  "Robert Kim",
  "Lisa Thompson"
]

const companyNames = [
  "John Innovation Inc",
  "Tech Solutions Ltd",
  "Global Innovations Corp",
  "Future Systems LLC",
  "Smart Patents Co",
  "Digital Ventures Inc",
  "Innovation Labs",
  "Tech Pioneers Ltd",
  "Next Gen Solutions",
  "Creative Patents Inc"
]

const applicationTypes = ["Patent", "Trademark", "Copyright"]

const titles = [
  "Blockchain Security System",
  "AI-Powered Analytics Platform",
  "Smart Contract Implementation",
  "Decentralized Storage Solution",
  "Quantum Computing Interface",
  "Digital Asset Management",
  "Secure Payment Protocol",
  "Data Privacy Framework",
  "IoT Security System",
  "Distributed Computing Platform"
]

const descriptions = [
  "A revolutionary blockchain security system for enhanced protection",
  "Advanced analytics platform utilizing artificial intelligence",
  "Novel implementation of smart contract technology",
  "Innovative solution for decentralized data storage",
  "Interface system for quantum computing applications",
  "Comprehensive digital asset management solution",
  "Secure and efficient payment processing protocol",
  "Framework for ensuring data privacy and protection",
  "Security system for Internet of Things devices",
  "Platform for distributed computing operations"
]

const statuses = ["Draft", "Pending", "In Review", "Approved", "Rejected"]

const walletAddresses = [
  "cle37jdnvksdbkvsd",
  "9FWeJ69Dt7PQae2knpCGBnUueZb43pPnGGAnmqHupnDr",
  "8dK5QFvmGWpuMTSdv8AkXDxAjBxUGH2vNxZA6bCHKLmN",
  "7nE4QRvkLmPuYTS9v7AkWDxAjBxUGH2vNxZA6bCHKLmM",
  "6mD3PQvkLmPuYTS9v7AkWDxAjBxUGH2vNxZA6bCHKLmL"
]

// Function to get random item from array
const getRandomItem = (array: any[]) => array[Math.floor(Math.random() * array.length)]

// Function to generate a single random application
const generateApplication = () => ({
  applicant_name: getRandomItem(applicantNames),
  application_type: getRandomItem(applicationTypes),
  company_name: getRandomItem(companyNames),
  created_at: serverTimestamp(),
  description: getRandomItem(descriptions),
  name: getRandomItem(applicantNames),
  status: getRandomItem(statuses),
  title: getRandomItem(titles),
  updated_at: serverTimestamp(),
  wallet_address: getRandomItem(walletAddresses)
})

// Function to add multiple sample applications
export async function generateSampleApplications(count: number = 20) {
  const applications = []
  const applicationsRef = collection(db, 'applications')

  console.log(`Generating ${count} sample applications...`)

  try {
    for (let i = 0; i < count; i++) {
      const application = generateApplication()
      const docRef = await addDoc(applicationsRef, application)
      applications.push({ id: docRef.id, ...application })
      console.log(`Created application ${i + 1}/${count} with ID: ${docRef.id}`)
    }

    console.log('Successfully generated all sample applications')
    return applications
  } catch (error) {
    console.error('Error generating sample applications:', error)
    throw error
  }
}

// Function to generate applications for a specific wallet
export async function generateApplicationsForWallet(walletAddress: string, count: number = 5) {
  const applications = []
  const applicationsRef = collection(db, 'applications')

  console.log(`Generating ${count} applications for wallet ${walletAddress}...`)

  try {
    for (let i = 0; i < count; i++) {
      const application = {
        ...generateApplication(),
        wallet_address: walletAddress
      }
      const docRef = await addDoc(applicationsRef, application)
      applications.push({ id: docRef.id, ...application })
      console.log(`Created application ${i + 1}/${count} with ID: ${docRef.id}`)
    }

    console.log('Successfully generated applications for wallet')
    return applications
  } catch (error) {
    console.error('Error generating applications:', error)
    throw error
  }
}

// Usage example:
// generateSampleApplications(20) // Generate 20 random applications
// generateApplicationsForWallet("your_wallet_address", 5) // Generate 5 applications for a specific wallet 