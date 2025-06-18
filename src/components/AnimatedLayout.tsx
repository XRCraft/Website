'use client';

import { ReactNode, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

// Check if the user prefers reduced motion
const prefersReducedMotion = typeof window !== 'undefined' 
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
  : false;

export default function AnimatedLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isHydrated, setIsHydrated] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);
  
  // Wait for hydration to avoid layout shift and check motion preferences
  useEffect(() => {
    setIsHydrated(true);
    
    // Listen for changes to the prefers-reduced-motion media query
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMediaChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    
    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  // Optimized variants with reduced motion support
  const variants = reducedMotion ? {
    // Simple fade for reduced motion
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.2 } 
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  } : {
    // Full animations for normal motion
    hidden: { 
      opacity: 0, 
      y: 20,
      filter: 'blur(4px)', // Reduced blur for better performance
      scale: 0.98,
      willChange: 'opacity, transform'
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: 'blur(0px)',
      scale: 1,
      willChange: 'opacity, transform',
      transition: { 
        duration: 0.3, // Slightly faster
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: { 
      opacity: 0, 
      y: -10, // Reduced movement
      willChange: 'opacity, transform',
      transition: {
        duration: 0.25,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
  
  // If not hydrated yet, render children without animation to prevent layout shift
  if (!isHydrated) {
    return <>{children}</>;
  }
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={variants}
        className="relative"
      >        {/* Optional page transition overlay - only show if animations are enabled */}
        {!reducedMotion && (
          <motion.div
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
            exit={{ scaleY: 1, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
            style={{ originY: 0 }}
            className="fixed inset-0 bg-mcbrown z-50 pointer-events-none"
          />
        )}
        
        {/* Main content with optimized rendering */}
        <motion.div
          variants={variants}
          className="relative overflow-hidden"
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}