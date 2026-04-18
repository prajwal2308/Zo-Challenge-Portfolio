import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

const JOBS = [
  { title: "Backend", company: "Google", salary: "$180K", emoji: "💼" },
  { title: "Full Stack", company: "Meta", salary: "$165K", emoji: "💻" },
  { title: "Cloud", company: "AWS", salary: "$175K", emoji: "☁️" },
  { title: "AI/ML", company: "OpenAI", salary: "$200K", emoji: "🤖" },
  { title: "DevOps", company: "Stripe", salary: "$170K", emoji: "🚀" },
  { title: "Data", company: "Databricks", salary: "$185K", emoji: "📊" },
];

const REJECTIONS = ["❌ No visa", "❌ 5+ yrs exp", "❌ Position filled", "❌ Not authorized", "❌ We went with others"];

interface FallingItem {
  id: number;
  x: number;
  y: number;
  type: 'job' | 'reject';
  text: string;
  speed: number;
}

export function JobCatcher({ onExit }: { onExit: () => void }) {
  const [items, setItems] = useState<FallingItem[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [catcherX, setCatcherX] = useState(50);
  
  const catcherXRef = useRef(50);
  const gameRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const animationRef = useRef<number>();
  
  // Sync catcherXRef with state
  useEffect(() => {
    catcherXRef.current = catcherX;
  }, [catcherX]);

  const startGame = useCallback(() => {
    setItems([]);
    setScore(0);
    setLives(3);
    setIsGameOver(false);
    setIsStarted(true);
    catcherXRef.current = 50;
    setCatcherX(50);
    lastSpawnRef.current = 0;
  }, []);

  // Main game loop using requestAnimationFrame
  useEffect(() => {
    if (!isStarted || isGameOver) return;

    let lastTime = performance.now();
    
    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      // Spawn items every 1.2s
      if (currentTime - lastSpawnRef.current > 1200) {
        const isJob = Math.random() > 0.35;
        const item = isJob 
          ? JOBS[Math.floor(Math.random() * JOBS.length)]
          : null;
        
        setItems(prev => [...prev, {
          id: idRef.current++,
          x: 10 + Math.random() * 80,
          y: -5,
          type: isJob ? 'job' : 'reject',
          text: isJob ? `${item!.emoji} ${item!.title}` : REJECTIONS[Math.floor(Math.random() * REJECTIONS.length)],
          speed: (0.4 + Math.random() * 0.3) * (deltaTime / 16.67),
        }]);
        
        lastSpawnRef.current = currentTime;
      }

      // Update positions and check collisions
      setItems(prev => {
        const catcherWidth = 20;
        const catcherTop = 85;
        let livesLost = 0;
        let scoreGained = 0;
        
        const remaining = prev.filter(item => {
          const newY = item.y + item.speed;
          
          // Collision check
          if (newY >= catcherTop - 8 && newY <= catcherTop + 5) {
            if (item.x >= catcherXRef.current - catcherWidth/2 && item.x <= catcherXRef.current + catcherWidth/2) {
              if (item.type === 'job') {
                scoreGained += 100;
              } else {
                livesLost += 1;
              }
              return false;
            }
          }
          
          return newY < 110;
        });

        if (scoreGained > 0) {
          setScore(s => s + scoreGained);
        }
        
        if (livesLost > 0) {
          setLives(l => {
            const newLives = Math.max(0, l - livesLost);
            if (newLives <= 0) setIsGameOver(true);
            return newLives;
          });
        }
        
        return remaining;
      });

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isStarted, isGameOver]);

  // Mouse/Touch controls - just update position, don't pause game
  const handlePointerMove = useCallback((clientX: number) => {
    if (gameRef.current) {
      const rect = gameRef.current.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 100;
      setCatcherX(Math.max(12, Math.min(88, x)));
    }
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[300] bg-black/95 flex flex-col">
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
              {lives === 3 ? "❤️❤️❤️" : lives === 2 ? "❤️❤️" : lives === 1 ? "❤️" : "💀"}
            </p>
          </div>
        </div>
        <button onClick={onExit} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white text-sm">
          Exit
        </button>
      </div>

      {/* Game Area */}
      <div 
        ref={gameRef}
        className="flex-1 relative overflow-hidden"
        onMouseMove={(e) => handlePointerMove(e.clientX)}
        onTouchMove={(e) => handlePointerMove(e.touches[0].clientX)}
        onMouseDown={(e) => handlePointerMove(e.clientX)}
      >
        {!isStarted ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-3xl font-black text-white mb-4">🎯 JOB CATCHER</h2>
              <p className="text-zinc-400 mb-4 text-sm max-w-xs mx-auto px-4">
                Catch 💼 job offers. Avoid ❌ rejections. 3 lives!
              </p>
              <p className="text-zinc-500 mb-6 text-xs">Move finger or mouse to control bar</p>
              <button onClick={startGame} className="px-8 py-3 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold hover:bg-emerald-500/30">
                Start Game 🎮
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Instructions */}
            {items.length < 3 && (
              <div className="absolute inset-x-0 top-4 text-center text-zinc-600 text-xs animate-pulse">
                Move to catch jobs, avoid rejections
              </div>
            )}

            {/* Falling items */}
            {items.map(item => (
              <div
                key={item.id}
                className="absolute"
                style={{ left: `${item.x}%`, top: `${item.y}%`, transform: 'translate(-50%, -50%)' }}
              >
                <div className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                  item.type === 'job' 
                    ? 'bg-emerald-500/30 border border-emerald-500/50 text-emerald-400' 
                    : 'bg-red-500/30 border border-red-500/50 text-red-400'
                }`}>
                  {item.text}
                </div>
              </div>
            ))}

            {/* Catcher */}
            <div
              className="absolute bottom-16 w-20 h-6 bg-cyan-500/50 border-2 border-cyan-400 rounded-lg"
              style={{ left: `calc(${catcherX}% - 40px)` }}
            />
          </>
        )}
      </div>

      {/* Game Over */}
      {isGameOver && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-8">
          <h2 className="text-4xl font-black text-red-500 mb-4">GAME OVER</h2>
          <p className="text-6xl font-black text-emerald-400 mb-2">{score}</p>
          <p className="text-zinc-400 mb-6">Final Score</p>
          <button onClick={startGame} className="px-8 py-3 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold">
            Play Again 🔄
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}