'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';

interface Position {
  x: number;
  y: number;
}

interface Enemy extends Position {
  id: number;
  destroyed: boolean;
  type?: 'normal' | 'ufo';
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
const ENEMY_DROP_DISTANCE = 40;

export default function SpaceInvaders() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [wave, setWave] = useState(1);
  const [player, setPlayer] = useState<Position>({ x: GAME_WIDTH / 2, y: GAME_HEIGHT - 50 });
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [enemyBullets, setEnemyBullets] = useState<Bullet[]>([]);
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [enemyDirection, setEnemyDirection] = useState(1);
  const [barriers, setBarriers] = useState<Position[]>([]);
  const [ufo, setUfo] = useState<Enemy | null>(null);
  const [lastUfoTime, setLastUfoTime] = useState(0);
  
  const gameLoopRef = useRef<number | undefined>(undefined);
  const lastShotRef = useRef(0);
  const lastEnemyShotRef = useRef(0);
  const bulletIdRef = useRef(0);

  // Sound effects using Web Audio API
  const playSound = useCallback((frequency: number, duration: number, type: OscillatorType = 'square') => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)(); // eslint-disable-line @typescript-eslint/no-explicit-any
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch {
      // Silently handle audio context errors
    }
  }, []);

  const sounds = useMemo(() => ({
    shoot: () => playSound(800, 0.1),
    enemyHit: () => playSound(300, 0.2, 'sawtooth'),
    playerHit: () => {
      playSound(150, 0.5, 'sawtooth');
      setTimeout(() => playSound(100, 0.5, 'sawtooth'), 200);
    },
    enemyShoot: () => playSound(200, 0.15),
    ufoHit: () => {
      playSound(400, 0.3);
      setTimeout(() => playSound(500, 0.2), 150);
      setTimeout(() => playSound(600, 0.3), 300);
    },
    ufoFly: () => playSound(150, 2.0, 'sine'), // Long continuous sound for UFO
    waveComplete: () => {
      playSound(400, 0.2);
      setTimeout(() => playSound(500, 0.2), 200);
      setTimeout(() => playSound(600, 0.3), 400);
    },
    gameOver: () => {
      playSound(200, 0.8, 'sawtooth');
      setTimeout(() => playSound(150, 0.8, 'sawtooth'), 300);
      setTimeout(() => playSound(100, 1.0, 'sawtooth'), 600);
    }
  }), [playSound]);

  // Initialize enemies for new wave
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
    setEnemyDirection(1);
  }, []);

  // Initialize barriers (destructible cover)
  const initializeBarriers = useCallback(() => {
    const newBarriers: Position[] = [];
    for (let i = 0; i < 4; i++) {
      const baseX = 100 + i * 150;
      const baseY = GAME_HEIGHT - 200;
      // Create barrier blocks in a rectangular pattern
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 8; col++) {
          newBarriers.push({
            x: baseX + col * 8,
            y: baseY + row * 8
          });
        }
      }
    }
    setBarriers(newBarriers);
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default behavior for game keys to stop page scrolling
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        e.stopPropagation();
      }
      setKeys(prev => new Set([...prev, e.key]));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Prevent default behavior for game keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        e.stopPropagation();
      }
      setKeys(prev => {
        const newKeys = new Set(prev);
        newKeys.delete(e.key);
        return newKeys;
      });
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp, { passive: false });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Game loop with enhanced mechanics
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

      // Handle shooting (limited to 3 bullets on screen)
      if ((keys.has(' ') || keys.has('ArrowUp') || keys.has('w')) && now - lastShotRef.current > 200) {
        setBullets(prev => {
          if (prev.length >= 3) return prev; // Limit to 3 bullets on screen
          const newBullets = [...prev, {
            id: bulletIdRef.current++,
            x: player.x + 15,
            y: player.y,
            direction: "up" as "up"
          }];
          sounds.shoot();
          lastShotRef.current = now;
          return newBullets;
        });
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

      // Enemy shooting logic
      if (now - lastEnemyShotRef.current > 1000) {
        setEnemies(prevEnemies => {
          const activeEnemies = prevEnemies.filter(e => !e.destroyed);
          if (activeEnemies.length > 0) {
            const randomEnemy = activeEnemies[Math.floor(Math.random() * activeEnemies.length)];
            setEnemyBullets(prev => [...prev, {
              id: bulletIdRef.current++,
              x: randomEnemy.x + 15,
              y: randomEnemy.y + 20,
              direction: 'down'
            }]);
            sounds.enemyShoot();
          }
          return prevEnemies;
        });
        lastEnemyShotRef.current = now;
      }

      // UFO logic - appears every 30 seconds
      if (!ufo && now - lastUfoTime > 30000) {
        setUfo({
          id: bulletIdRef.current++,
          x: -50,
          y: 30,
          destroyed: false,
          type: 'ufo'
        });
        setLastUfoTime(now);
        sounds.ufoFly();
      }

      // Move UFO
      if (ufo && !ufo.destroyed) {
        setUfo(prev => {
          if (!prev) return null;
          const newX = prev.x + 2;
          if (newX > GAME_WIDTH + 50) {
            return null; // UFO flew off screen
          }
          return { ...prev, x: newX };
        });
      }

      // Move enemies with authentic arcade movement pattern
      setEnemies(prev => {
        const activeEnemies = prev.filter(e => !e.destroyed);
        if (activeEnemies.length === 0) return prev;

        // Check if any enemy hit the edge
        const leftMost = Math.min(...activeEnemies.map(e => e.x));
        const rightMost = Math.max(...activeEnemies.map(e => e.x));
        
        let newDirection = enemyDirection;
        let shouldDrop = false;

        if (enemyDirection > 0 && rightMost >= GAME_WIDTH - 60) {
          newDirection = -1;
          shouldDrop = true;
        } else if (enemyDirection < 0 && leftMost <= 30) {
          newDirection = 1;
          shouldDrop = true;
        }

        if (newDirection !== enemyDirection) {
          setEnemyDirection(newDirection);
        }

        return prev.map(enemy => {
          if (enemy.destroyed) return enemy;
          
          const speed = ENEMY_SPEED + Math.floor(wave / 2); // Increase speed with waves
          
          if (shouldDrop) {
            return { ...enemy, y: enemy.y + ENEMY_DROP_DISTANCE };
          } else {
            return { ...enemy, x: enemy.x + (enemyDirection * speed) };
          }
        });
      });

      // Collision detection - consolidated approach
      setBullets(prevBullets => {
        let remainingBullets = [...prevBullets];
        
        // Check UFO collision
        if (ufo && !ufo.destroyed) {
          remainingBullets = remainingBullets.filter(bullet => {
            const hit = bullet.x >= ufo.x && bullet.x <= ufo.x + 40 &&
                       bullet.y >= ufo.y && bullet.y <= ufo.y + 20;
            if (hit) {
              sounds.ufoHit();
              setScore(s => s + 300);
              setUfo(prev => prev ? { ...prev, destroyed: true } : null);
              setTimeout(() => setUfo(null), 500);
              return false; // Remove bullet
            }
            return true;
          });
        }
        
        // Check enemy collisions
        setEnemies(prevEnemies => {
          return prevEnemies.map(enemy => {
            if (enemy.destroyed) return enemy;
            
            const hitBulletIndex = remainingBullets.findIndex(bullet =>
              bullet.x >= enemy.x && bullet.x <= enemy.x + 30 &&
              bullet.y >= enemy.y && bullet.y <= enemy.y + 20
            );
            
            if (hitBulletIndex !== -1) {
              remainingBullets.splice(hitBulletIndex, 1); // Remove the bullet
              sounds.enemyHit();
              setScore(s => s + (enemy.y < 150 ? 30 : enemy.y < 250 ? 20 : 10));
              return { ...enemy, destroyed: true };
            }
            
            return enemy;
          });
        });
        
        // Check barrier collisions
        setBarriers(prevBarriers => {
          return prevBarriers.filter(barrier => {
            const hitBulletIndex = remainingBullets.findIndex(bullet =>
              Math.abs(bullet.x - barrier.x) < 12 && Math.abs(bullet.y - barrier.y) < 12
            );
            
            if (hitBulletIndex !== -1) {
              remainingBullets.splice(hitBulletIndex, 1); // Remove the bullet
              return false; // Remove barrier block
            }
            
            return true;
          });
        });
        
        return remainingBullets;
      });

      // Enemy bullet collisions - consolidated approach
      setEnemyBullets(prevBullets => {
        let remainingBullets = [...prevBullets];
        
        // Check collision with player
        const playerHitIndex = remainingBullets.findIndex(bullet =>
          bullet.x >= player.x && bullet.x <= player.x + 30 &&
          bullet.y >= player.y && bullet.y <= player.y + 20
        );
        
        if (playerHitIndex !== -1) {
          remainingBullets.splice(playerHitIndex, 1); // Remove bullet
          sounds.playerHit();
          setLives(l => l - 1);
          setPlayer({ x: GAME_WIDTH / 2, y: GAME_HEIGHT - 50 });
          
          if (lives <= 1) {
            setGameOver(true);
            sounds.gameOver();
          }
        }
        
        // Check collision with barriers
        setBarriers(prevBarriers => {
          return prevBarriers.filter(barrier => {
            const hitBulletIndex = remainingBullets.findIndex(bullet =>
              Math.abs(bullet.x - barrier.x) < 12 && Math.abs(bullet.y - barrier.y) < 12
            );
            
            if (hitBulletIndex !== -1) {
              remainingBullets.splice(hitBulletIndex, 1); // Remove bullet
              return false; // Remove barrier block
            }
            
            return true;
          });
        });
        
        return remainingBullets;
      });

      // Check win condition
      setEnemies(prevEnemies => {
        const activeEnemies = prevEnemies.filter(e => !e.destroyed);
        if (activeEnemies.length === 0 && prevEnemies.length > 0) {
          // Wave complete!
          sounds.waveComplete();
          setTimeout(() => {
            setWave(w => w + 1);
            initializeEnemies();
            initializeBarriers();
          }, 1000);
        }
        return prevEnemies;
      });

      // Check lose condition - enemies reach bottom
      setEnemies(prevEnemies => {
        const anyEnemyAtBottom = prevEnemies.some(e => !e.destroyed && e.y >= GAME_HEIGHT - 100);
        if (anyEnemyAtBottom) {
          setGameOver(true);
          sounds.gameOver();
        }
        return prevEnemies;
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameStarted, gameOver, keys, player, enemies, enemyDirection, wave, lives, ufo, lastUfoTime, sounds, initializeEnemies, initializeBarriers]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLives(3);
    setWave(1);
    setPlayer({ x: GAME_WIDTH / 2, y: GAME_HEIGHT - 50 });
    setBullets([]);
    setEnemyBullets([]);
    setUfo(null);
    setLastUfoTime(0);
    initializeEnemies();
    initializeBarriers();
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

              {/* UFO */}
              {ufo && !ufo.destroyed && (
                <div
                  className="absolute bg-yellow-400"
                  style={{
                    left: ufo.x,
                    top: ufo.y,
                    width: 40,
                    height: 20,
                    clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
                    boxShadow: '0 0 10px #ffff00'
                  }}
                />
              )}

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

              {/* Barriers */}
              {barriers.map((barrier, index) => (
                <div
                  key={index}
                  className="absolute bg-blue-400"
                  style={{
                    left: barrier.x,
                    top: barrier.y,
                    width: 8,
                    height: 8
                  }}
                />
              ))}

              {/* UI */}
              <div className="absolute top-4 left-4 text-green-400 font-mono space-y-1">
                <div>Score: {score}</div>
                <div>Lives: {lives}</div>
                <div>Wave: {wave}</div>
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