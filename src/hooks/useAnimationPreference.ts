'use client';

import { useState, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Custom hook to detect if user prefers reduced motion
 * and conditionally apply animations
 */
export function useAnimationPreference() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Check if user prefers reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    setIsHydrated(true);

    // Add listener for future changes
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Generate animation classes based on preferences
  const animationClasses = useMemo(() => {
    if (!isHydrated) return ''; // No animations before hydration to prevent layout shifts
    if (prefersReducedMotion) return 'motion-reduce'; // CSS class to reduce animations
    return 'motion-safe'; // CSS class for full animations
  }, [isHydrated, prefersReducedMotion]);

  return {
    prefersReducedMotion,
    isHydrated,
    animationClasses
  };
}

/**
 * Hook to fade in content as user scrolls down the page
 */
export function useScrollFadeIn() {
  const [elements, setElements] = useState<Element[]>([]);
  const { prefersReducedMotion } = useAnimationPreference();

  // Skip animations if user prefers reduced motion
  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Get all fade-in elements
    const fadeElements = document.querySelectorAll('.fade-in-element');
    fadeElements.forEach(el => {
      observer.observe(el);
      setElements(prev => [...prev, el]);
    });

    return () => {
      if (elements.length) {
        elements.forEach(el => observer.unobserve(el));
      }
    };
  }, [prefersReducedMotion]);
}

/**
 * Hook to track the current page for optimized navigations
 */
export function usePageTracking() {
  const pathname = usePathname();
  
  useEffect(() => {
    // Scroll to top on page change for better user experience
    window.scrollTo(0, 0);
    
    // Preload critical assets for the current page
    // You can add specific logic based on pathname
  }, [pathname]);
  
  return pathname;
}
