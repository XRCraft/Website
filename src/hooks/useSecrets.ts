'use client';

import { useState, useEffect } from 'react';

const SECRET_SEQUENCE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
const TETRIS_SEQUENCE = ['KeyT', 'KeyE', 'KeyT', 'KeyR', 'KeyI', 'KeyS'];

export function useKonamiCode(callback: () => void) {
  const [sequence, setSequence] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const newSequence = [...sequence, event.code].slice(-SECRET_SEQUENCE.length);
      setSequence(newSequence);

      if (newSequence.length === SECRET_SEQUENCE.length && 
          newSequence.every((key, index) => key === SECRET_SEQUENCE[index])) {
        callback();
        setSequence([]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sequence, callback]);

  return sequence;
}

export function useTetrisCode(callback: () => void) {
  const [sequence, setSequence] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger on letter keys, ignore if user is typing in an input field
      if (event.target && (event.target as HTMLElement).tagName === 'INPUT') return;
      
      const newSequence = [...sequence, event.code].slice(-TETRIS_SEQUENCE.length);
      setSequence(newSequence);

      if (newSequence.length === TETRIS_SEQUENCE.length && 
          newSequence.every((key, index) => key === TETRIS_SEQUENCE[index])) {
        callback();
        setSequence([]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sequence, callback]);

  return sequence;
}

// Alternative secret: Triple-click on logo
export function useTripleClick(callback: () => void) {
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  const handleClick = () => {
    const now = Date.now();
    
    if (now - lastClickTime < 500) {
      const newCount = clickCount + 1;
      setClickCount(newCount);
      
      if (newCount >= 3) {
        callback();
        setClickCount(0);
      }
    } else {
      setClickCount(1);
    }
    
    setLastClickTime(now);
  };

  return handleClick;
}