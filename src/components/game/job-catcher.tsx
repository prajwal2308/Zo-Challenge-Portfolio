import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

const JOBS = [
  { title: "Backend Eng", company: "Google", color: "#22d3ee" },
  { title: "Full Stack", company: "Meta", color: "#818cf8" },
  { title: "Cloud Arch", company: "AWS", color: "#34d399" },
  { title: "AI/ML Eng", company: "OpenAI", color: "#f472b6" },
  { title: "DevOps", company: "Stripe", color: "#a78bfa" },
  { title: "Data Sci", company: "Databricks", color: "#fb923c" },
];

const REJECTS = ["Rejected", "Ghosted", "No Fit", "No Reply", "Overqualified"];

interface FallingItem {
  id: number;
  x: number;
  y: number;
  vy: number;
  type: "job" | "reject";
  label: string;
  sub: string;
  color: string;
}

export function JobCatcher({ onExit }: { onExit?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef({
    started: false,
    over: false,
    score: 0,
    lives: 3,
    combo: 0,
    level: 1,
    catcherX: 0,
    targetX: 0,
    items: [] as FallingItem[],
    lastSpawn: 0,
    idSeq: 0,
    shake: 0,
    W: 0,
    H: 0,
  });
  const rafRef = useRef<number>(0);
  
  const [screen, setScreen] = useState<"title" | "playing" | "over">("title");
  const [hud, setHud] = useState({ score: 0, lives: 3, combo: 0, level: 1 });

  const resize = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.width = c.offsetWidth * window.devicePixelRatio;
    c.height = c.offsetHeight * window.devicePixelRatio;
    gameRef.current.W = c.width;
    gameRef.current.H = c.height;
    if (!gameRef.current.started) {
      gameRef.current.catcherX = c.width / 2;
      gameRef.current.targetX = c.width / 2;
    }
  }, []);

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  const spawnItem = useCallback((W: number) => {
    const g = gameRef.current;
    const dpr = window.devicePixelRatio;
    const isJob = Math.random() > 0.30;
    const job = JOBS[Math.floor(Math.random() * JOBS.length)];
    const rej = REJECTS[Math.floor(Math.random() * REJECTS.length)];
    g.items.push({
      id: g.idSeq++,
      x: (0.1 + Math.random() * 0.8) * W,
      y: -30 * dpr,
      vy: (1.8 + g.level * 0.35 + Math.random() * 0.8) * dpr,
      type: isJob ? "job" : "reject",
      label: isJob ? job.title : rej,
      sub: isJob ? job.company : "x miss",
      color: isJob ? job.color : "#ef4444",
    });
  }, []);

  const loop = useCallback((ts: number) => {
    const c = canvasRef.current;
    if (!c) { rafRef.current = requestAnimationFrame(loop); return; }
    const ctx = c.getContext("2d")!;
    const g = gameRef.current;
    const { W, H } = g;
    const dpr = window.devicePixelRatio;

    if (g.started && !g.over) {
      g.catcherX += (g.targetX - g.catcherX) * 0.15;
      
      const gap = Math.max(600, 1300 - g.level * 70);
      if (ts - g.lastSpawn > gap) { spawnItem(W); g.lastSpawn = ts; }

      const CY = H - 70 * dpr;
      const CWH = 55 * dpr;
      const BAND = 22 * dpr;

      g.items = g.items.filter(item => {
        item.y += item.vy;
        
        if (Math.abs(item.y - CY) < BAND && Math.abs(item.x - g.catcherX) < CWH + 60 * dpr) {
          if (item.type === "job") {
            g.combo++;
            const mult = Math.min(g.combo, 8);
            const pts = 100 * mult;
            g.score += pts;
            g.level = Math.floor(g.score / 1200) + 1;
          } else {
            g.combo = 0;
            g.lives = Math.max(0, g.lives - 1);
            g.shake = 14;
            if (g.lives <= 0) { g.over = true; setScreen("over"); }
          }
          return false;
        }
        return item.y < H + 60 * dpr;
      });
    }

    // Draw background
    ctx.fillStyle = "#020609";
    ctx.fillRect(0, 0, W, H);

    // Draw grid
    ctx.strokeStyle = "rgba(56,189,248,0.04)";
    ctx.lineWidth = 1;
    const gs = 55 * dpr;
    for (let x = 0; x < W; x += gs) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += gs) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // Draw items
    for (const item of g.items) {
      const w = 130 * dpr;
      const h = 42 * dpr;
      const lx = item.x - w / 2;
      const ly = item.y - h / 2;
      
      ctx.globalAlpha = 0.93;
      ctx.fillStyle = item.color + "18";
      ctx.beginPath();
      ctx.roundRect(lx, ly, w, h, 10 * dpr);
      ctx.fill();
      ctx.strokeStyle = item.color + "70";
      ctx.lineWidth = 1.5 * dpr;
      ctx.stroke();
      ctx.shadowColor = item.color;
      ctx.shadowBlur = 14 * dpr;
      ctx.strokeStyle = item.color + "28";
      ctx.lineWidth = 4 * dpr;
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      
      ctx.font = `700 ${13 * dpr}px monospace`;
      ctx.fillStyle = item.color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(item.label, item.x, item.y - 7 * dpr);
      ctx.font = `500 ${10 * dpr}px monospace`;
      ctx.fillStyle = item.color + "90";
      ctx.fillText(item.sub, item.x, item.y + 8 * dpr);
    }

    // Draw catcher
    if (g.started && !g.over) {
      const BW = 110 * dpr;
      const BH = 18 * dpr;
      const ly = H - 70 * dpr;
      const lx = g.catcherX - BW / 2;
      const r = BH / 2;
      
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 24 * dpr;
      ctx.strokeStyle = "#38bdf820";
      ctx.lineWidth = 6 * dpr;
      ctx.beginPath();
      ctx.roundRect(lx - 2, ly - 2, BW + 4, BH + 4, r + 2);
      ctx.stroke();
      
      const grad = ctx.createLinearGradient(lx, 0, lx + BW, 0);
      grad.addColorStop(0, "#0284c7");
      grad.addColorStop(0.4, "#38bdf8");
      grad.addColorStop(0.6, "#7dd3fc");
      grad.addColorStop(1, "#0284c7");
      ctx.beginPath();
      ctx.roundRect(lx, ly, BW, BH, r);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    setHud({ score: g.score, lives: g.lives, combo: g.combo, level: g.level });
    rafRef.current = requestAnimationFrame(loop);
  }, [spawnItem]);

  useEffect(() => {
    gameRef.current.lastTime = performance.now();
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [loop]);

  const handlePointer = useCallback((clientX: number) => {
    const c = canvasRef.current;
    if (!c) return;
    const rect = c.getBoundingClientRect();
    const px = ((clientX - rect.left) / rect.width) * gameRef.current.W;
    const dpr = window.devicePixelRatio;
    gameRef.current.targetX = Math.max(60 * dpr, Math.min(gameRef.current.W - 60 * dpr, px));
  }, []);

  const startGame = useCallback(() => {
    const g = gameRef.current;
    g.started = true;
    g.over = false;
    g.score = 0;
    g.lives = 3;
    g.combo = 0;
    g.level = 1;
    g.items = [];
    g.lastSpawn = 0;
    g.shake = 0;
    g.catcherX = g.W / 2;
    g.targetX = g.W / 2;
    setScreen("playing");
  }, []);

  const hearts = Array.from({ length: 3 }, (_, i) => i < hud.lives);

  return (
    <div className="fixed inset-0 z-[300] overflow-hidden" style={{ background: "#020609" }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full touch-none"
        style={{ cursor: screen === "playing" ? "none" : "default" }}
        onMouseMove={e => screen === "playing" && handlePointer(e.clientX)}
        onTouchMove={e => { e.preventDefault(); screen === "playing" && handlePointer(e.touches[0].clientX); }}
        onTouchStart={e => screen === "playing" && handlePointer(e.touches[0].clientX)}
      />

      {screen === "playing" && (
        <div className="absolute inset-x-0 top-0 flex items-start justify-between px-5 pt-4 pointer-events-none">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-[9px] text-sky-400/50 tracking-[0.2em] uppercase font-mono">Score</span>
              <span className="text-2xl font-black tabular-nums font-mono" style={{ color: "#38bdf8", textShadow: "0 0 20px #38bdf860" }}>
                {hud.score.toLocaleString()}
              </span>
            </div>
            {hud.combo > 1 && (
              <div className="text-xs font-black font-mono mt-0.5 animate-pulse" style={{ color: "#fbbf24", textShadow: "0 0 10px #fbbf2470" }}>
                COMBO x{Math.min(hud.combo, 8)}
              </div>
            )}
          </div>
          <div className="text-center">
            <div className="text-[9px] text-slate-600 tracking-[0.2em] uppercase font-mono">Level</div>
            <div className="text-lg font-black font-mono" style={{ color: "#a78bfa" }}>{hud.level}</div>
          </div>
          <div className="flex flex-col items-end gap-2 pointer-events-auto">
            <button onClick={onExit} className="text-[10px] px-3 py-1 rounded border border-slate-800 text-slate-600 hover:text-slate-300 hover:border-slate-600 transition-colors font-mono tracking-widest">
              EXIT
            </button>
            <div className="flex gap-1.5 mt-1">
              {hearts.map((alive, i) => (
                <div key={i} className="w-3 h-3 rounded-full transition-all duration-300"
                  style={{ background: alive ? "#f43f5e" : "#1e293b", boxShadow: alive ? "0 0 8px #f43f5e80" : "none" }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {screen === "title" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-8">
          <div className="text-center">
            <div className="text-5xl font-black tracking-tight font-mono mb-2" style={{ color: "#38bdf8", textShadow: "0 0 40px #38bdf870" }}>
              JOB CATCHER
            </div>
            <div className="text-slate-500 text-sm font-mono tracking-wider">Catch offers · Dodge rejections</div>
          </div>
          <div className="flex flex-col gap-2 text-sm font-mono text-slate-500 max-w-xs w-full">
            {[["Move", "Mouse / touch to steer"], ["Green cards", "Catch for points"], ["Red cards", "Dodge — lose a life"], ["Combos", "Stack for x8 bonus"]].map(([k, v]) => (
              <div key={k} className="flex gap-3">
                <span className="text-slate-400 w-24 shrink-0">{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>
          <button onClick={startGame} className="px-12 py-3 rounded-xl font-black text-lg font-mono tracking-widest transition-all hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(135deg, #0ea5e9, #6366f1)", boxShadow: "0 0 40px #38bdf840", color: "#fff" }}>
            START
          </button>
        </div>
      )}

      {screen === "over" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-8"
          style={{ backdropFilter: "blur(10px)", background: "rgba(2,6,9,0.88)" }}>
          <div className="text-center">
            <div className="text-slate-500 font-mono text-xs tracking-[0.3em] uppercase mb-3">Game Over</div>
            <div className="text-7xl font-black tabular-nums font-mono" style={{ color: "#38bdf8", textShadow: "0 0 50px #38bdf870" }}>
              {hud.score.toLocaleString()}
            </div>
            <div className="text-slate-500 font-mono text-sm mt-2">Final Score</div>
          </div>
          <div className="flex flex-col gap-3 w-full max-w-[220px]">
            <button onClick={startGame} className="w-full py-3 rounded-xl font-black font-mono tracking-widest transition-all hover:scale-105 active:scale-95 text-base"
              style={{ background: "linear-gradient(135deg, #0ea5e9, #6366f1)", boxShadow: "0 0 30px #38bdf850", color: "#fff" }}>
              PLAY AGAIN
            </button>
            {onExit && (
              <button onClick={onExit} className="w-full py-3 rounded-xl font-black font-mono tracking-widest text-base border border-slate-800 text-slate-500 hover:text-slate-200 hover:border-slate-600 transition-all">
                EXIT
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default JobCatcher;
