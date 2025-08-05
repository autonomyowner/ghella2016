'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Circle, Loader2 } from 'lucide-react';

export interface ProgressStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
}

interface ProgressIndicatorProps {
  steps: ProgressStep[];
  currentStep: string;
  className?: string;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  currentStep,
  className = ''
}) => {
  const getStepIcon = (step: ProgressStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'active':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'error':
        return <Circle className="w-5 h-5 text-red-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStepColor = (step: ProgressStep) => {
    switch (step.status) {
      case 'completed':
        return 'border-green-500 bg-green-500/10';
      case 'active':
        return 'border-blue-500 bg-blue-500/10';
      case 'error':
        return 'border-red-500 bg-red-500/10';
      default:
        return 'border-gray-300 bg-gray-100/10';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <motion.div
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${getStepColor(step)}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {getStepIcon(step)}
              </motion.div>
              <motion.div
                className="mt-2 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                <p className={`text-sm font-medium ${
                  step.status === 'active' ? 'text-blue-600' :
                  step.status === 'completed' ? 'text-green-600' :
                  step.status === 'error' ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {step.description}
                </p>
              </motion.div>
            </div>
            
            {index < steps.length - 1 && (
              <motion.div
                className={`flex-1 h-0.5 mx-4 ${
                  step.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                }`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: step.status === 'completed' ? 1 : 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* Current Step Details */}
      <AnimatePresence mode="wait">
        {steps.find(step => step.id === currentStep) && (
          <motion.div
            key={currentStep}
            className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
              <div>
                <p className="font-medium text-blue-900">
                  {steps.find(step => step.id === currentStep)?.title}
                </p>
                <p className="text-sm text-blue-700">
                  {steps.find(step => step.id === currentStep)?.description}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProgressIndicator; 