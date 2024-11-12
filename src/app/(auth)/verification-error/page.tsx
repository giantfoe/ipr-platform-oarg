export default function VerificationErrorPage() {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Verification Failed
      </h2>
      <p className="text-gray-600 mb-6">
        We couldn't verify your email address. The link might be invalid or has already been used.
      </p>
      <a
        href="/login"
        className="text-primary hover:text-primary-dark font-semibold"
      >
        Return to login
      </a>
    </div>
  )
} 