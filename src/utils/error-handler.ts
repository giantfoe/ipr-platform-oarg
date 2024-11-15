export interface ErrorDetails {
  message: string
  code?: string
  details?: unknown
}

export function handleError(error: unknown): ErrorDetails {
  if (error instanceof Error) {
    return {
      message: error.message,
      code: (error as any).code,
      details: (error as any).details
    }
  }
  
  return {
    message: String(error)
  }
} 