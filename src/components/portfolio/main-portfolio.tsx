import { motion, type Variants } from "framer-motion";
import { Github, Twitter, Mail, ExternalLink, Code2, Globe, Sparkles, Cpu, Layers } from "lucide-react";
import { CommandCenter } from "./command-center";

interface MainPortfolioProps {
    onPlaySound?: () => void;
}

export function MainPortfolio({ onPlaySound }: MainPortfolioProps) {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] as const } },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-[auto_1fr_auto] gap-3 w-full max-w-7xl mx-auto h-full overflow-hidden"
    >
      {/* 1. Bio / Hero Card */}
      <motion.div
        variants={item}
        className="md:col-span-2 rounded-3xl bg-zinc-900/50 backdrop-blur-md border border-white/5 p-6 flex flex-col justify-between group overflow-hidden relative"
      >
        <div className="space-y-3 relative z-10">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center mb-4">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white leading-tight">
            Building the architecture of <span className="text-zinc-500">Autonomous Systems.</span>
          </h1>
          <p className="text-zinc-400 text-xs md:text-sm max-w-sm leading-relaxed">
            I'm a Full-Stack Cloud Developer and Co-Founder of Beunec, engineer specializing in distributed AI systems and high-scale cloud infrastructure.
          </p>
        </div>
        
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full -mr-32 -mt-32" />
      </motion.div>

      {/* 2. Featured Project 1: Hyper-Orchestrator (HERO) */}
      <motion.div
        variants={item}
        className="md:col-span-2 rounded-3xl bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 p-6 flex flex-col justify-between group relative overflow-hidden cursor-pointer"
      >
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2 text-emerald-500 mb-1">
            <Cpu className="w-3 h-3" />
            <span className="text-[9px] uppercase tracking-widest font-bold">World's First Zo Orchestrator</span>
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">Hyper-Orchestrator</h3>
          <p className="text-zinc-300 text-xs max-w-md leading-relaxed">
            Built an intelligent task orchestration engine for <b>Zo Computer</b>, achieving 4.2x speedup in task execution through autonomous planner agents.
          </p>
        </div>

        <div className="flex gap-2 relative z-10 mt-4">
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[9px] text-emerald-400 font-mono">Python</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[9px] text-emerald-400 font-mono">AsyncIO</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[9px] text-emerald-400 font-mono">Zo SDK</span>
        </div>

        <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Layers className="w-32 h-32 text-emerald-500" />
        </div>
      </motion.div>

      {/* 3. Tech Stack Card */}
      <motion.div
        variants={item}
        className="md:col-span-1 rounded-3xl bg-zinc-900/50 backdrop-blur-md border border-white/5 p-5 space-y-3"
      >
        <div className="flex items-center gap-2 text-white mb-2">
          <Code2 className="w-3 h-3 text-emerald-500" />
          <h3 className="text-[10px] font-bold uppercase tracking-widest">Master Stack</h3>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {['Python', 'Go', 'TypeScript', 'NextJS', 'Kubernetes', 'AWS', 'GCP', 'PyTorch'].map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/5 text-[9px] text-zinc-400 font-mono">
              {tag}
            </span>
          ))}
        </div>
      </motion.div>

      {/* 4. Experience: Beunec CTO */}
      <motion.div
        variants={item}
        className="md:col-span-2 rounded-3xl bg-zinc-900/50 backdrop-blur-md border border-white/5 p-5 flex flex-col justify-between group h-full"
      >
        <div className="flex justify-between items-start">
            <div className="space-y-0.5">
                <span className="text-[9px] uppercase tracking-widest text-zinc-500">Co-Founder & CTO</span>
                <h3 className="text-lg font-semibold text-white">Beunec Technologies</h3>
            </div>
            <div className="text-[9px] font-mono text-zinc-600 uppercase italic">May 2025 – Present</div>
        </div>
        <p className="text-zinc-400 text-[10px] mt-2 leading-relaxed">
            Architected Beunec Cloud, managing global load balancing for 1k+ users with 99.9% uptime. Managed full infra scaling via AWS and Cloudflare.
        </p>
      </motion.div>

      {/* 5. Experience: Rutgers TA */}
      <motion.div
        variants={item}
        className="md:col-span-1 rounded-3xl bg-zinc-900/50 backdrop-blur-md border border-white/5 p-5 flex flex-col justify-center items-center text-center space-y-1"
      >
        <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <Globe className="w-3 h-3 text-emerald-500" />
        </div>
        <h4 className="text-white text-[10px] font-medium uppercase tracking-widest">Rutgers University</h4>
        <p className="text-zinc-500 text-[9px]">Master's in CS (GPA 3.65)</p>
      </motion.div>

      {/* 6. INTEGRATED TERMINAL CARD (Universal Console) */}
      <motion.div
        variants={item}
        className="md:col-span-4 h-48 md:h-64 relative mt-2"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent rounded-3xl pointer-events-none" />
        <CommandCenter isEmbedded onPlaySound={onPlaySound} />
      </motion.div>

      {/* 7. Footer - Socials */}
      <motion.div
        variants={item}
        className="md:col-span-4 p-3 flex flex-col md:flex-row items-center justify-between text-zinc-600 gap-2 border-t border-white/5"
      >
        <div className="text-[9px] font-mono tracking-widest uppercase">
            © 2026 Prajwal Srinivas
        </div>
        <div className="flex gap-6">
            <a href="mailto:prajwal.srinivas238@gmail.com" className="hover:text-white transition-colors flex items-center gap-1.5 text-[10px]">
                <Mail className="w-3 h-3" /> Email
            </a>
            <a href="https://linkedin.com/in/prajwalsrinivas238" target="_blank" className="hover:text-white transition-colors flex items-center gap-1.5 text-[10px]">
                <ExternalLink className="w-3 h-3" /> LinkedIn
            </a>
            <a href="https://github.com" target="_blank" className="hover:text-white transition-colors flex items-center gap-1.5 text-[10px]">
                <Github className="w-3 h-3" /> GitHub
            </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
