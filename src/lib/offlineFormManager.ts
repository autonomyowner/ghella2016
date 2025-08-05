'use client';

interface FormData {
  [key: string]: any;
}

interface SavedForm {
  id: string;
  formType: string;
  data: FormData;
  timestamp: number;
  lastModified: number;
}

class OfflineFormManager {
  private readonly STORAGE_KEY = 'elghella_offline_forms';
  private readonly MAX_SAVED_FORMS = 10;

  /**
   * Save form data to localStorage
   */
  saveForm(formType: string, formId: string, data: FormData): void {
    try {
      const savedForms = this.getSavedForms();
      
      // Create or update form
      const form: SavedForm = {
        id: formId,
        formType,
        data,
        timestamp: Date.now(),
        lastModified: Date.now()
      };

      // Remove existing form with same ID if exists
      const existingIndex = savedForms.findIndex(f => f.id === formId);
      if (existingIndex !== -1) {
        savedForms.splice(existingIndex, 1);
      }

      // Add new form at the beginning
      savedForms.unshift(form);

      // Keep only the most recent forms
      if (savedForms.length > this.MAX_SAVED_FORMS) {
        savedForms.splice(this.MAX_SAVED_FORMS);
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(savedForms));
      
      console.log(`Form saved offline: ${formType} - ${formId}`);
    } catch (error) {
      console.error('Failed to save form offline:', error);
    }
  }

  /**
   * Load form data from localStorage
   */
  loadForm(formId: string): SavedForm | null {
    try {
      const savedForms = this.getSavedForms();
      const form = savedForms.find(f => f.id === formId);
      
      if (form) {
        console.log(`Form loaded from offline storage: ${form.formType} - ${formId}`);
        return form;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to load form from offline storage:', error);
      return null;
    }
  }

  /**
   * Get all saved forms
   */
  getSavedForms(): SavedForm[] {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to get saved forms:', error);
      return [];
    }
  }

  /**
   * Get forms by type
   */
  getFormsByType(formType: string): SavedForm[] {
    return this.getSavedForms().filter(form => form.formType === formType);
  }

  /**
   * Delete a specific form
   */
  deleteForm(formId: string): boolean {
    try {
      const savedForms = this.getSavedForms();
      const filteredForms = savedForms.filter(f => f.id !== formId);
      
      if (filteredForms.length !== savedForms.length) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredForms));
        console.log(`Form deleted from offline storage: ${formId}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to delete form:', error);
      return false;
    }
  }

  /**
   * Clear all saved forms
   */
  clearAllForms(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('All offline forms cleared');
    } catch (error) {
      console.error('Failed to clear offline forms:', error);
    }
  }

  /**
   * Update form data
   */
  updateForm(formId: string, data: Partial<FormData>): boolean {
    try {
      const savedForms = this.getSavedForms();
      const formIndex = savedForms.findIndex(f => f.id === formId);
      
      if (formIndex !== -1) {
        savedForms[formIndex] = {
          ...savedForms[formIndex],
          data: { ...savedForms[formIndex].data, ...data },
          lastModified: Date.now()
        };
        
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(savedForms));
        console.log(`Form updated in offline storage: ${formId}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to update form:', error);
      return false;
    }
  }

  /**
   * Check if form exists
   */
  formExists(formId: string): boolean {
    return this.getSavedForms().some(f => f.id === formId);
  }

  /**
   * Get form age in minutes
   */
  getFormAge(formId: string): number {
    const form = this.loadForm(formId);
    if (!form) return -1;
    
    return Math.floor((Date.now() - form.timestamp) / (1000 * 60));
  }

  /**
   * Auto-save form data with debouncing
   */
  autoSaveForm(
    formType: string, 
    formId: string, 
    data: FormData, 
    debounceMs: number = 1000
  ): void {
    // Clear existing timeout
    if (this.autoSaveTimeouts.has(formId)) {
      clearTimeout(this.autoSaveTimeouts.get(formId)!);
    }

    // Set new timeout
    const timeoutId = setTimeout(() => {
      this.saveForm(formType, formId, data);
      this.autoSaveTimeouts.delete(formId);
    }, debounceMs);

    this.autoSaveTimeouts.set(formId, timeoutId);
  }

  /**
   * Generate unique form ID
   */
  generateFormId(): string {
    return `form_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get storage usage info
   */
  getStorageInfo(): { totalForms: number; totalSize: number; maxSize: number } {
    const savedForms = this.getSavedForms();
    const totalSize = new Blob([JSON.stringify(savedForms)]).size;
    const maxSize = 5 * 1024 * 1024; // 5MB limit
    
    return {
      totalForms: savedForms.length,
      totalSize,
      maxSize
    };
  }

  /**
   * Check if storage is getting full
   */
  isStorageFull(): boolean {
    const { totalSize, maxSize } = this.getStorageInfo();
    return totalSize > maxSize * 0.8; // 80% full
  }

  private autoSaveTimeouts = new Map<string, NodeJS.Timeout>();
}

// Create singleton instance
const offlineFormManager = new OfflineFormManager();

export default offlineFormManager;
export type { FormData, SavedForm }; 