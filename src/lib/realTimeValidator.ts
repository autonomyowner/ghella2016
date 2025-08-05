'use client';

interface ValidationRule {
  test: (value: any) => boolean;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

interface ValidationResult {
  isValid: boolean;
  message: string;
  severity: 'error' | 'warning' | 'info';
  suggestions?: string[];
}

interface FieldValidation {
  [fieldName: string]: ValidationRule[];
}

class RealTimeValidator {
  private validationRules: FieldValidation = {};
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.initializeValidationRules();
  }

  private initializeValidationRules() {
    // Title validation
    this.validationRules.title = [
      {
        test: (value) => value.length >= 3,
        message: 'العنوان قصير جداً',
        severity: 'error'
      },
      {
        test: (value) => value.length <= 100,
        message: 'العنوان طويل جداً',
        severity: 'warning'
      },
      {
        test: (value) => /^[\u0600-\u06FF\s\w\d\-_]+$/.test(value),
        message: 'العنوان يحتوي على رموز غير مسموحة',
        severity: 'error'
      }
    ];

    // Price validation
    this.validationRules.price = [
      {
        test: (value) => !isNaN(Number(value)) && Number(value) > 0,
        message: 'السعر يجب أن يكون رقماً موجباً',
        severity: 'error'
      },
      {
        test: (value) => Number(value) <= 1000000000,
        message: 'السعر كبير جداً',
        severity: 'warning'
      },
      {
        test: (value) => /^\d+(\.\d{1,2})?$/.test(value),
        message: 'السعر يجب أن يكون رقماً صحيحاً أو عشري بحد أقصى رقمين',
        severity: 'error'
      }
    ];

    // Location validation
    this.validationRules.location = [
      {
        test: (value) => value.length >= 2,
        message: 'الموقع قصير جداً',
        severity: 'error'
      },
      {
        test: (value) => value.length <= 50,
        message: 'الموقع طويل جداً',
        severity: 'warning'
      },
      {
        test: (value) => /^[\u0600-\u06FF\s\w\d\-_]+$/.test(value),
        message: 'الموقع يحتوي على رموز غير مسموحة',
        severity: 'error'
      }
    ];

    // Phone validation
    this.validationRules.contact_phone = [
      {
        test: (value) => value === '' || /^(\+213|213)?[0-9]{9}$/.test(value.replace(/\s/g, '')),
        message: 'رقم الهاتف غير صحيح',
        severity: 'error'
      },
      {
        test: (value) => value === '' || value.length <= 15,
        message: 'رقم الهاتف طويل جداً',
        severity: 'warning'
      }
    ];

    // Description validation
    this.validationRules.description = [
      {
        test: (value) => value === '' || value.length >= 10,
        message: 'الوصف قصير جداً (يجب أن يكون 10 أحرف على الأقل)',
        severity: 'warning'
      },
      {
        test: (value) => value === '' || value.length <= 1000,
        message: 'الوصف طويل جداً',
        severity: 'warning'
      }
    ];

    // Email validation
    this.validationRules.email = [
      {
        test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: 'البريد الإلكتروني غير صحيح',
        severity: 'error'
      },
      {
        test: (value) => value.length <= 100,
        message: 'البريد الإلكتروني طويل جداً',
        severity: 'warning'
      }
    ];

    // Password validation
    this.validationRules.password = [
      {
        test: (value) => value.length >= 8,
        message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل',
        severity: 'error'
      },
      {
        test: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value),
        message: 'كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم',
        severity: 'warning'
      },
      {
        test: (value) => value.length <= 128,
        message: 'كلمة المرور طويلة جداً',
        severity: 'warning'
      }
    ];
  }

  /**
   * Validate a single field
   */
  validateField(fieldName: string, value: any): ValidationResult {
    const rules = this.validationRules[fieldName];
    if (!rules) {
      return { isValid: true, message: '', severity: 'info' };
    }

    for (const rule of rules) {
      if (!rule.test(value)) {
        return {
          isValid: false,
          message: rule.message,
          severity: rule.severity,
          suggestions: this.getSuggestions(fieldName, value)
        };
      }
    }

    return { isValid: true, message: '', severity: 'info' };
  }

  /**
   * Validate multiple fields
   */
  validateFields(fields: { [key: string]: any }): { [key: string]: ValidationResult } {
    const results: { [key: string]: ValidationResult } = {};
    
    for (const [fieldName, value] of Object.entries(fields)) {
      results[fieldName] = this.validateField(fieldName, value);
    }
    
    return results;
  }

  /**
   * Get suggestions for a field
   */
  private getSuggestions(fieldName: string, value: any): string[] {
    const suggestions: { [key: string]: string[] } = {
      title: [
        'استخدم كلمات واضحة ووصفية',
        'تجنب الرموز الخاصة',
        'أضف تفاصيل مهمة مثل الماركة والموديل'
      ],
      price: [
        'أدخل السعر بالدينار الجزائري',
        'استخدم أرقام فقط (مثال: 500000)',
        'يمكنك إضافة كسور عشرية (مثال: 500000.50)'
      ],
      location: [
        'أدخل المدينة أو الولاية',
        'يمكنك إضافة تفاصيل أكثر (مثال: الجزائر العاصمة)',
        'تجنب الرموز الخاصة'
      ],
      contact_phone: [
        'أدخل رقم الهاتف بالصيغة: +213 555 123 456',
        'أو: 0555 123 456',
        'أو: 213 555 123 456'
      ],
      description: [
        'صف حالة المعدة بالتفصيل',
        'اذكر المميزات والمواصفات',
        'أضف معلومات عن الصيانة والتاريخ'
      ],
      email: [
        'أدخل بريد إلكتروني صحيح (مثال: user@example.com)',
        'تأكد من وجود @ و . في البريد الإلكتروني'
      ],
      password: [
        'استخدم 8 أحرف على الأقل',
        'أضف حرف كبير وحرف صغير ورقم',
        'يمكنك إضافة رموز خاصة (!@#$%^&*)'
      ]
    };

    return suggestions[fieldName] || [];
  }

  /**
   * Debounced validation for real-time feedback
   */
  validateFieldDebounced(
    fieldName: string,
    value: any,
    callback: (result: ValidationResult) => void,
    delay: number = 500
  ): void {
    // Clear existing timer
    if (this.debounceTimers.has(fieldName)) {
      clearTimeout(this.debounceTimers.get(fieldName)!);
    }

    // Set new timer
    const timerId = setTimeout(() => {
      const result = this.validateField(fieldName, value);
      callback(result);
      this.debounceTimers.delete(fieldName);
    }, delay);

    this.debounceTimers.set(fieldName, timerId);
  }

  /**
   * Get validation status for form submission
   */
  isFormValid(fields: { [key: string]: any }): { isValid: boolean; errors: string[] } {
    const results = this.validateFields(fields);
    const errors: string[] = [];

    for (const [fieldName, result] of Object.entries(results)) {
      if (!result.isValid && result.severity === 'error') {
        errors.push(`${fieldName}: ${result.message}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get field-specific validation rules
   */
  getFieldRules(fieldName: string): ValidationRule[] {
    return this.validationRules[fieldName] || [];
  }

  /**
   * Add custom validation rule
   */
  addValidationRule(fieldName: string, rule: ValidationRule): void {
    if (!this.validationRules[fieldName]) {
      this.validationRules[fieldName] = [];
    }
    this.validationRules[fieldName].push(rule);
  }

  /**
   * Clear validation timers
   */
  clearTimers(): void {
    for (const timer of this.debounceTimers.values()) {
      clearTimeout(timer);
    }
    this.debounceTimers.clear();
  }

  /**
   * Get validation statistics
   */
  getValidationStats(fields: { [key: string]: any }): {
    total: number;
    valid: number;
    errors: number;
    warnings: number;
  } {
    const results = this.validateFields(fields);
    let valid = 0;
    let errors = 0;
    let warnings = 0;

    for (const result of Object.values(results)) {
      if (result.isValid) {
        valid++;
      } else if (result.severity === 'error') {
        errors++;
      } else if (result.severity === 'warning') {
        warnings++;
      }
    }

    return {
      total: Object.keys(results).length,
      valid,
      errors,
      warnings
    };
  }
}

// Create singleton instance
const realTimeValidator = new RealTimeValidator();

export default realTimeValidator;
export type { ValidationResult, ValidationRule }; 