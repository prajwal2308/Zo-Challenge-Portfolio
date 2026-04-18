import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const JOBS = [
  { title: "Backend Engineer", company: "Google", salary: "$180K", emoji: "🔍" },
  { title: "Full Stack Dev", company: "Meta", salary: "$165K", emoji: "💻" },
  { title: "Cloud Engineer", company: "AWS", salary: "$175K", emoji: "☁️" },
  { title: "AI/ML Engineer", company: "OpenAI", salary: "$200K", emoji: "🤖" },
  { title: "DevOps Engineer", company: "Stripe", salary: "$170K", emoji: "🚀" },
  { title: "Data Engineer", company: "Databricks", salary: "$185K", emoji: "📊" },
  { title: "Software Engineer", company: "Airbnb", salary: "$175K", emoji: "🏠" },
  { title: "Platform Engineer", company: "Snowflake", salary: "$182K", emoji: "❄️" },
  { title: "Security Engineer", company: "Cloudflare", salary: "$165K", emoji: "🛡️" },
  { title: "SRE", company: "Netflix", salary: "$190K", emoji: "🎬" },
];

const REJECTIONS = ["❌ No visa sponsorship", "❌ 5+ years exp required", "❌ Position filled", "❌ Not authorized to work"];

interface FallingJob {
  id: number;
  x: number;
  y: number;
  job: typeof JOBS[0];
  speed: number;
}

interface FallingRejection {
  id: number;
  x: number;
  y: number;
  text: string;
  speed: number;
}

interface GameState {
  score: number;
  lives: number;
  jobsCaught: number;
  rejectionsReceived: number;
  isGameOver: boolean;
  isPlaying: boolean;
  showInstructions: boolean;
}

