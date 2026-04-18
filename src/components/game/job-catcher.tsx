import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const ITEMS = [
  { emoji: "💼", type: "job", points: 10, label: "Job Offer!" },
  { emoji: "🌟", type: "special", points: 25, label: "FAANG!" },
  { emoji: "🎯", type: "job", points: 10, label: "Target!" },
  { emoji: "🚀", type: "special", points: 20, label: "Startup!" },
  { emoji: "💰", type: "bonus", points: 50, label: "$150K!" },
  { emoji: "❌", type: "reject", points: -15, label: "Reject!" },
];

interface FallingItem {
  id: number;
  x: number;
  item: typeof ITEMS[0];
  speed: number;
}

export function JobCatcher() {
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [fallingItems, setFallingItems] = useState<FallingItem[]>([]);
  const [basketX, setBasketX] = useState(50);
  const [highScore, setHighScore] = useState(0);
  const gameRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>();
  const lastSpawnRef = useRef(0);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const handleMouseMove = (e: MouseEvent) => {
        if (gameRef.current) {
          const rect = gameRef.current.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          setBasketX(Math.max(5, Math.min(95, x)));
        }
      };
      
      const handleTouchMove = (e: TouchEvent) => {
        if (gameRef.current) {
          const rect = gameRef.current.getBoundingClientRect();
          const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
          setBasketX(Math.max(5, Math.min(95, x)));
        }
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("touchmove", handleTouchMove);
      
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("touchmove", handleTouchMove);
      };
    }
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = (timestamp: number) => {
      // Spawn new items
      if (timestamp - lastSpawnRef.current > 800) {
        const randomItem = ITEMS[Math.floor(Math.random() * ITEMS.length)];
        setFallingItems(prev => [...prev, {
          id: Date.now() + Math.random(),
          x: Math.random() * 90 + 5,
          item: randomItem,
          speed: 0.5 + Math.random() * 0.5,
        }]);
        lastSpawnRef.current = timestamp;
      }

      // Move items down and check collisions
      setFallingItems(prev => {
        const gameRect = gameRef.current?.getBoundingClientRect();
        if (!gameRect) return prev;

        return prev.map(item => {
          const newY = item.y !== undefined ? item.y + item.speed : 0;
          
          // Check if caught (bottom of game area + basket height)
          if (newY >= 85) {
            const basketLeft = basketX - 10;
            const basketRight = basketX + 10;
            
            if (item.x >= basketLeft && item.x <= basketRight) {
              // Caught!
              setScore(s => {
                const newScore = s + item.item.points;
                if (newScore > highScore) setHighScore(newScore);
                if (newScore < 0) {
                  setGameOver(true);
                  return 0;
                }
                return newScore;
              });
              return null; // Remove item
            }
            // Missed - remove if went off screen
            if (newY > 100) return null;
          }
          
          return { ...item, y: newY };
        }).filter(Boolean) as FallingItem[];
      });

      frameRef.current = requestAnimationFrame(gameLoop);
    };

    frameRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [gameStarted, gameOver, basketX, highScore]);

  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    setFallingItems([]);
    setBasketX(50);
  };

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-zinc-900/80 rounded-xl border border-white/10">
        <div className="text-center mb-4">
          <div className="text-2xl mb-2">🎮</div>
          <h3 className="text-white font-bold text-sm mb-1">Job Offer Catcher</h3>
          <p className="text-zinc-500 text-[10px]">Move mouse/finger to catch offers!</p>
        </div>
        <div className="flex gap-4 text-xs mb-4">
          <span className="text-emerald-400">Best: {highScore}</span>
        </div>
        <button
          onClick={startGame}
          className="px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-medium hover:bg-emerald-500/30 transition-colors"
        >
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div 
      ref={gameRef}
      className="relative h-32 bg-zinc-900/80 rounded-xl border border-white/10 overflow-hidden select-none"
    >
      {/* Score */}
      <div className="absolute top-2 left-2 flex gap-3 z-10">
        <span className={`text-xs font-mono ${score >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          Score: {score}
        </span>
        <span className="text-xs font-mono text-zinc-500">
          Best: {highScore}
        </span>
      </div>
      
      {/* Game Over */}
      {gameOver && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20">
          <div className="text-2xl mb-2">😅</div>
          <p className="text-white text-sm font-bold mb-1">Game Over!</p>
          <p className="text-zinc-400 text-xs mb-3">Too many rejections!</p>
          <button
            onClick={startGame}
            className="px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-medium hover:bg-emerald-500/30 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
      
      {/* Falling Items */}
      {fallingItems.map(item => (
        <div
          key={item.id}
          className="absolute text-2xl transition-all"
          style={{
            left: `${item.x}%`,
            top: `${item.y || 0}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {item.item.emoji}
        </div>
      ))}
      
      {/* Basket */}
      <div 
        className="absolute bottom-2 text-3xl transition-all duration-75"
        style={{ left: `${basketX}%`, transform: 'translateX(-50%)' }}
      >
        🧺
      </div>
      
      {/* Instructions */}
      <div className="absolute bottom-1 right-2 text-[8px] text-zinc-600">
        Catch 💼🎯🌟🚀💰 | Avoid ❌
      </div>
    </div>
  );
}
