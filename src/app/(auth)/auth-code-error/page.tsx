export default function AuthCodeErrorPage() {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Authentication Error
      </h2>
      <p className="text-gray-600 mb-6">
        We couldn't authenticate your request. This might happen if the link is invalid or has already been used.
      </p>
      <a
        href="/login"
        className="text-primary hover:text-primary-dark font-semibold"
      >
        Try signing in again
      </a>
    </div>
  )
} 