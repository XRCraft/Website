'use client';

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useKonamiCode } from '@/hooks/useSecrets';

const SpaceInvaders = dynamic(() => import('./SpaceInvaders'), { ssr: false });

export default function SecretGameWrapper() {
  const [showGame, setShowGame] = useState(false);

  const activateGame = useCallback(() => {
    setShowGame(true);
    // Play a secret sound effect if possible
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcaAy+H0fPTgC8M');
      audio.volume = 0.1;
      audio.play().catch(() => {}); // Ignore if audio fails
    } catch {
      // Ignore audio errors
    }
  }, []);

  const hideGame = useCallback(() => {
    setShowGame(false);
  }, []);

  // Activate with Konami code
  useKonamiCode(activateGame);

  // Listen for triple-click activation
  React.useEffect(() => {
    const handleSecretActivation = () => {
      activateGame();
    };

    window.addEventListener('activateSecretGame', handleSecretActivation);
    return () => window.removeEventListener('activateSecretGame', handleSecretActivation);
  }, [activateGame]);

  // Handle ESC key to close game
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showGame) {
        hideGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showGame, hideGame]);

  if (!showGame) {
    return null;
  }

  return <SpaceInvaders />;
}