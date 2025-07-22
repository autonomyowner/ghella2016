import FirebaseTest from '@/components/FirebaseTest'

export default function TestFirebasePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Firebase Test</h1>
          <p className="text-gray-400">Test your Firebase configuration and connection</p>
        </div>
        
        <FirebaseTest />
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Use this page to debug Firebase connection issues</p>
          <p>Check the browser console for additional error details</p>
        </div>
      </div>
    </div>
  )
} 
