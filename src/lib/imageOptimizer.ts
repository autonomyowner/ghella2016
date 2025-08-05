'use client';

interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  maxFileSize?: number; // in bytes
}

interface OptimizedImage {
  file: File;
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
  dataUrl: string;
}

class ImageOptimizer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  /**
   * Optimize a single image file
   */
  async optimizeImage(
    file: File, 
    options: ImageOptimizationOptions = {}
  ): Promise<OptimizedImage> {
    const {
      maxWidth = 1200,
      maxHeight = 1200,
      quality = 0.8,
      format = 'webp',
      maxFileSize = 5 * 1024 * 1024 // 5MB
    } = options;

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          // Calculate new dimensions while maintaining aspect ratio
          const { width, height } = this.calculateDimensions(
            img.width,
            img.height,
            maxWidth,
            maxHeight
          );

          // Set canvas dimensions
          this.canvas.width = width;
          this.canvas.height = height;

          // Clear canvas and draw resized image
          this.ctx.clearRect(0, 0, width, height);
          this.ctx.drawImage(img, 0, 0, width, height);

          // Convert to blob with specified format and quality
          this.canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to create blob'));
                return;
              }

              // Create optimized file
              const optimizedFile = new File([blob], file.name, {
                type: `image/${format}`,
                lastModified: Date.now()
              });

              // Convert to data URL for preview
              const reader = new FileReader();
              reader.onload = () => {
                const result = reader.result as string;
                
                resolve({
                  file: optimizedFile,
                  originalSize: file.size,
                  optimizedSize: optimizedFile.size,
                  compressionRatio: (file.size - optimizedFile.size) / file.size,
                  dataUrl: result
                });
              };
              reader.readAsDataURL(optimizedFile);
            },
            `image/${format}`,
            quality
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Optimize multiple images
   */
  async optimizeImages(
    files: FileList | File[],
    options: ImageOptimizationOptions = {}
  ): Promise<OptimizedImage[]> {
    const fileArray = Array.from(files);
    const results: OptimizedImage[] = [];

    for (const file of fileArray) {
      try {
        const optimized = await this.optimizeImage(file, options);
        results.push(optimized);
      } catch (error) {
        console.error(`Failed to optimize ${file.name}:`, error);
        // Fallback to original file
        const reader = new FileReader();
        reader.onload = () => {
          results.push({
            file,
            originalSize: file.size,
            optimizedSize: file.size,
            compressionRatio: 0,
            dataUrl: reader.result as string
          });
        };
        reader.readAsDataURL(file);
      }
    }

    return results;
  }

  /**
   * Calculate optimal dimensions while maintaining aspect ratio
   */
  private calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ): { width: number; height: number } {
    let { width, height } = { width: originalWidth, height: originalHeight };

    // Calculate aspect ratio
    const aspectRatio = width / height;

    // Resize if image is too large
    if (width > maxWidth || height > maxHeight) {
      if (width / maxWidth > height / maxHeight) {
        width = maxWidth;
        height = width / aspectRatio;
      } else {
        height = maxHeight;
        width = height * aspectRatio;
      }
    }

    return { width: Math.round(width), height: Math.round(height) };
  }

  /**
   * Get file size in human readable format
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Validate image file
   */
  static validateImage(file: File): { isValid: boolean; error?: string } {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return { isValid: false, error: 'الملف ليس صورة صالحة' };
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return { isValid: false, error: 'حجم الصورة كبير جداً (الحد الأقصى 5 ميجابايت)' };
    }

    return { isValid: true };
  }
}

// Create singleton instance
const imageOptimizer = new ImageOptimizer();

export default imageOptimizer;
export type { ImageOptimizationOptions, OptimizedImage }; 