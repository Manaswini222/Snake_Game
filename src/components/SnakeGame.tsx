import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RotateCcw } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 180;

type Point = { x: number; y: number };

export default function SnakeGame({ onScoreUpdate }: { onScoreUpdate: (score: number) => void }) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  
  const directionRef = useRef(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setIsPaused(false);
    setScore(0);
    onScoreUpdate(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (directionRef.current.y !== 1) {
            setDirection({ x: 0, y: -1 });
          }
          break;
        case 'ArrowDown':
        case 's':
          if (directionRef.current.y !== -1) {
            setDirection({ x: 0, y: 1 });
          }
          break;
        case 'ArrowLeft':
        case 'a':
          if (directionRef.current.x !== 1) {
            setDirection({ x: -1, y: 0 });
          }
          break;
        case 'ArrowRight':
        case 'd':
          if (directionRef.current.x !== -1) {
            setDirection({ x: 1, y: 0 });
          }
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + direction.x,
          y: head.y + direction.y,
        };

        // Check collision with walls
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check collision with self
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const newScore = s + 10;
            onScoreUpdate(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        directionRef.current = direction;
        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(intervalId);
  }, [direction, food, gameOver, isPaused, generateFood, onScoreUpdate]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full mt-8">
      <div className="relative border-4 border-fuchsia-500 bg-black p-1">
        <div 
          className="grid gap-[1px] bg-cyan-900/30"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: 'min(80vw, 400px)',
            height: 'min(80vw, 400px)',
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const snakeIndex = snake.findIndex(segment => segment.x === x && segment.y === y);
            const isHead = snakeIndex === 0;
            const isBody = snakeIndex > 0;
            const isFood = food.x === x && food.y === y;

            let cellClass = 'bg-black';

            if (isHead) {
              cellClass = 'bg-cyan-400 z-10 relative';
            } else if (isBody) {
              cellClass = snakeIndex % 2 === 0 ? 'bg-cyan-500' : 'bg-cyan-600';
            } else if (isFood) {
              cellClass = 'bg-fuchsia-500 animate-pulse';
            }

            return (
              <div
                key={i}
                className={cellClass}
              />
            );
          })}
        </div>
        
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20 border-4 border-fuchsia-500">
            <h2 className="text-6xl text-fuchsia-500 mb-2 glitch-text" data-text="FATAL_ERROR">FATAL_ERROR</h2>
            <p className="text-3xl text-cyan-400 mb-8">DATA_CORRUPTED: {score}</p>
            <button 
              onClick={resetGame}
              className="p-4 bg-black border-4 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-none group flex items-center gap-4"
              title="REBOOT"
            >
              <RotateCcw className="w-8 h-8 group-hover:-rotate-180 transition-transform duration-0" />
              <span className="text-2xl">REBOOT_SEQ</span>
            </button>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20 border-4 border-cyan-400">
            <h2 className="text-5xl text-cyan-400 glitch-text" data-text="PROCESS_SUSPENDED">PROCESS_SUSPENDED</h2>
          </div>
        )}
      </div>
      
      <div className="mt-6 flex flex-col items-center gap-2 text-xl text-fuchsia-500">
        <div className="flex items-center gap-2">
          INPUT_VECTOR: <kbd className="px-2 bg-cyan-400 text-black">W,A,S,D</kbd> // <kbd className="px-2 bg-cyan-400 text-black">ARROWS</kbd>
        </div>
        <div className="flex items-center gap-2">
          HALT_EXECUTION: <kbd className="px-2 bg-fuchsia-500 text-black">SPACE</kbd>
        </div>
      </div>
    </div>
  );
}
