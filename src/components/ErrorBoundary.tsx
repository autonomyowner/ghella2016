'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
    // You might want to add a more sophisticated retry logic, 
    // like re-fetching data or reloading the page.
    window.location.reload();
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center" dir="rtl">
          <div className="text-center p-8 bg-white rounded-lg shadow-xl max-w-lg mx-auto">
            <div className="text-6xl mb-4">😢</div>
            <h1 className="text-3xl font-bold text-red-800 mb-4">حدث خطأ ما</h1>
            <p className="text-gray-600 mb-6">
              نأسف، لقد واجه التطبيق مشكلة غير متوقعة. الرجاء المحاولة مرة أخرى.
            </p>
            
            {this.state.error && (
              <div className="text-left bg-red-100 border border-red-200 rounded-md p-4 mb-6">
                <p className="font-semibold text-red-700">تفاصيل الخطأ:</p>
                <pre className="text-xs text-red-600 whitespace-pre-wrap break-all">
                  {this.state.error.message}
                </pre>
              </div>
            )}

            <button
              onClick={this.handleRetry}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
            >
              حاول مرة أخرى
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;