import { motion, type Variants } from "framer-motion";
import { Github, Mail, ExternalLink, Cpu, Database, Coffee, Zap, Layers } from "lucide-react";
import { CommandCenter } from "./command-center";

interface MainPortfolioProps {
    onPlaySound?: () => void;
    onStopMusic?: () => void;
}

export function MainPortfolio({ onPlaySound, onStopMusic }: MainPortfolioProps) {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] as const } },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-4 w-full max-w-5xl mx-auto h-full overflow-y-auto p-4 md:p-6"
    >
      {/* Hero: Hyper-Orchestrator */}
      <motion.div
        variants={item}
        className="rounded-3xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 backdrop-blur-md border border-emerald-500/20 p-6 md:p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
              <Cpu className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-widest">World's First</span>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">Hyper-Orchestrator</h1>
            </div>
          </div>
          
          <p className="text-zinc-300 text-sm md:text-base max-w-2xl leading-relaxed mb-6">
            An intelligent task orchestration engine for <b className="text-emerald-400">Zo Computer</b> that autonomously decomposes high-level goals into parallel sub-tasks, achieving <b className="text-emerald-400">4.2x speedup</b> through adaptive worker pools and self-healing execution.
          </p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-mono">Python</span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-mono">AsyncIO</span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-mono">Zo SDK</span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-mono">Multi-Agent</span>
          </div>
          
          <a 
            href="https://github.com/prajwal2308/hyper-orchestrator" 
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-medium hover:bg-emerald-500/30 transition-colors"
          >
            <Github className="w-4 h-4" /> View on GitHub
          </a>
        </div>
      </motion.div>

      {/* Proactive Retrieval Engine */}
      <motion.div
        variants={item}
        className="rounded-3xl bg-zinc-900/50 backdrop-blur-md border border-white/5 p-6 relative overflow-hidden"
      >
        <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-10 pointer-events-none">
          <Database className="w-24 h-24 text-cyan-500" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <Database className="w-5 h-5 text-cyan-400" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Proactive Retrieval Engine</h2>
          </div>
          
          <p className="text-zinc-400 text-sm max-w-xl leading-relaxed mb-4">
            A semantic search system that anticipates information needs based on conversation context, delivering relevant documents before explicit queries. Built with vector embeddings and LLM-powered intent prediction.
          </p>
          
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-0.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[10px] text-cyan-400 font-mono">LangChain</span>
            <span className="px-2 py-0.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[10px] text-cyan-400 font-mono">Pinecone</span>
            <span className="px-2 py-0.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[10px] text-cyan-400 font-mono">OpenAI</span>
          </div>
        </div>
      </motion.div>

      {/* Terminal + Buy Me Coffee */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Terminal */}
        <div className="md:col-span-2 h-48 md:h-56 relative rounded-3xl overflow-hidden border border-white/5">
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent pointer-events-none" />
          <CommandCenter isEmbedded onPlaySound={onPlaySound} onStopMusic={onStopMusic} />
        </div>
        
        {/* Buy Me Coffee */}
        <div className="rounded-3xl bg-zinc-900/50 backdrop-blur-md border border-white/5 p-5 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center mb-4">
            <Coffee className="w-7 h-7 text-amber-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Support My Work</h3>
          <p className="text-zinc-500 text-xs mb-4">If this project helped you, consider buying me a coffee!</p>
          <a 
            href="https://www.buymeacoffee.com/prajwal" 
            target="_blank"
            className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 text-sm font-medium hover:bg-amber-500/30 transition-colors"
          >
            Buy Me a Coffee
          </a>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        variants={item}
        className="p-4 flex flex-col md:flex-row items-center justify-between text-zinc-600 gap-3 border-t border-white/5 rounded-3xl"
      >
        <div className="text-[10px] font-mono tracking-widest uppercase">
            © 2026 Prajwal Srinivas | Built with Zo Computer
        </div>
        <div className="flex gap-6">
          <a href="mailto:prajwal.srinivas238@gmail.com" className="hover:text-white transition-colors flex items-center gap-1.5 text-[11px]">
            <Mail className="w-3 h-3" /> Email
          </a>
          <a href="https://linkedin.com/in/prajwalsrinivas238" target="_blank" className="hover:text-white transition-colors flex items-center gap-1.5 text-[11px]">
            <ExternalLink className="w-3 h-3" /> LinkedIn
          </a>
          <a href="https://github.com/prajwal2308" target="_blank" className="hover:text-white transition-colors flex items-center gap-1.5 text-[11px]">
            <Github className="w-3 h-3" /> GitHub
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
