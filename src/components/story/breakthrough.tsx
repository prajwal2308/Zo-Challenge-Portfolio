import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Code, Rocket, Target, ArrowRight } from "lucide-react";

interface BreakthroughProps {
  onComplete?: () => void;
}

const TRANSFORMATION = [
  { text: "WHILE THEY REJECTED US", icon: ArrowRight },
  { text: "WE STILL BUILD & WE RAISE", icon: Rocket },
  { text: "THE STORY OF HUNDREDs and ME", icon: ArrowRight },
];

export function Breakthrough({ onComplete }: BreakthroughProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step < TRANSFORMATION.length) {
      const timer = setTimeout(() => {
        setStep((prev) => prev + 1);
      }, 1800);
      return () => clearTimeout(timer);
    } else if (onComplete) {
      const timer = setTimeout(onComplete, 500);
      return () => clearTimeout(timer);
    }
  }, [step, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black overflow-hidden"
    >
      <AnimatePresence mode="wait">
        {step < TRANSFORMATION.length && (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 1.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6"
            >
              {(() => {
                const Icon = TRANSFORMATION[step].icon;
                return <Icon className="w-10 h-10 md:w-14 md:h-14 text-red-400" />;
              })()}
            </motion.div>

            <motion.h2
              className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight"
              style={{ textShadow: "0 0 40px rgba(208, 45, 0, 1)" }}
            >
              {TRANSFORMATION[step].text}
            </motion.h2>

            <div className="flex gap-3 mt-10">
              {TRANSFORMATION.map((_, i) => (
                <motion.div
                  key={i}
                  className={`w-3 h-3 rounded-full ${i <= step ? "bg-red-400" : "bg-zinc-700"}`}
                  animate={i === step ? { scale: [1, 1.5, 1] } : {}}
                  transition={{ duration: 0.4 }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
