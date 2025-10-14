'use client';

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useKonamiCode, useTetrisCode } from '@/hooks/useSecrets';

const SpaceInvaders = dynamic(() => import('./SpaceInvaders'), { ssr: false });
const Tetris = dynamic(() => import('./Tetris'), { ssr: false });

type GameType = 'space-invaders' | 'tetris' | null;

export default function SecretGameWrapper() {
  const [activeGame, setActiveGame] = useState<GameType>(null);

  const activateSpaceInvaders = useCallback(() => {
    setActiveGame('space-invaders');
    // Play a secret sound effect if possible
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcaAy+H0fPTgC8M');
      audio.volume = 0.1;
      audio.play().catch(() => {}); // Ignore if audio fails
    } catch {
      // Ignore audio errors
    }
  }, []);

  const activateTetris = useCallback(() => {
    setActiveGame('tetris');
    // Play a different sound for Tetris
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcaAy+H0fPTgC8M');
      audio.volume = 0.15;
      audio.play().catch(() => {}); // Ignore if audio fails
    } catch {
      // Ignore audio errors
    }
  }, []);

  const hideGame = useCallback(() => {
    setActiveGame(null);
  }, []);

  // Activate Space Invaders with Konami code
  useKonamiCode(activateSpaceInvaders);
  
  // Activate Tetris by typing "TETRIS"
  useTetrisCode(activateTetris);

  // Listen for triple-click activation for Space Invaders
  React.useEffect(() => {
    const handleSecretActivation = () => {
      activateSpaceInvaders();
    };

    window.addEventListener('activateSecretGame', handleSecretActivation);
    return () => window.removeEventListener('activateSecretGame', handleSecretActivation);
  }, [activateSpaceInvaders]);

  // Handle ESC key to close any active game
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeGame) {
        hideGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeGame, hideGame]);

  if (activeGame === 'space-invaders') {
    return <SpaceInvaders />;
  }
  
  if (activeGame === 'tetris') {
    return <Tetris />;
  }

  return null;
}