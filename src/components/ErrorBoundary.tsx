'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleRetry = () => {
    // Clear the error state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Force a page reload to clear any corrupted state
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  isChunkError = (error: Error): boolean => {
    return (
      error.message.includes('Loading chunk') ||
      error.message.includes('ChunkLoadError') ||
      error.message.includes('sw.js') ||
      error.message.includes('_next/static/chunks')
    );
  };

  render() {
    if (this.state.hasError) {
      const isChunkError = this.state.error && this.isChunkError(this.state.error);

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center p-4" dir="rtl">
          <div className="max-w-md w-full bg-black/50 backdrop-blur-lg border border-red-500/30 rounded-2xl p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                {isChunkError ? 'خطأ في تحميل الصفحة' : 'حدث خطأ غير متوقع'}
              </h1>
              <p className="text-gray-300 mb-6">
                {isChunkError 
                  ? 'حدث خطأ أثناء تحميل الملفات المطلوبة. يرجى المحاولة مرة أخرى.'
                  : 'عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.'
                }
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full flex items-center justify-center space-x-2 rtl:space-x-reverse px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all duration-200 font-medium"
              >
                <RefreshCw className="w-5 h-5" />
                <span>إعادة المحاولة</span>
              </button>

              <button
                onClick={this.handleGoHome}
                className="w-full flex items-center justify-center space-x-2 rtl:space-x-reverse px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-200 font-medium"
              >
                <Home className="w-5 h-5" />
                <span>العودة للرئيسية</span>
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-sm text-gray-400 cursor-pointer hover:text-white transition-colors">
                  تفاصيل الخطأ (للمطورين)
                </summary>
                <div className="mt-2 p-4 bg-black/30 rounded-lg text-xs text-red-300 font-mono overflow-auto">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.message}
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Stack:</strong>
                      <pre className="mt-1 whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
