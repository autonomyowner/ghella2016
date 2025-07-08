import React, { useState } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
  /** Array of image URLs to display */
  images: string[];
  /** Optional alt text for all images */
  alt?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, alt = 'Gallery image' }) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <div className="card-responsive text-center">
        <p className="text-responsive-base text-gray-500">لا توجد صور للعرض.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid-responsive">
        {images.map((src, idx) => (
          <div 
            key={idx} 
            className="group relative w-full aspect-square overflow-hidden shadow-2xl hover-scale cursor-pointer touch-friendly"
            onClick={() => setSelectedImage(idx)}
            style={{ borderRadius: 'inherit' }}
          >
            <Image
              src={src}
              alt={`${alt} ${idx + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="img-responsive-square transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 left-0 right-0 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
              <div className="spacing-responsive-sm">
                <h3 className="text-responsive-lg font-bold">معدات زراعية متطورة</h3>
                <p className="text-responsive-sm opacity-90">اكتشف أحدث المعدات المتاحة</p>
              </div>
            </div>
            
            {/* Image number indicator */}
            <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
              {idx + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full">
            <Image
              src={images[selectedImage]}
              alt={`${alt} ${selectedImage + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
            />
            
            {/* Close button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors touch-friendly"
            >
              ✕
            </button>
            
            {/* Navigation buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(selectedImage > 0 ? selectedImage - 1 : images.length - 1);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors touch-friendly"
                >
                  ◀
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(selectedImage < images.length - 1 ? selectedImage + 1 : 0);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors touch-friendly"
                >
                  ▶
                </button>
              </>
            )}
            
            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
              {selectedImage + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;

/*
Usage example:

import ImageGallery from '@/components/ImageGallery';

const sampleImages = [
  '/images/pic1.jpg',
  '/images/pic2.jpg',
  '/images/pic3.jpg',
];

<ImageGallery images={sampleImages} alt="حقل زراعي" />
*/
