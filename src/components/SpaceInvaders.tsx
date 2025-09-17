'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface Position {
  x: number;
  y: number;
}

interface Enemy extends Position {
  id: number;
  destroyed: boolean;
}

interface Bullet extends Position {
  id: number;
  direction: 'up' | 'down';
}

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PLAYER_SPEED = 5;
const BULLET_SPEED = 7;
const ENEMY_SPEED = 1;

export default function SpaceInvaders() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [player, setPlayer] = useState<Position>({ x: GAME_WIDTH / 2, y: GAME_HEIGHT - 50 });
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [enemyBullets, setEnemyBullets] = useState<Bullet[]>([]);
  const [keys, setKeys] = useState<Set<string>>(new Set());
  
  const gameLoopRef = useRef<number | undefined>(undefined);
  const lastShotRef = useRef(0);
  const bulletIdRef = useRef(0);

  // Initialize enemies
  const initializeEnemies = useCallback(() => {
    const newEnemies: Enemy[] = [];
    let id = 0;
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 10; col++) {
        newEnemies.push({
          id: id++,
          x: col * 60 + 100,
          y: row * 50 + 50,
          destroyed: false
        });
      }
    }
    setEnemies(newEnemies);
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => new Set([...prev, e.key]));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => {
        const newKeys = new Set(prev);
        newKeys.delete(e.key);
        return newKeys;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = () => {
      const now = Date.now();
      
      // Update player position
      setPlayer(prev => {
        let newX = prev.x;
        if (keys.has('ArrowLeft') || keys.has('a')) {
          newX = Math.max(0, prev.x - PLAYER_SPEED);
        }
        if (keys.has('ArrowRight') || keys.has('d')) {
          newX = Math.min(GAME_WIDTH - 30, prev.x + PLAYER_SPEED);
        }
        return { ...prev, x: newX };
      });

      // Shoot bullets
      if ((keys.has(' ') || keys.has('ArrowUp')) && now - lastShotRef.current > 250) {
        setBullets(prev => [...prev, {
          id: bulletIdRef.current++,
          x: player.x + 15,
          y: player.y,
          direction: 'up'
        }]);
        lastShotRef.current = now;
      }

      // Update bullets
      setBullets(prev => prev
        .map(bullet => ({ ...bullet, y: bullet.y - BULLET_SPEED }))
        .filter(bullet => bullet.y > 0)
      );

      // Update enemy bullets
      setEnemyBullets(prev => prev
        .map(bullet => ({ ...bullet, y: bullet.y + BULLET_SPEED }))
        .filter(bullet => bullet.y < GAME_HEIGHT)
      );

      // Move enemies
      setEnemies(prev => prev.map(enemy => ({
        ...enemy,
        y: enemy.y + ENEMY_SPEED * 0.1
      })));

      // Enemy shooting (random)
      if (Math.random() < 0.01) {
        const aliveEnemies = enemies.filter(e => !e.destroyed);
        if (aliveEnemies.length > 0) {
          const randomEnemy = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
          setEnemyBullets(prev => [...prev, {
            id: bulletIdRef.current++,
            x: randomEnemy.x + 15,
            y: randomEnemy.y + 30,
            direction: 'down'
          }]);
        }
      }

      // Collision detection - bullets vs enemies
      setBullets(prevBullets => {
        const remainingBullets = prevBullets.filter(bullet => {
          const hitEnemy = enemies.find(enemy => 
            !enemy.destroyed &&
            bullet.x > enemy.x && bullet.x < enemy.x + 30 &&
            bullet.y > enemy.y && bullet.y < enemy.y + 30
          );
          
          if (hitEnemy) {
            setEnemies(prev => prev.map(e => 
              e.id === hitEnemy.id ? { ...e, destroyed: true } : e
            ));
            setScore(prev => prev + 10);
            return false;
          }
          return true;
        });
        return remainingBullets;
      });

      // Collision detection - enemy bullets vs player
      setEnemyBullets(prevBullets => {
        const hitPlayer = prevBullets.some(bullet =>
          bullet.x > player.x && bullet.x < player.x + 30 &&
          bullet.y > player.y && bullet.y < player.y + 30
        );
        
        if (hitPlayer) {
          setGameOver(true);
        }
        
        return prevBullets.filter(bullet =>
          !(bullet.x > player.x && bullet.x < player.x + 30 &&
            bullet.y > player.y && bullet.y < player.y + 30)
        );
      });

      // Check win condition
      if (enemies.every(e => e.destroyed)) {
        setGameOver(true);
      }

      // Check lose condition (enemies too low)
      if (enemies.some(e => !e.destroyed && e.y > GAME_HEIGHT - 100)) {
        setGameOver(true);
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameStarted, gameOver, keys, player, enemies]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setPlayer({ x: GAME_WIDTH / 2, y: GAME_HEIGHT - 50 });
    setBullets([]);
    setEnemyBullets([]);
    initializeEnemies();
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="relative">
        <div 
          className="relative bg-black border-2 border-green-400 overflow-hidden"
          style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        >
          {/* Stars background */}
          <div className="absolute inset-0">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute bg-white rounded-full"
                style={{
                  width: Math.random() * 2 + 1,
                  height: Math.random() * 2 + 1,
                  left: Math.random() * GAME_WIDTH,
                  top: Math.random() * GAME_HEIGHT,
                  opacity: Math.random() * 0.8 + 0.2
                }}
              />
            ))}
          </div>

          {!gameStarted ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-green-400 font-mono">
              <h1 className="text-4xl mb-4 pixel-font">SPACE INVADERS</h1>
              <p className="text-lg mb-2">XRCraft Edition</p>
              <p className="text-sm mb-4">Use ARROW KEYS or WASD to move</p>
              <p className="text-sm mb-8">SPACE or UP ARROW to shoot</p>
              <button 
                onClick={startGame}
                className="px-6 py-3 border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-colors pixel-font"
              >
                START GAME
              </button>
            </div>
          ) : (
            <>
              {/* Player */}
              <div
                className="absolute bg-green-400"
                style={{
                  left: player.x,
                  top: player.y,
                  width: 30,
                  height: 20,
                  clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
                }}
              />

              {/* Enemies */}
              {enemies.filter(e => !e.destroyed).map(enemy => (
                <div
                  key={enemy.id}
                  className="absolute bg-red-400"
                  style={{
                    left: enemy.x,
                    top: enemy.y,
                    width: 30,
                    height: 20,
                    clipPath: 'polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)'
                  }}
                />
              ))}

              {/* Player bullets */}
              {bullets.map(bullet => (
                <div
                  key={bullet.id}
                  className="absolute bg-yellow-400 w-1 h-3"
                  style={{ left: bullet.x, top: bullet.y }}
                />
              ))}

              {/* Enemy bullets */}
              {enemyBullets.map(bullet => (
                <div
                  key={bullet.id}
                  className="absolute bg-red-400 w-1 h-3"
                  style={{ left: bullet.x, top: bullet.y }}
                />
              ))}

              {/* UI */}
              <div className="absolute top-4 left-4 text-green-400 font-mono">
                Score: {score}
              </div>

              {gameOver && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 text-green-400 font-mono">
                  <h2 className="text-3xl mb-4 pixel-font">
                    {enemies.every(e => e.destroyed) ? 'YOU WIN!' : 'GAME OVER'}
                  </h2>
                  <p className="text-xl mb-4">Final Score: {score}</p>
                  <div className="space-x-4">
                    <button 
                      onClick={startGame}
                      className="px-4 py-2 border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-colors"
                    >
                      PLAY AGAIN
                    </button>
                    <button 
                      onClick={resetGame}
                      className="px-4 py-2 border-2 border-red-400 text-red-400 hover:bg-red-400 hover:text-black transition-colors"
                    >
                      EXIT
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="absolute -bottom-8 left-0 right-0 text-center text-green-400 text-sm font-mono">
          Press ESC to exit
        </div>
      </div>
    </div>
  );
}