export function JobCatcher({ onExit }: { onExit: () => void }) {
  const [fallingJobs, setFallingJobs] = useState<FallingJob[]>([]);
  const [fallingRejections, setFallingRejections] = useState<FallingRejection[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lives: 3,
    jobsCaught: 0,
    rejectionsReceived: 0,
    isGameOver: false,
    isPlaying: false,
    showInstructions: true,
  });
  const [catcherPos, setCatcherPos] = useState(50);
  const [keys, setKeys] = useState<{ left: boolean; right: boolean }>({ left: false, right: false });
  const gameRef = useRef<HTMLDivElement>(null);
  const idCounter = useRef(0);
  const lastSpawnRef = useRef(0);
  const lastRejectionSpawnRef = useRef(0);

  useEffect(() => {
    if (!gameState.isPlaying || gameState.isGameOver) return;

    const gameLoop = setInterval(() => {
      const now = Date.now();

      // Move catcher
      if (keys.left) setCatcherPos(prev => Math.max(5, prev - 3));
      if (keys.right) setCatcherPos(prev => Math.min(95, prev + 3));

      // Spawn jobs every 1.5 seconds
      if (now - lastSpawnRef.current > 1500) {
        const randomJob = JOBS[Math.floor(Math.random() * JOBS.length)];
        const newJob: FallingJob = {
          id: idCounter.current++,
          x: Math.random() * 80 + 10,
          y: -15,
          job: randomJob,
          speed: 0.3 + Math.random() * 0.3,
        };
        setFallingJobs(prev => [...prev, newJob]);
        lastSpawnRef.current = now;
      }

      // Spawn rejections every 2.5 seconds
      if (now - lastRejectionSpawnRef.current > 2500) {
        const randomRejection = REJECTIONS[Math.floor(Math.random() * REJECTIONS.length)];
        const newRejection: FallingRejection = {
          id: idCounter.current++,
          x: Math.random() * 80 + 10,
          y: -15,
          text: randomRejection,
          speed: 0.4 + Math.random() * 0.2,
        };
        setFallingRejections(prev => [...prev, newRejection]);
        lastRejectionSpawnRef.current = now;
      }

      // Update falling items
      setFallingJobs(prev => {
        const updated = prev.map(job => ({ ...job, y: job.y + job.speed }))
          .filter(job => job.y < 100);
        return updated;
      });

      setFallingRejections(prev => {
        const updated = prev.map(rej => ({ ...rej, y: rej.y + rej.speed }))
          .filter(rej => rej.y < 100);
        return updated;
      });

      // Check collisions with catcher
      const catcherWidth = 20;
      const catcherTop = 85;

      setFallingJobs(prev => {
        const caught = prev.filter(job => {
          const inRange = job.x >= catcherPos - catcherWidth / 2 && job.x <= catcherPos + catcherWidth / 2;
          const atHeight = job.y >= catcherTop - 5 && job.y <= catcherTop + 10;
          return inRange && atHeight;
        });

        if (caught.length > 0) {
          setGameState(s => ({ ...s, score: s.score + caught.length * 100, jobsCaught: s.jobsCaught + caught.length }));
        }

        return prev.filter(job => {
          const inRange = job.x >= catcherPos - catcherWidth / 2 && job.x <= catcherPos + catcherWidth / 2;
          const atHeight = job.y >= catcherTop - 5 && job.y <= catcherTop + 10;
          return !(inRange && atHeight);
        });
      });

      setFallingRejections(prev => {
        const hit = prev.filter(rej => {
          const inRange = rej.x >= catcherPos - catcherWidth / 2 && rej.x <= catcherPos + catcherWidth / 2;
          const atHeight = rej.y >= catcherTop - 5 && rej.y <= catcherTop + 10;
          return inRange && atHeight;
        });

        if (hit.length > 0) {
          setGameState(s => {
            const newLives = s.lives - hit.length;
            return {
              ...s,
              lives: Math.max(0, newLives),
              rejectionsReceived: s.rejectionsReceived + hit.length,
              isGameOver: newLives <= 0
            };
          });
        }

        return prev.filter(rej => {
          const inRange = rej.x >= catcherPos - catcherWidth / 2 && rej.x <= catcherPos + catcherWidth / 2;
          const atHeight = rej.y >= catcherTop - 5 && rej.y <= catcherTop + 10;
          return !(inRange && atHeight);
        });
      });

    }, 50);

    return () => clearInterval(gameLoop);
  }, [gameState.isPlaying, gameState.isGameOver, catcherPos, keys]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') setKeys(k => ({ ...k, left: true }));
      if (e.key === 'ArrowRight' || e.key === 'd') setKeys(k => ({ ...k, right: true }));
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') setKeys(k => ({ ...k, left: false }));
      if (e.key === 'ArrowRight' || e.key === 'd') setKeys(k => ({ ...k, right: false }));
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const startGame = () => {
    setGameState(s => ({ ...s, showInstructions: false, isPlaying: true, score: 0, lives: 3, jobsCaught: 0, rejectionsReceived: 0, isGameOver: false }));
    setFallingJobs([]);
    setFallingRejections([]);
    setCatcherPos(50);
  };

  const restartGame = () => {
    setGameState(s => ({ ...s, isGameOver: false, score: 0, lives: 3, jobsCaught: 0, rejectionsReceived: 0 }));
    setFallingJobs([]);
    setFallingRejections([]);
    setCatcherPos(50);
  };

  if (gameState.showInstructions) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[300] bg-black/95 flex flex-col items-center justify-center p-8"
      >
        <motion.h2
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-3xl md:text-4xl font-black text-white mb-6 text-center"
        >
          🎯 JOB CATCHER
        </motion.h2>
        
        <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-6 max-w-md w-full mb-6">
          <h3 className="text-emerald-400 font-bold mb-4">How to Play:</h3>
          <ul className="space-y-3 text-zinc-300 text-sm">
            <li>⬅️ ➡️ Use Arrow Keys or A/D to move</li>
            <li>💼 <span className="text-emerald-400">Catch falling job offers</span> for +100 points</li>
            <li>❌ <span className="text-red-400">Avoid rejection emails</span> - you have 3 lives</li>
            <li>🏆 Survive as long as you can!</li>
          </ul>
        </div>

        <div className="flex gap-4">
          <button
            onClick={startGame}
            className="px-8 py-3 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold hover:bg-emerald-500/30 transition-all"
          >
            Start Game 🎮
          </button>
          <button
            onClick={onExit}
            className="px-8 py-3 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-all"
          >
            Exit 🚪
          </button>
        </div>
      </motion.div>
    );
  }

  if (gameState.isGameOver) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[300] bg-black/95 flex flex-col items-center justify-center p-8"
      >
        <motion.h2
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          className="text-4xl md:text-5xl font-black text-red-500 mb-4"
        >
          GAME OVER
        </motion.h2>
        
        <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-8 max-w-md w-full mb-6">
          <div className="text-center space-y-3">
            <p className="text-5xl font-black text-emerald-400">{gameState.score}</p>
            <p className="text-zinc-400 text-sm">Final Score</p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 text-center">
            <div className="bg-emerald-500/10 rounded-xl p-3">
              <p className="text-2xl font-bold text-emerald-400">{gameState.jobsCaught}</p>
              <p className="text-xs text-zinc-500">Jobs Caught</p>
            </div>
            <div className="bg-red-500/10 rounded-xl p-3">
              <p className="text-2xl font-bold text-red-400">{gameState.rejectionsReceived}</p>
              <p className="text-xs text-zinc-500">Rejections Hit</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={restartGame}
            className="px-8 py-3 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold hover:bg-emerald-500/30 transition-all"
          >
            Play Again 🔄
          </button>
          <button
            onClick={onExit}
            className="px-8 py-3 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-all"
          >
            Exit 🚪
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[300] bg-gradient-to-b from-slate-900 to-black"
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4">
        <div className="flex items-center gap-6">
          <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl px-4 py-2">
            <span className="text-xs text-zinc-400">SCORE</span>
            <p className="text-2xl font-black text-emerald-400">{gameState.score}</p>
          </div>
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl px-4 py-2">
            <span className="text-xs text-zinc-400">LIVES</span>
            <p className="text-2xl font-black text-red-400">❤️❤️❤️</p>
          </div>
        </div>
        <button
          onClick={onExit}
          className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-all text-sm"
        >
          Exit 🚪
        </button>
      </div>

      {/* Game Area */}
      <div ref={gameRef} className="relative w-full h-full overflow-hidden">
        {/* Falling Jobs */}
        {fallingJobs.map(job => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute"
            style={{ left: `${job.x}%`, top: `${job.y}%` }}
          >
            <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-lg px-3 py-2 text-center shadow-lg shadow-emerald-500/20">
              <span className="text-xl">{job.job.emoji}</span>
              <p className="text-white text-xs font-bold mt-1">{job.job.title}</p>
              <p className="text-emerald-400 text-[10px]">{job.job.company}</p>
            </div>
          </motion.div>
        ))}

        {/* Falling Rejections */}
        {fallingRejections.map(rej => (
          <motion.div
            key={rej.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute"
            style={{ left: `${rej.x}%`, top: `${rej.y}%` }}
          >
            <div className="bg-red-500/20 border border-red-500/40 rounded-lg px-3 py-2 text-center">
              <span className="text-red-400 text-sm font-mono">{rej.text}</span>
            </div>
          </motion.div>
        ))}

        {/* Catcher */}
        <div
          className="absolute bottom-12 w-24 h-8 bg-cyan-500/30 border-2 border-cyan-400 rounded-lg transition-all duration-75"
          style={{ left: `calc(${catcherPos}% - 48px)` }}
        >
          <div className="absolute inset-x-0 bottom-0 h-2 bg-cyan-400 rounded-b-lg" />
        </div>
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-zinc-600 text-xs">
        Use ← → or A/D to move
      </div>
    </motion.div>
  );
}