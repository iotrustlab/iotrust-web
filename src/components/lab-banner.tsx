'use client';

import Image from 'next/image';
import { useState } from 'react';

interface LabBannerProps {
  image: string;
  alt: string;
  showOnMobile: boolean;
  height: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
  fullWidth?: boolean;
}

export function LabBanner({ image, alt, showOnMobile, height, fullWidth = false }: LabBannerProps) {
  const [imageError, setImageError] = useState(false);

  const containerClasses = `
    relative
    ${height.mobile}
    sm:${height.tablet}
    md:${height.desktop}
    mb-6 sm:mb-8
    ${fullWidth ? '' : 'rounded-lg'}
    overflow-hidden
    bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900
    ${!showOnMobile ? 'hidden sm:block' : ''}
  `.trim();

  return (
    <div className={containerClasses}>
      {!imageError && (
        <Image
          src={image}
          alt={alt}
          fill
          priority
          className="object-cover"
          sizes={fullWidth ? 
            "(max-width: 640px) 100vw, 100vw" : 
            "(max-width: 640px) 100vw, (max-width: 768px) 100vw, 800px"
          }
          onError={() => setImageError(true)}
        />
      )}
      {/* Fallback content shown when image errors or is loading */}
      <div className={`absolute inset-0 flex items-center justify-center opacity-30 dark:opacity-20 ${!imageError ? 'hidden' : ''}`}>
        <svg className="w-24 h-24 sm:w-32 sm:h-32 text-blue-800 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      </div>
    </div>
  );
} 