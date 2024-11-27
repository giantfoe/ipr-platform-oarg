'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { app, db, storage } from './config'
import type { Firestore } from 'firebase/firestore'
import type { FirebaseStorage } from 'firebase/storage'

interface FirebaseContextType {
  app: typeof app
  db: Firestore
  storage: FirebaseStorage
  initialized: boolean
}

const FirebaseContext = createContext<FirebaseContextType | null>(null)

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    setInitialized(true)
  }, [])

  return (
    <FirebaseContext.Provider value={{ app, db, storage, initialized }}>
      {children}
    </FirebaseContext.Provider>
  )
}

export function useFirebase() {
  const context = useContext(FirebaseContext)
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider')
  }
  return context
} 