import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const JOBS = [
  { title: "Backend", company: "Google", salary: "$180K", emoji: "💼" },
  { title: "Full Stack", company: "Meta", salary: "$165K", emoji: "💻" },
  { title: "Cloud", company: "AWS", salary: "$175K", emoji: "☁️" },
  { title: "AI/ML", company: "OpenAI", salary: "$200K", emoji: "🤖" },
  { title: "DevOps", company: "Stripe", salary: "$170K", emoji: "🚀" },
  { title: "Data", company: "Databricks", salary: "$185K", emoji: "📊" },
];

const REJECTIONS = [
  "❌ No visa",
  "❌ 5+ yrs exp",
  "❌ Position filled",
  "❌ Not authorized",
  "❌ We went with others",
];

interface FallingItem {
  id: number;
  x: number;
  y: number;
  type: 'job' | 'reject';
  text: string;
  speed: number;
}

export function JobCatcher({ onExit }: { onExit: () => void }) {
  const [fallingItems, setFallingItems] = useState<FallingItem[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [catcherX, setCatcherX] = useState(50);
  const [gameStarted, setGameStarted] = useState(false);
  const gameRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const livesRef = useRef(3);

  // Keep livesRef in sync
  useEffect(() => {
    livesRef.current = lives;
  }, [lives]);

  useEffect(() => {
    if (gameOver || !gameStarted) return;

    const interval = setInterval(() => {
      const now = Date.now();
      
      // Spawn every 1.5 seconds
      if (now - lastSpawnRef.current > 1500) {
        // 70% jobs, 30% rejections
        const isJob = Math.random() > 0.3;
        
        if (isJob) {
          const item = JOBS[Math.floor(Math.random() * JOBS.length)];
          setFallingItems(prev => [...prev, {
            id: idRef.current++,
            x: 10 + Math.random() * 80,
            y: -10,
            type: 'job',
            text: `${item.emoji} ${item.title}`,
            speed: 0.5 + Math.random() * 0.3,
          }]);
        } else {
          const rej = REJECTIONS[Math.floor(Math.random() * REJECTIONS.length)];
          setFallingItems(prev => [...prev, {
            id: idRef.current++,
            x: 10 + Math.random() * 80,
            y: -10,
            type: 'reject',
            text: rej,
            speed: 0.4 + Math.random() * 0.2,
          }]);
        }
        lastSpawnRef.current = now;
      }

      // Update positions
      setFallingItems(prev => {
        const catcherWidth = 25;
        const catcherTop = 80;
        
        const remaining: FallingItem[] = [];
        
        for (const item of prev) {
          const newY = item.y + item.speed;
          
          // Check collision with catcher
          if (newY >= catcherTop - 10 && newY <= catcherTop + 8) {
            if (item.x >= catcherX - catcherWidth/2 && item.x <= catcherX + catcherWidth/2) {
              // Collision! 
              if (item.type === 'job') {
                setScore(s => s + 100);
              } else {
                // Only lose 1 life per rejection, even if multiple hit
                const currentLives = livesRef.current;
                if (currentLives > 0) {
                  const newLives = currentLives - 1;
                  livesRef.current = newLives;
                  setLives(newLives);
                  if (newLives <= 0) {
                    setGameOver(true);
                  }
                }
              }
              continue; // Remove this item
            }
          }
          
          // Keep item if still on screen
          if (newY < 105) {
            remaining.push({ ...item, y: newY });
          }
        }
        
        return remaining;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [gameOver, catcherX, gameStarted]);

  // Touch/mouse controls
  const handleMove = (clientX: number) => {
    if (gameRef.current) {
      const rect = gameRef.current.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 100;
      setCatcherX(Math.max(12, Math.min(88, x)));
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setLives(3);
    livesRef.current = 3;
    setFallingItems([]);
    setGameOver(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="fixed inset-0 z-[300] bg-black/95 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg px-3 py-1">
            <span className="text-[10px] text-zinc-400 block">SCORE</span>
            <p className="text-xl font-black text-emerald-400">{score}</p>
          </div>
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg px-3 py-1">
            <span className="text-[10px] text-zinc-400 block">LIVES</span>
            <p className="text-xl font-black text-red-400">
              {lives >= 3 ? "❤️❤️❤️" : lives === 2 ? "❤️❤️" : lives === 1 ? "❤️" : "💀"}
            </p>
          </div>
        </div>
        <button
          onClick={onExit}
          className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white text-sm"
        >
          Exit
        </button>
      </div>

      {/* Game Area */}
      <div 
        ref={gameRef}
        className="flex-1 relative overflow-hidden touch-none"
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onMouseMove={(e) => { if (e.buttons === 1) handleMove(e.clientX); }}
      >
        {!gameStarted ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-3xl font-black text-white mb-4">🎯 JOB CATCHER</h2>
              <p className="text-zinc-400 mb-6 text-sm max-w-xs mx-auto px-4">
                Catch 💼 job offers for points. Avoid ❌ rejection emails - you have 3 lives!
              </p>
              <p className="text-zinc-500 mb-6 text-xs">
                Move finger/mouse to control the bar
              </p>
              <button
                onClick={startGame}
                className="px-8 py-3 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold hover:bg-emerald-500/30 transition-all"
              >
                Start Game 🎮
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Instructions hint */}
            {fallingItems.length < 3 && (
              <div className="absolute inset-x-0 top-4 text-center text-zinc-600 text-xs">
                Move finger/mouse to catch jobs
              </div>
            )}

            {/* Falling items */}
            {fallingItems.map(item => (
              <div
                key={item.id}
                className="absolute transition-transform"
                style={{ 
                  left: `${item.x}%`, 
                  top: `${item.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className={`px-3 py-1.5 rounded-lg text-xs font-bold text-center whitespace-nowrap ${
                  item.type === 'job' 
                    ? 'bg-emerald-500/30 border border-emerald-500/50 text-emerald-400' 
                    : 'bg-red-500/30 border border-red-500/50 text-red-400'
                }`}>
                  {item.text}
                </div>
              </div>
            ))}

            {/* Catcher Bar */}
            <div
              className="absolute bottom-12 w-24 h-8 bg-cyan-500/40 border-2 border-cyan-400 rounded-lg cursor-grab active:cursor-grabbing"
              style={{ 
                left: `calc(${catcherX}% - 48px)`,
              }}
            />
          </>
        )}
      </div>

      {/* Game Over Overlay */}
      {gameOver && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-8"
        >
          <h2 className="text-4xl font-black text-red-500 mb-4">GAME OVER</h2>
          <p className="text-6xl font-black text-emerald-400 mb-2">{score}</p>
          <p className="text-zinc-400 mb-6">Final Score</p>
          <button
            onClick={startGame}
            className="px-8 py-3 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold hover:bg-emerald-500/30 transition-all"
          >
            Play Again 🔄
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
