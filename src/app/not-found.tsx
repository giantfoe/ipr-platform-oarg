export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <h2 className="text-2xl font-bold">404 - Page Not Found</h2>
      <p className="mt-4 text-muted-foreground">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <a
        href="/"
        className="mt-8 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
      >
        Return Home
      </a>
    </div>
  )
} 