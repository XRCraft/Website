'use client';

import { ReactNode, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function AnimatedLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Wait for hydration to avoid layout shift
  useEffect(() => {
    setIsHydrated(true);
  }, []);
    // Fancy minecraft-themed page transition variants
  const variants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      filter: 'blur(8px)',
      scale: 0.95,
      willChange: 'opacity, transform, filter'
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: 'blur(0px)',
      scale: 1,
      willChange: 'opacity, transform, filter',
      transition: { 
        duration: 0.4, 
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.08
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      filter: 'blur(8px)',
      willChange: 'opacity, transform, filter',
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
      >
        {/* Optional page transition overlay */}
        <motion.div
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
          exit={{ scaleY: 1, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
          style={{ originY: 0 }}
          className="fixed inset-0 bg-mcbrown z-50 pointer-events-none"
        />
        
        {/* Pixelated border effect */}
        <motion.div
          variants={variants}
          className="relative overflow-hidden"
        >
          <div className="absolute left-0 top-0 w-full h-full border-4 border-transparent rounded-lg pointer-events-none opacity-0"></div>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}