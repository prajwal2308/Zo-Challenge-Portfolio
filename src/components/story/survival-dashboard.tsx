import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Flame, Home, Utensils, Car, Heart, Clock, TrendingDown } from "lucide-react";

interface SurvivalDashboardProps {
  onComplete?: () => void;
}

// Narratives for survival struggles
const NARRATIVES = [
  "We walk 40 minutes to save $2.75 on subway fare.",
  "We skip meals when the dining dollars run out.",
  "We don't tell our parents how hard it really is.",
  "We calculate every expense in rupees.",
  "We pretend everything is fine on video calls home.",
  "We choose between groceries and interview clothes.",
];

export function SurvivalDashboard({ onComplete }: SurvivalDashboardProps) {
  const [daysLeft, setDaysLeft] = useState(47);
  const [narrativeIndex, setNarrativeIndex] = useState(0);
  const narrativeRef = useRef<NodeJS.Timeout | null>(null);
  const drainRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Drain 1 day every 2 seconds for dramatic effect
    drainRef.current = setInterval(() => {
      setDaysLeft((prev) => Math.max(0, prev - 1));
    }, 2000);

    // Cycle narratives every 3 seconds
    narrativeRef.current = setInterval(() => {
      setNarrativeIndex((prev) => (prev + 1) % NARRATIVES.length);
    }, 3000);

    return () => {
      if (narrativeRef.current) clearInterval(narrativeRef.current);
      if (drainRef.current) clearInterval(drainRef.current);
    };
  }, []);

  // Monthly expenses
  const expenses = [
    { name: "Rent", amount: 800, icon: Home },
    { name: "Food", amount: 300, icon: Utensils },
    { name: "Transport", amount: 127, icon: Car },
    { name: "Insurance", amount: 200, icon: Heart },
  ];

  const totalBurn = expenses.reduce((sum, e) => sum + e.amount, 0);
  const savings = 7000;
  const progress = ((savings - (90 - daysLeft) * (totalBurn / 30)) / savings) * 100;

  const formatNumber = (num: number) => {
    return num.toLocaleString("en-US");
  };

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
        className="flex items-center gap-2 mb-6"
      >
        <Flame className="w-5 h-5 text-orange-500" />
        <span className="text-orange-500 font-mono text-xs uppercase tracking-[0.3em]">
          Survival Mode
        </span>
      </motion.div>

      {/* MAIN COUNTER - Days Left */}
      <div className="relative text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="text-zinc-500 font-mono text-xs uppercase tracking-widest mb-2">
            Days of runway left
          </div>
          <motion.div
            key={daysLeft}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-[6rem] md:text-[9rem] font-black tabular-nums"
            style={{
              color: daysLeft < 30 ? "#f97316" : "#fbbf24",
              textShadow: `0 0 60px ${daysLeft < 30 ? "rgba(249,115,22,0.5)" : "rgba(251,191,36,0.5)"}`,
            }}
          >
            {daysLeft}
          </motion.div>
        </motion.div>
      </div>

      {/* Narrative */}
      <motion.p
        key={narrativeIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="text-zinc-400 text-center max-w-md mt-6 text-sm md:text-base leading-relaxed font-light"
      >
        {NARRATIVES[narrativeIndex]}
      </motion.p>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-md mt-8"
      >
        <div className="flex justify-between text-xs text-zinc-500 mb-2">
          <span>Savings remaining</span>
          <span>{Math.max(0, progress).toFixed(0)}%</span>
        </div>
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: `${Math.max(0, progress)}%` }}
            transition={{ duration: 0.5 }}
            className="h-full rounded-full"
            style={{
              background: progress < 30 
                ? "linear-gradient(90deg, #dc2626, #f97316)" 
                : "linear-gradient(90deg, #f97316, #fbbf24)",
            }}
          />
        </div>
      </motion.div>

      {/* Expense breakdown */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8"
      >
        {expenses.map((expense, i) => (
          <div key={i} className="bg-zinc-900/50 border border-white/5 rounded-lg p-3 text-center">
            <expense.icon className="w-4 h-4 text-zinc-500 mx-auto mb-1" />
            <div className="text-zinc-400 text-xs">${formatNumber(expense.amount)}</div>
            <div className="text-zinc-600 text-[10px] uppercase tracking-wider">{expense.name}</div>
          </div>
        ))}
      </motion.div>

      {/* Monthly burn */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-6 flex items-center gap-2"
      >
        <TrendingDown className="w-4 h-4 text-red-400" />
        <span className="text-zinc-400 font-mono text-sm">
          ${formatNumber(totalBurn)}/month burn rate
        </span>
      </motion.div>

      {/* Warning badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="mt-6 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30"
      >
        <span className="text-orange-400 font-mono text-xs">
          {daysLeft < 30 ? "CRITICAL: LESS THAN 30 DAYS" : "RUNNING OUT OF RUNWAY"}
        </span>
      </motion.div>
    </motion.div>
  );
}
