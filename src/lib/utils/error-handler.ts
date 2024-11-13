import { toast } from '@/components/ui/use-toast'

export function handleError(error: unknown, fallbackMessage = 'An error occurred') {
  console.error('Error:', error)
  
  let message = fallbackMessage
  if (error instanceof Error) {
    message = error.message
  }

  toast({
    title: 'Error',
    description: message,
    variant: 'destructive',
  })
}

export function handleSuccess(message: string) {
  toast({
    title: 'Success',
    description: message,
  })
} 