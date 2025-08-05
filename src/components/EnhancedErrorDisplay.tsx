'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, RefreshCw, HelpCircle, ExternalLink } from 'lucide-react';
import errorHandler, { ErrorInfo } from '@/lib/errorHandler';

interface EnhancedErrorDisplayProps {
  error: any;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

const EnhancedErrorDisplay: React.FC<EnhancedErrorDisplayProps> = ({
  error,
  onRetry,
  onDismiss,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const errorInfo = errorHandler.parseError(error);

  const getSeverityClasses = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300';
      case 'medium':
        return 'bg-orange-500/10 border-orange-500/20 text-orange-300';
      case 'high':
        return 'bg-red-500/10 border-red-500/20 text-red-300';
      default:
        return 'bg-gray-500/10 border-gray-500/20 text-gray-300';
    }
  };

  const getIconClasses = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'text-yellow-400';
      case 'medium':
        return 'text-orange-400';
      case 'high':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <motion.div
      className={`rounded-lg border p-4 ${getSeverityClasses(errorInfo.severity)} ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 ${getIconClasses(errorInfo.severity)}`}>
          <AlertCircle className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-sm">
              {errorInfo.message}
            </h3>
            
            <div className="flex items-center gap-2">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                  title="إعادة المحاولة"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
              
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
                title="عرض التفاصيل"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
              
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                  title="إغلاق"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 pt-3 border-t border-current/20"
              >
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-xs mb-1">الحل المقترح:</h4>
                    <p className="text-xs opacity-90">{errorInfo.solution}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs">
                    <span className="opacity-70">نوع الخطأ:</span>
                    <span className="px-2 py-1 bg-white/10 rounded-full">
                      {errorInfo.category}
                    </span>
                    <span className="opacity-70">الشدة:</span>
                    <span className={`px-2 py-1 rounded-full ${
                      errorInfo.severity === 'high' ? 'bg-red-500/20' :
                      errorInfo.severity === 'medium' ? 'bg-orange-500/20' :
                      'bg-yellow-500/20'
                    }`}>
                      {errorInfo.severity}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => errorHandler.logError(error, 'EnhancedErrorDisplay')}
                      className="text-xs px-2 py-1 bg-white/10 rounded hover:bg-white/20 transition-colors"
                    >
                      تسجيل الخطأ للتطوير
                    </button>
                    
                    {errorInfo.category === 'network' && (
                      <button
                        onClick={() => window.location.reload()}
                        className="text-xs px-2 py-1 bg-white/10 rounded hover:bg-white/20 transition-colors flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        تحديث الصفحة
                      </button>
                    )}
                    
                    {errorInfo.category === 'auth' && (
                      <button
                        onClick={() => window.location.href = '/auth/login'}
                        className="text-xs px-2 py-1 bg-white/10 rounded hover:bg-white/20 transition-colors flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        تسجيل الدخول
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedErrorDisplay; 