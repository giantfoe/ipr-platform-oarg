export default function VerificationExpiredPage() {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Verification Link Expired
      </h2>
      <p className="text-gray-600 mb-6">
        The verification link has expired. Please request a new verification email.
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