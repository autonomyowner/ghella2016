'use client'

import React from 'react'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen gradient-bg-primary flex items-center justify-center py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="glass rounded-3xl p-12">
                <div className="text-6xl mb-6">⚠️</div>
                <h1 className="text-3xl font-bold text-white mb-4">
                  حدث خطأ غير متوقع
                </h1>
                <p className="text-white/80 mb-8 leading-relaxed">
                  نعتذر عن هذا الخطأ. فريقنا التقني يعمل على حل المشكلة.
                  يرجى المحاولة مرة أخرى أو التواصل معنا إذا استمرت المشكلة.
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => window.location.reload()}
                    className="btn-awesome px-8 py-3 rounded-xl font-bold hover-scale"
                  >
                    إعادة تحميل الصفحة
                  </button>
                  <a
                    href="/"
                    className="px-8 py-3 glass-light text-green-800 rounded-xl hover-scale font-bold"
                  >
                    العودة للرئيسية
                  </a>
                </div>
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <div className="mt-8 p-4 bg-red-500/20 rounded-xl text-left">
                    <details>
                      <summary className="text-red-200 font-medium cursor-pointer">
                        تفاصيل الخطأ (وضع التطوير)
                      </summary>
                      <pre className="text-red-200 text-sm mt-2 overflow-auto">
                        {this.state.error.stack}
                      </pre>
                    </details>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
