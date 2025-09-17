'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = 25;

interface Position {
  x: number;
  y: number;
}

interface Piece {
  shape: number[][];
  color: string;
  position: Position;
}

// Tetris piece shapes
const PIECES = [
  // I piece
  {
    shape: [[1, 1, 1, 1]],
    color: '#00f5ff'
  },
  // O piece
  {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: '#ffff00'
  },
  // T piece
  {
    shape: [
      [0, 1, 0],
      [1, 1, 1]
    ],
    color: '#800080'
  },
  // S piece
  {
    shape: [
      [0, 1, 1],
      [1, 1, 0]
    ],
    color: '#00ff00'
  },
  // Z piece
  {
    shape: [
      [1, 1, 0],
      [0, 1, 1]
    ],
    color: '#ff0000'
  },
  // J piece
  {
    shape: [
      [1, 0, 0],
      [1, 1, 1]
    ],
    color: '#0000ff'
  },
  // L piece
  {
    shape: [
      [0, 0, 1],
      [1, 1, 1]
    ],
    color: '#ffa500'
  }
];

export default function Tetris() {
  const [board, setBoard] = useState<string[][]>(() => 
    Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(''))
  );
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [nextPiece, setNextPiece] = useState<Piece | null>(null);
  const [holdPiece, setHoldPiece] = useState<Piece | null>(null);
  const [canHold, setCanHold] = useState(true);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const gameLoopRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const dropIntervalRef = useRef(1000);
  const lockDelayRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastMoveTimeRef = useRef(0);
  const isLockingRef = useRef(false);

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
    move: () => playSound(200, 0.1),
    rotate: () => playSound(300, 0.15),
    drop: () => playSound(150, 0.2),
    lineClear: () => {
      playSound(400, 0.1);
      setTimeout(() => playSound(500, 0.1), 100);
      setTimeout(() => playSound(600, 0.1), 200);
    },
    hardDrop: () => playSound(100, 0.3),
    gameOver: () => {
      playSound(200, 0.5, 'sawtooth');
      setTimeout(() => playSound(150, 0.5, 'sawtooth'), 200);
    }
  }), [playSound]);

  // Generate random piece
  const generatePiece = useCallback((): Piece => {
    const pieceTemplate = PIECES[Math.floor(Math.random() * PIECES.length)];
    return {
      shape: pieceTemplate.shape,
      color: pieceTemplate.color,
      position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 }
    };
  }, []);

  // Rotate piece matrix
  const rotatePiece = (shape: number[][]): number[][] => {
    const rows = shape.length;
    const cols = shape[0].length;
    const rotated = Array(cols).fill(null).map(() => Array(rows).fill(0));
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        rotated[j][rows - 1 - i] = shape[i][j];
      }
    }
    return rotated;
  };

  // Check if position is valid
  const isValidPosition = useCallback((piece: Piece, newX: number, newY: number, newShape?: number[][]): boolean => {
    const shape = newShape || piece.shape;
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const boardX = newX + x;
          const boardY = newY + y;
          
          if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= BOARD_HEIGHT) {
            return false;
          }
          
          if (boardY >= 0 && board[boardY][boardX]) {
            return false;
          }
        }
      }
    }
    return true;
  }, [board]);

  // Place piece on board
  const placePiece = useCallback((piece: Piece) => {
    const newBoard = board.map(row => [...row]);
    
    piece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          const boardY = piece.position.y + y;
          const boardX = piece.position.x + x;
          if (boardY >= 0) {
            newBoard[boardY][boardX] = piece.color;
          }
        }
      });
    });
    
    setBoard(newBoard);
    return newBoard;
  }, [board]);

  // Clear completed lines
  const clearLines = useCallback((newBoard: string[][]) => {
    let linesCleared = 0;
    const filteredBoard = newBoard.filter(row => {
      const isComplete = row.every(cell => cell !== '');
      if (isComplete) linesCleared++;
      return !isComplete;
    });
    
    // Add empty rows at top
    while (filteredBoard.length < BOARD_HEIGHT) {
      filteredBoard.unshift(Array(BOARD_WIDTH).fill(''));
    }
    
    if (linesCleared > 0) {
      setBoard(filteredBoard);
      setLines(prev => prev + linesCleared);
      setScore(prev => prev + linesCleared * 100 * level);
      setLevel(Math.floor((lines + linesCleared) / 10) + 1);
    }
    
    return { board: filteredBoard, linesCleared };
  }, [level, lines]);

  // Move piece with proper lock delay - fixed to prevent falling freeze
  const movePiece = useCallback((dx: number, dy: number, playMoveSound = true) => {
    if (!currentPiece || gameOver || isPaused) return false;
    
    const newX = currentPiece.position.x + dx;
    const newY = currentPiece.position.y + dy;
    
    if (isValidPosition(currentPiece, newX, newY)) {
      setCurrentPiece(prev => prev ? {
        ...prev,
        position: { x: newX, y: newY }
      } : null);
      
      // Play sound for horizontal movement only
      if (dx !== 0 && playMoveSound) {
        sounds.move();
      }
      
      // Reset lock delay if moving horizontally - this prevents falling freeze
      if (dx !== 0 && lockDelayRef.current) {
        clearTimeout(lockDelayRef.current);
        lockDelayRef.current = undefined;
        isLockingRef.current = false;
      }
      
      return true;
    } else if (dy > 0) {
      // Piece can't move down - start lock delay if not already started
      if (!lockDelayRef.current && !isLockingRef.current) {
        isLockingRef.current = true;
        lockDelayRef.current = setTimeout(() => {
          if (!currentPiece) return;
          
          // Place the piece after lock delay
          const newBoard = placePiece(currentPiece);
          const result = clearLines(newBoard);
          
          if (result.linesCleared > 0) {
            sounds.lineClear();
          } else {
            sounds.drop();
          }
          
          // Check for game over
          if (nextPiece && !isValidPosition(nextPiece, nextPiece.position.x, nextPiece.position.y)) {
            setGameOver(true);
            sounds.gameOver();
            return;
          }
          
          setCurrentPiece(nextPiece);
          setNextPiece(generatePiece());
          setCanHold(true); // Reset hold ability
          lockDelayRef.current = undefined;
          isLockingRef.current = false;
        }, 500); // 500ms lock delay
      }
      
      return false;
    }
    return false;
  }, [currentPiece, gameOver, isPaused, isValidPosition, placePiece, clearLines, nextPiece, generatePiece, sounds]);

  // Rotate current piece with wall kicks (SRS-like system)
  const rotate = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;
    
    const rotatedShape = rotatePiece(currentPiece.shape);
    
    // Wall kick tests - try different positions
    const wallKickTests = [
      { x: 0, y: 0 },   // No kick (original position)
      { x: -1, y: 0 },  // Kick left
      { x: 1, y: 0 },   // Kick right
      { x: 0, y: -1 },  // Kick up
      { x: -1, y: -1 }, // Kick left and up
      { x: 1, y: -1 },  // Kick right and up
      { x: 0, y: 1 },   // Kick down (rare but possible)
    ];
    
    // Try each wall kick position
    for (const kick of wallKickTests) {
      const testX = currentPiece.position.x + kick.x;
      const testY = currentPiece.position.y + kick.y;
      
      if (isValidPosition(currentPiece, testX, testY, rotatedShape)) {
        setCurrentPiece(prev => prev ? {
          ...prev,
          position: { x: testX, y: testY },
          shape: rotatedShape
        } : null);
        
        sounds.rotate();
        
        // Reset lock delay on successful rotation
        if (lockDelayRef.current) {
          clearTimeout(lockDelayRef.current);
          lockDelayRef.current = undefined;
        }
        
        return; // Successfully rotated and positioned
      }
    }
    
    // If no wall kick worked, rotation is not possible (no action taken)
  }, [currentPiece, gameOver, isPaused, isValidPosition, sounds]);

  // Hold piece function
  const holdCurrentPiece = useCallback(() => {
    if (!currentPiece || gameOver || isPaused || !canHold) return;
    
    if (holdPiece) {
      // Swap current piece with held piece
      const tempPiece = { ...holdPiece, position: { x: 4, y: 0 } };
      setHoldPiece({ ...currentPiece, position: { x: 4, y: 0 } });
      setCurrentPiece(tempPiece);
    } else {
      // First time holding - store current piece and get next piece
      setHoldPiece({ ...currentPiece, position: { x: 4, y: 0 } });
      setCurrentPiece(nextPiece);
      setNextPiece(generatePiece());
    }
    
    setCanHold(false); // Can only hold once per piece
    sounds.move();
  }, [currentPiece, holdPiece, nextPiece, gameOver, isPaused, canHold, generatePiece, sounds]);

  // Add proper movement timing to fix falling freeze
  // This function replaces the old game loop to provide smoother falling
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const continuousFall = useCallback(() => {
    const now = Date.now();
    
    // Only fall if enough time has passed and piece isn't in lock delay
    if (now - lastMoveTimeRef.current >= dropIntervalRef.current && !isLockingRef.current) {
      const moved = movePiece(0, 1, false);
      
      if (!moved) {
        // Piece can't move down - start lock delay if not already started
        if (!lockDelayRef.current && !isLockingRef.current) {
          isLockingRef.current = true;
          lockDelayRef.current = setTimeout(() => {
            if (!currentPiece) return;
            
            // Place the piece after lock delay
            const newBoard = placePiece(currentPiece);
            const result = clearLines(newBoard);
            
            if (result.linesCleared > 0) {
              sounds.lineClear();
            } else {
              sounds.drop();
            }
            
            // Check for game over
            if (nextPiece && !isValidPosition(nextPiece, nextPiece.position.x, nextPiece.position.y)) {
              setGameOver(true);
              sounds.gameOver();
              return;
            }
            
            setCurrentPiece(nextPiece);
            setNextPiece(generatePiece());
            setCanHold(true); // Reset hold ability
            lockDelayRef.current = undefined;
            isLockingRef.current = false;
          }, 500); // 500ms lock delay
        }
      } else {
        // Reset lock delay if piece moved successfully
        if (lockDelayRef.current) {
          clearTimeout(lockDelayRef.current);
          lockDelayRef.current = undefined;
          isLockingRef.current = false;
        }
      }
      
      lastMoveTimeRef.current = now;
    }
  }, [currentPiece, nextPiece, movePiece, placePiece, clearLines, generatePiece, isValidPosition, sounds]);
  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted || gameOver) return;
      
      // Prevent default behavior for game keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'KeyP', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyC'].includes(e.code)) {
        e.preventDefault();
        e.stopPropagation();
      }

      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          movePiece(-1, 0);
          break;
        case 'ArrowRight':
        case 'KeyD':
          movePiece(1, 0);
          break;
        case 'ArrowDown':
        case 'KeyS':
          movePiece(0, 1, false); // Soft drop, no move sound
          break;
        case 'ArrowUp':
        case 'KeyW':
          rotate();
          break;
        case 'Space':
          hardDrop();
          break;
        case 'KeyP':
          setIsPaused(prev => !prev);
          break;
        case 'KeyC':
          holdCurrentPiece();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gameOver, movePiece, rotate, holdCurrentPiece]);

  // Game loop - continuous falling
  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
      return;
    }

    dropIntervalRef.current = Math.max(50, 1000 - (level - 1) * 50);
    
    gameLoopRef.current = setInterval(() => {
      movePiece(0, 1, false); // Auto-drop, no sound
    }, dropIntervalRef.current);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameStarted, gameOver, isPaused, level, movePiece]);

  // Cleanup lock delay on game state changes
  useEffect(() => {
    return () => {
      if (lockDelayRef.current) {
        clearTimeout(lockDelayRef.current);
      }
    };
  }, []);

  // Start game
  const startGame = () => {
    setBoard(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill('')));
    setCurrentPiece(generatePiece());
    setNextPiece(generatePiece());
    setScore(0);
    setLevel(1);
    setLines(0);
    setGameOver(false);
    setGameStarted(true);
    setIsPaused(false);
  };

  // Reset game
  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setIsPaused(false);
  };

  // Render board with current piece
  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    // Add current piece to display board
    if (currentPiece) {
      currentPiece.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell) {
            const boardY = currentPiece.position.y + y;
            const boardX = currentPiece.position.x + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = currentPiece.color;
            }
          }
        });
      });
    }
    
    return displayBoard;
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="flex gap-6">
        {/* Game Board */}
        <div className="relative">
          <div 
            className="border-2 border-cyan-400 bg-gray-900"
            style={{ 
              width: BOARD_WIDTH * BLOCK_SIZE, 
              height: BOARD_HEIGHT * BLOCK_SIZE,
              display: 'grid',
              gridTemplateColumns: `repeat(${BOARD_WIDTH}, ${BLOCK_SIZE}px)`,
              gridTemplateRows: `repeat(${BOARD_HEIGHT}, ${BLOCK_SIZE}px)`
            }}
          >
            {renderBoard().flat().map((cell, index) => (
              <div
                key={index}
                className="border border-gray-700"
                style={{
                  backgroundColor: cell || 'transparent',
                  width: BLOCK_SIZE,
                  height: BLOCK_SIZE
                }}
              />
            ))}
          </div>

          {/* Game overlay */}
          {!gameStarted && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 text-cyan-400 font-mono">
              <h1 className="text-4xl mb-4 pixel-font">TETRIS</h1>
              <p className="text-lg mb-2">XRCraft Edition</p>
              <p className="text-sm mb-4">Use ARROW KEYS or WASD to play</p>
              <p className="text-sm mb-4">SPACE for hard drop, P to pause</p>
              <button 
                onClick={startGame}
                className="px-6 py-3 border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-colors pixel-font"
              >
                START GAME
              </button>
            </div>
          )}

          {gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-90 text-cyan-400 font-mono">
              <h2 className="text-3xl mb-4 pixel-font">GAME OVER</h2>
              <p className="text-xl mb-2">Score: {score}</p>
              <p className="text-lg mb-4">Level: {level}</p>
              <div className="space-x-4">
                <button 
                  onClick={startGame}
                  className="px-4 py-2 border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-colors"
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

          {isPaused && gameStarted && !gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 text-cyan-400 font-mono">
              <div className="text-center">
                <h2 className="text-2xl mb-4 pixel-font">PAUSED</h2>
                <p className="text-sm">Press P to resume</p>
              </div>
            </div>
          )}
        </div>

        {/* Side Panel */}
        <div className="text-cyan-400 font-mono space-y-4">
          {/* Score */}
          <div className="border-2 border-cyan-400 p-4 bg-gray-900 min-w-32">
            <h3 className="text-sm mb-2">SCORE</h3>
            <p className="text-lg">{score}</p>
          </div>

          {/* Level */}
          <div className="border-2 border-cyan-400 p-4 bg-gray-900">
            <h3 className="text-sm mb-2">LEVEL</h3>
            <p className="text-lg">{level}</p>
          </div>

          {/* Lines */}
          <div className="border-2 border-cyan-400 p-4 bg-gray-900">
            <h3 className="text-sm mb-2">LINES</h3>
            <p className="text-lg">{lines}</p>
          </div>

          {/* Hold Piece */}
          {gameStarted && (
            <div className="border-2 border-cyan-400 p-4 bg-gray-900">
              <h3 className="text-sm mb-2">HOLD</h3>
              {holdPiece ? (
                <div 
                  className="grid gap-px"
                  style={{
                    gridTemplateColumns: `repeat(4, 15px)`,
                    gridTemplateRows: `repeat(4, 15px)`
                  }}
                >
                  {Array(4).fill(null).map((_, y) =>
                    Array(4).fill(null).map((_, x) => {
                      const hasBlock = holdPiece.shape[y] && holdPiece.shape[y][x];
                      return (
                        <div
                          key={`hold-${y}-${x}`}
                          className="border border-gray-700"
                          style={{
                            backgroundColor: hasBlock ? holdPiece.color : 'transparent',
                            width: 15,
                            height: 15,
                            opacity: canHold ? 1 : 0.5
                          }}
                        />
                      );
                    })
                  )}
                </div>
              ) : (
                <div className="text-xs text-gray-500">Empty</div>
              )}
            </div>
          )}

          {/* Next Piece */}
          {nextPiece && (
            <div className="border-2 border-cyan-400 p-4 bg-gray-900">
              <h3 className="text-sm mb-2">NEXT</h3>
              <div 
                className="grid gap-px"
                style={{
                  gridTemplateColumns: `repeat(4, 15px)`,
                  gridTemplateRows: `repeat(4, 15px)`
                }}
              >
                {Array(4).fill(null).map((_, y) =>
                  Array(4).fill(null).map((_, x) => {
                    const hasBlock = nextPiece.shape[y] && nextPiece.shape[y][x];
                    return (
                      <div
                        key={`${y}-${x}`}
                        className="border border-gray-700"
                        style={{
                          backgroundColor: hasBlock ? nextPiece.color : 'transparent',
                          width: 15,
                          height: 15
                        }}
                      />
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="border-2 border-cyan-400 p-4 bg-gray-900 text-xs">
            <h3 className="text-sm mb-2">CONTROLS</h3>
            <div className="space-y-1">
              <p>← → Move</p>
              <p>↓ Soft Drop</p>
              <p>↑ Rotate</p>
              <p>SPACE Hard Drop</p>
              <p>C Hold</p>
              <p>P Pause</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-cyan-400 text-sm font-mono">
        Press ESC to exit
      </div>
    </div>
  );
}