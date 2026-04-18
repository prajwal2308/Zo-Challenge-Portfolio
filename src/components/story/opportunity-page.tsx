import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TextScramble } from "@/components/ui/text-scramble";

interface OpportunityPageProps {
  onComplete?: () => void;
  playRapid?: () => void;
}

export function OpportunityPage({ onComplete, playRapid }: OpportunityPageProps) {
  const [phase, setPhase] = useState<'title' | 'opportunity' | 'final'>('title');

  // Phase 1: THE WAITING ROOM title (3 seconds)
  useEffect(() => {
    if (phase === 'title') {
      const timer = setTimeout(() => {
        setPhase('opportunity');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Phase 2: FOR ONE OPPORTUNITY (3.5 seconds)
  useEffect(() => {
    if (phase === 'opportunity') {
      const timer = setTimeout(() => {
        setPhase('final');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Phase 3: Final completion
  useEffect(() => {
    if (phase === 'final' && onComplete) {
      const timer = setTimeout(onComplete, 1500);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black overflow-hidden"
    >
      {/* Phase 1: THE WAITING ROOM Title */}
      <AnimatePresence mode="wait">
        {phase === 'title' && (
          <motion.div
            key="title"
            initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            className="flex flex-col items-center leading-[0.8] mix-blend-screen"
          >
            <TextScramble
              className="text-zinc-50 text-[5.5rem] md:text-[9rem] lg:text-[13rem] font-black tracking-tighter uppercase"
              style={{ textShadow: "0 20px 50px rgba(0,0,0,0.9), 0 0 100px rgba(255,255,255,0.3)" }}
              duration={1.2}
              speed={0.03}
              characterSet="01!*&()—_[]THE"
              onScrambleStep={playRapid}
            >
              THE
            </TextScramble>
            <TextScramble
              className="text-red-500 text-[5.5rem] md:text-[9rem] lg:text-[13rem] font-black tracking-tighter uppercase"
              style={{ textShadow: "0 0 80px rgba(220,38,38,0.6), 0 20px 50px rgba(0,0,0,0.9)" }}
              duration={1.5}
              speed={0.04}
              characterSet="01!*&()—_[]WAITING"
              onScrambleStep={playRapid}
            >
              WAITING
            </TextScramble>
            <TextScramble
              className="text-zinc-50 text-[5.5rem] md:text-[9rem] lg:text-[13rem] font-black tracking-tighter uppercase"
              style={{ textShadow: "0 20px 50px rgba(0,0,0,0.9), 0 0 100px rgba(255,255,255,0.3)" }}
              duration={1.8}
              speed={0.03}
              characterSet="01!*&()—_[]ROOM"
              onScrambleStep={playRapid}
            >
              ROOM
            </TextScramble>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 2: FOR ONE OPPORTUNITY */}
      <AnimatePresence>
        {phase === 'opportunity' && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-center flex flex-col items-center"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-zinc-500 font-mono text-sm md:text-base uppercase tracking-[0.3em] mb-4"
            >
              Hundreds of rejections. One dream.
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black text-emerald-400 tracking-tight"
              style={{ textShadow: "0 0 60px rgba(16, 185, 129, 0.5)" }}
            >
              FOR ONE OPPORTUNITY
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 3: Final Welcome */}
      <AnimatePresence>
        {phase === 'final' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            className="text-center"
          >
            <motion.div
              animate={{ 
                textShadow: [
                  "0 0 20px rgba(16, 185, 129, 0.3)",
                  "0 0 60px rgba(16, 185, 129, 0.6)",
                  "0 0 20px rgba(16, 185, 129, 0.3)",
                ]
              }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-emerald-400 font-mono text-sm md:text-base uppercase tracking-[0.4em]"
            >
              THANK YOU FOR YOUR TIME, WELCOME!!!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
