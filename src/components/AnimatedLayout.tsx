'use client';

import { ReactNode, useEffect, useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function AnimatedLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isHydrated, setIsHydrated] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  
  // Wait for hydration to avoid layout shift and check motion preferences
  useEffect(() => {
    setIsHydrated(true);
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    // Listen for changes to the prefers-reduced-motion media query
    const handleMediaChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    
    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  // Optimized variants with reduced motion support - memoized
  const variants = useMemo(() => reducedMotion ? {
    // Simple fade for reduced motion
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.15 } 
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.15 }
    }
  } : {
    // Simplified animations for better performance
    hidden: { 
      opacity: 0,
    },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.15,
        ease: 'easeOut'
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: 0.1,
        ease: 'easeIn'
      }
    }
  }, [reducedMotion]);
  
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
      >
        {/* Main content with optimized rendering */}
        {children}
      </motion.div>
    </AnimatePresence>
  );
}