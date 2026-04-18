import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Landmark, Clock } from "lucide-react";

interface LoanCounterProps {
  onComplete?: () => void;
}

// Narratives speaking on behalf of ALL international students
const NARRATIVES = [
  "We borrowed against our family home back home.",
  "Our parents co-signed loans they couldn't afford.",
  "We promised to pay it back with our first US paycheck.",
  "90 days after graduation, our OPT expires.",
  "No job means we return home. With debt. With nothing.",
  "Every second costs $0.25. This is the price of waiting.",
  "Our families believed in our American dream.",
  "We have one shot. No safety net.",
];

export function LoanCounter({ onComplete }: LoanCounterProps) {
  const [total, setTotal] = useState(60000);
  const [days, setDays] = useState(290);
  const [narrativeIndex, setNarrativeIndex] = useState(0);
  const [prevTotal, setPrevTotal] = useState(60000);
  const countRef = useRef<NodeJS.Timeout | null>(null);
  const daysRef = useRef<NodeJS.Timeout | null>(null);
  const narrativeRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Increment $100 every 0.4 seconds (smooth)
    countRef.current = setInterval(() => {
      setPrevTotal(total);
      setTotal((prev) => prev + 100);
    }, 400);

    // Increment days every 10 seconds
    daysRef.current = setInterval(() => {
      setDays((prev) => prev + 1);
    }, 10000);

    // Cycle narratives every 4 seconds
    narrativeRef.current = setInterval(() => {
      setNarrativeIndex((prev) => (prev + 1) % NARRATIVES.length);
    }, 4000);

    return () => {
      if (countRef.current) clearInterval(countRef.current);
      if (daysRef.current) clearInterval(daysRef.current);
      if (narrativeRef.current) clearInterval(narrativeRef.current);
    };
  }, []);

  const interest = Math.round((total - 45000) * 0.35);
  const percentIncrease = ((total - 45000) / 45000) * 100;

  const formatNumber = (num: number) => {
    return num.toLocaleString("en-US");
  };

  // Split number into parts for individual digit animation
  const totalStr = formatNumber(total);
  const prevTotalStr = formatNumber(prevTotal);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black px-4"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-2 mb-8"
      >
        <Landmark className="w-5 h-5 text-red-500" />
        <span className="text-red-500 font-mono text-xs uppercase tracking-[0.3em]">
          Education Loan
        </span>
      </motion.div>

      {/* MAIN COUNTER - Smooth counting animation */}
      <div className="relative">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center"
        >
          <div 
            className="text-[5rem] md:text-[8rem] lg:text-[10rem] font-black text-red-500 tracking-tight tabular-nums"
            style={{
              textShadow: "0 0 60px rgba(220,38,38,0.5), 0 0 120px rgba(220,38,38,0.3)",
            }}
          >
            ${totalStr}
          </div>
          
          {/* Subtle scale pulse on change */}
          <motion.div
            key={total}
            initial={{ scale: 1.02 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            className="absolute inset-0 pointer-events-none"
          />
        </motion.div>
      </div>

      {/* Narrative - Speaking for all international students */}
      <motion.p
        key={narrativeIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="text-zinc-400 text-center max-w-md mt-8 text-sm md:text-base leading-relaxed font-light"
      >
        {NARRATIVES[narrativeIndex]}
      </motion.p>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-3 gap-4 md:gap-8 mt-12 text-center"
      >
        <div>
          <div className="text-zinc-600 text-[10px] uppercase tracking-wider mb-1">Original</div>
          <div className="text-zinc-300 font-mono text-sm md:text-base">$45,000</div>
        </div>
        <div>
          <div className="text-zinc-600 text-[10px] uppercase tracking-wider mb-1">Interest</div>
          <div className="text-red-400 font-mono text-sm md:text-base">+${formatNumber(interest)}</div>
        </div>
        <div>
          <div className="text-zinc-600 text-[10px] uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
            <Clock className="w-3 h-3" /> Days
          </div>
          <div className="text-zinc-300 font-mono text-sm md:text-base">{days}</div>
        </div>
      </motion.div>

      {/* Warning badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-8 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30"
      >
        <span className="text-red-400 font-mono text-xs">
          +{percentIncrease.toFixed(1)}% SINCE GRADUATION
        </span>
      </motion.div>
    </motion.div>
  );
}
