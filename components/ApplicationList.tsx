import { Application } from '@/types/database'

interface ApplicationListProps {
  applications: Application[]
}

export function ApplicationList({ applications }: ApplicationListProps) {
  return (
    <div>
      {applications.map(app => (
        <div key={app.id}>
          <h3>{app.title}</h3>
          <p>Type: {app.application_type}</p>
          <p>Status: {app.status}</p>
          {/* Render other fields based on application type */}
        </div>
      ))}
    </div>
  )
} 