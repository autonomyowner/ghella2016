'use client';

interface ErrorInfo {
  message: string;
  solution: string;
  severity: 'low' | 'medium' | 'high';
  category: 'validation' | 'network' | 'auth' | 'upload' | 'database' | 'general';
}

class ErrorHandler {
  private errorMap: Map<string, ErrorInfo> = new Map();

  constructor() {
    this.initializeErrorMap();
  }

  private initializeErrorMap() {
    // Authentication errors
    this.errorMap.set('auth/user-not-found', {
      message: 'لم يتم العثور على المستخدم',
      solution: 'تأكد من صحة البريد الإلكتروني أو قم بإنشاء حساب جديد',
      severity: 'medium',
      category: 'auth'
    });

    this.errorMap.set('auth/wrong-password', {
      message: 'كلمة المرور غير صحيحة',
      solution: 'تأكد من كلمة المرور أو استخدم "نسيت كلمة المرور"',
      severity: 'medium',
      category: 'auth'
    });

    this.errorMap.set('auth/email-already-in-use', {
      message: 'البريد الإلكتروني مستخدم بالفعل',
      solution: 'استخدم بريد إلكتروني آخر أو قم بتسجيل الدخول',
      severity: 'low',
      category: 'auth'
    });

    this.errorMap.set('auth/weak-password', {
      message: 'كلمة المرور ضعيفة جداً',
      solution: 'استخدم كلمة مرور قوية تحتوي على 8 أحرف على الأقل',
      severity: 'low',
      category: 'auth'
    });

    // Network errors
    this.errorMap.set('network/offline', {
      message: 'لا يوجد اتصال بالإنترنت',
      solution: 'تحقق من اتصالك بالإنترنت وحاول مرة أخرى',
      severity: 'high',
      category: 'network'
    });

    this.errorMap.set('network/timeout', {
      message: 'انتهت مهلة الاتصال',
      solution: 'تحقق من سرعة الإنترنت وحاول مرة أخرى',
      severity: 'medium',
      category: 'network'
    });

    // Upload errors
    this.errorMap.set('upload/file-too-large', {
      message: 'حجم الملف كبير جداً',
      solution: 'اختر ملفاً أصغر أو قم بضغط الصورة',
      severity: 'low',
      category: 'upload'
    });

    this.errorMap.set('upload/invalid-file-type', {
      message: 'نوع الملف غير مدعوم',
      solution: 'استخدم ملفات الصور فقط (JPG, PNG, WebP)',
      severity: 'low',
      category: 'upload'
    });

    this.errorMap.set('upload/too-many-files', {
      message: 'عدد الملفات كبير جداً',
      solution: 'اختر 5 ملفات كحد أقصى',
      severity: 'low',
      category: 'upload'
    });

    // Database errors
    this.errorMap.set('database/permission-denied', {
      message: 'ليس لديك صلاحية لهذا الإجراء',
      solution: 'تأكد من تسجيل الدخول أو اتصل بالدعم',
      severity: 'high',
      category: 'database'
    });

    this.errorMap.set('database/not-found', {
      message: 'لم يتم العثور على البيانات المطلوبة',
      solution: 'تأكد من صحة المعرف أو حاول تحديث الصفحة',
      severity: 'medium',
      category: 'database'
    });

    this.errorMap.set('database/duplicate-entry', {
      message: 'هذا العنصر موجود بالفعل',
      solution: 'استخدم عنواناً مختلفاً أو قم بتعديل العنصر الموجود',
      severity: 'low',
      category: 'database'
    });

    // Validation errors
    this.errorMap.set('validation/required-field', {
      message: 'هذا الحقل مطلوب',
      solution: 'أدخل قيمة صحيحة في الحقل المطلوب',
      severity: 'low',
      category: 'validation'
    });

    this.errorMap.set('validation/invalid-email', {
      message: 'البريد الإلكتروني غير صحيح',
      solution: 'أدخل بريد إلكتروني صحيح (مثال: user@example.com)',
      severity: 'low',
      category: 'validation'
    });

    this.errorMap.set('validation/invalid-phone', {
      message: 'رقم الهاتف غير صحيح',
      solution: 'أدخل رقم هاتف صحيح (مثال: +213 555 123 456)',
      severity: 'low',
      category: 'validation'
    });

    this.errorMap.set('validation/invalid-price', {
      message: 'السعر غير صحيح',
      solution: 'أدخل سعراً صحيحاً (أرقام فقط)',
      severity: 'low',
      category: 'validation'
    });

    // General errors
    this.errorMap.set('general/unknown', {
      message: 'حدث خطأ غير متوقع',
      solution: 'حاول مرة أخرى أو اتصل بالدعم الفني',
      severity: 'medium',
      category: 'general'
    });

    this.errorMap.set('general/server-error', {
      message: 'خطأ في الخادم',
      solution: 'حاول مرة أخرى بعد قليل أو اتصل بالدعم',
      severity: 'high',
      category: 'general'
    });
  }

  /**
   * Parse error and return user-friendly information
   */
  parseError(error: any): ErrorInfo {
    const errorMessage = error?.message || error?.toString() || 'unknown';
    
    // Try to find exact match
    for (const [key, info] of this.errorMap) {
      if (errorMessage.includes(key) || key.includes(errorMessage)) {
        return info;
      }
    }

    // Try to match by category
    if (errorMessage.includes('auth')) {
      return this.errorMap.get('auth/user-not-found')!;
    }
    
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return this.errorMap.get('network/offline')!;
    }
    
    if (errorMessage.includes('upload') || errorMessage.includes('file')) {
      return this.errorMap.get('upload/file-too-large')!;
    }
    
    if (errorMessage.includes('database') || errorMessage.includes('permission')) {
      return this.errorMap.get('database/permission-denied')!;
    }
    
    if (errorMessage.includes('validation') || errorMessage.includes('required')) {
      return this.errorMap.get('validation/required-field')!;
    }

    // Default error
    return this.errorMap.get('general/unknown')!;
  }

  /**
   * Get error by specific code
   */
  getErrorByCode(code: string): ErrorInfo | null {
    return this.errorMap.get(code) || null;
  }

  /**
   * Get all errors by category
   */
  getErrorsByCategory(category: string): ErrorInfo[] {
    const errors: ErrorInfo[] = [];
    for (const [_, info] of this.errorMap) {
      if (info.category === category) {
        errors.push(info);
      }
    }
    return errors;
  }

  /**
   * Get error severity color
   */
  getSeverityColor(severity: string): string {
    switch (severity) {
      case 'low':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'medium':
        return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'high':
        return 'text-red-500 bg-red-500/10 border-red-500/20';
      default:
        return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  }

  /**
   * Get error icon
   */
  getErrorIcon(category: string): string {
    switch (category) {
      case 'auth':
        return '🔐';
      case 'network':
        return '🌐';
      case 'upload':
        return '📤';
      case 'database':
        return '🗄️';
      case 'validation':
        return '✅';
      default:
        return '⚠️';
    }
  }

  /**
   * Log error for debugging
   */
  logError(error: any, context?: string): void {
    console.group(`🚨 Error${context ? ` in ${context}` : ''}`);
    console.error('Error object:', error);
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack);
    console.error('Context:', context);
    console.groupEnd();
  }
}

// Create singleton instance
const errorHandler = new ErrorHandler();

export default errorHandler;
export type { ErrorInfo }; 