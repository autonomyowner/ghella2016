import SignupForm from '@/components/auth/SignupForm'

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a2b24] via-[#155e4d] to-[#2db48b] flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <SignupForm />
      </div>
    </div>
  )
}