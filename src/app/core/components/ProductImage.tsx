import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package } from 'lucide-react';

interface ProductImageProps {
  src?: string;
  alt: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

/**
 * Optimised Product Image Component
 * Handles lazy loading, aspect ratio, and error states gracefully.
 */
export const ProductImage: React.FC<ProductImageProps> = ({ 
  src, 
  alt, 
  className = "", 
  size = 'md' 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    full: 'w-full h-full'
  };

  return (
    <div className={`relative overflow-hidden bg-[#F7F7F8] rounded-[14px] border border-[#ECEDEF] flex items-center justify-center shrink-0 ${sizeClasses[size]} ${className}`}>
      <AnimatePresence>
        {!isLoaded && !hasError && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%] animate-shimmer"
          />
        )}
      </AnimatePresence>

      {src && !hasError ? (
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.95 }}
          className="w-full h-full object-cover"
        />
      ) : (
        <Package size={24} className="text-[#8B93A7] opacity-40" />
      )}
    </div>
  );
};
