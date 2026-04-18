import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TextScramble } from "@/components/ui/text-scramble";
import { FastForward } from "lucide-react";
import { RejectionCards } from "@/components/story/rejection-cards";
import { useAudioTick } from "@/hooks/use-audio-tick";
import { OPTTimer } from "@/components/story/opt-timer";
import { CommandCenter } from "@/components/portfolio/command-center";
import { MainPortfolio } from "@/components/portfolio/main-portfolio";

export default function WaitingRoomPage() {
  const [stage, setStage] = useState<'initial' | 'waiting' | 'countdown' | 'zooming' | 'rejections' | 'home'>('initial');
  const [isRevealed, setIsRevealed] = useState(false);
  const { playTick, playRapid, startSadMusic, stopSadMusic } = useAudioTick();

  const skipToHome = () => {
    stopSadMusic();
    setStage('home');
  };

  useEffect(() => {
    if (stage === 'waiting') {
      startSadMusic();
    }
    if (stage === 'home') {
      // Music now stops automatically when the track ends via onended listener in useAudioTick
    }
  }, [stage, startSadMusic, stopSadMusic]);

  useEffect(() => {
    if (stage === 'waiting') {
      const timer = setTimeout(() => setStage('countdown'), 3500);
      return () => clearTimeout(timer);
    }
    if (stage === 'countdown') {
      const timer = setTimeout(() => setStage('zooming'), 6500);
      return () => clearTimeout(timer);
    }
    if (stage === 'zooming') {
      const timer = setTimeout(() => setStage('rejections'), 1500);
      return () => clearTimeout(timer);
    }
    if (stage === 'rejections') {
      const timer = setTimeout(() => setStage('home'), 7500);
      return () => clearTimeout(timer);
    }
  }, [stage, playTick]);

  return (
    <div
      className="relative flex h-screen w-full items-center justify-center bg-black overflow-hidden cursor-pointer"
      onClick={() => {
        if (stage === 'initial') {
          playTick();
          setStage('waiting');
        }
      }}
    >
      <AnimatePresence>
        {stage !== 'initial' && stage !== 'home' && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              skipToHome();
            }}
            className="absolute bottom-12 z-[100] flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white/40 font-mono text-xs tracking-widest uppercase transition-colors"
          >
            <FastForward className="w-4 h-4" />
            Fast Forward
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isRevealed ? (
          <motion.div key="splash" className="contents">
            <AnimatePresence>
              {stage === 'initial' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gradient-to-tr from-zinc-900 to-black mix-blend-screen"
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {stage === 'initial' && (
                <motion.div
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="z-10 text-zinc-500 font-mono text-[10px] tracking-[0.3em] uppercase animate-pulse select-none"
                >
                  Click to enter
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {(stage === 'waiting' || stage === 'countdown' || stage === 'zooming') && (
                <motion.div
                  initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{ duration: 2.5, ease: "easeOut" }}
                  exit={{ opacity: 0 }}
                  className="z-10 flex flex-col items-center justify-center gap-4 origin-center"
                  style={{ perspective: 1000, transformStyle: "preserve-3d" }}
                >
                  <div className="flex flex-col items-center leading-[0.8] mix-blend-screen overflow-visible will-change-transform whitespace-nowrap mt-4">
                    <motion.div
                      animate={{ opacity: stage === 'countdown' || stage === 'zooming' ? 0 : 1, y: stage === 'countdown' || stage === 'zooming' ? -50 : 0 }}
                      transition={{ duration: 1 }}
                    >
                      <TextScramble
                        className="text-zinc-50 text-[5.5rem] md:text-[9rem] lg:text-[13rem] font-black tracking-tighter uppercase inline-block origin-center"
                        style={{ textShadow: "0 20px 50px rgba(0,0,0,0.9), 0 0 100px rgba(255,255,255,0.3)" }}
                        duration={1.2}
                        speed={0.03}
                        characterSet="01!*&()—_[]THE"
                        onScrambleStep={playRapid}
                      >
                        THE
                      </TextScramble>
                    </motion.div>
                    <motion.div
                      className="origin-center inline-block will-change-transform"
                      style={{ transformOrigin: "50% 50%" }}
                      animate={stage === 'zooming' ? {
                        scale: [1, 5, 25],
                        rotateX: [0, 5, 10],
                        rotateZ: [0, -2, -5],
                        opacity: [1, 1, 0]
                      } : { scale: 1, opacity: 1 }}
                      transition={stage === 'zooming' ? { duration: 1.5, times: [0, 0.8, 1], ease: "easeIn" } : { duration: 0.3 }}
                    >
                      {stage === 'countdown' || stage === 'zooming' ? (
                        <div
                          className="text-[5.5rem] md:text-[9rem] lg:text-[13rem] font-black uppercase inline-block"
                          style={{ color: "#dc2626" }}
                        >
                          <OPTTimer />
                        </div>
                      ) : (
                        <TextScramble
                          className="text-[5.5rem] md:text-[9rem] lg:text-[13rem] font-black tracking-tighter uppercase inline-block"
                          style={{
                            textShadow: "0 0 80px rgba(220,38,38,0.6), 0 20px 50px rgba(0,0,0,0.9)",
                            color: "#dc2626"
                          }}
                          duration={1.5}
                          speed={0.04}
                          characterSet="01!*&()—_[]WAITING"
                          onScrambleStep={playRapid}
                        >
                          WAITING
                        </TextScramble>
                      )}
                    </motion.div>
                    <motion.div
                      animate={{ opacity: stage === 'countdown' || stage === 'zooming' ? 0 : 1, y: stage === 'countdown' || stage === 'zooming' ? 50 : 0 }}
                      transition={{ duration: 1 }}
                    >
                      <TextScramble
                        className="text-zinc-50 text-[5.5rem] md:text-[9rem] lg:text-[13rem] font-black tracking-tighter uppercase inline-block origin-center"
                        style={{ textShadow: "0 20px 50px rgba(0,0,0,0.9), 0 0 100px rgba(255,255,255,0.3)" }}
                        duration={1.8}
                        speed={0.03}
                        characterSet="01!*&()—_[]ROOM"
                        onScrambleStep={playRapid}
                      >
                        ROOM
                      </TextScramble>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {(stage === 'waiting' || stage === 'zooming' || stage === 'home') && (
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={
                    stage === 'home' ? { opacity: 0.05, scale: 1 } :
                    stage === 'zooming' ? { opacity: 0, scale: 1.5 } : 
                    { opacity: 0.15, scale: 1 }
                  }
                  transition={stage === 'zooming' ? { duration: 2 } : { delay: 1, duration: 4 }}
                  exit={{ opacity: 0 }}
                  src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop"
                  className="absolute inset-0 w-full h-full object-cover mix-blend-overlay pointer-events-none select-none"
                  alt="Abstract dark background"
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {stage === 'rejections' && (
                <RejectionCards />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {stage === 'home' && (
                <motion.div
                  initial={{ opacity: 0, filter: "blur(20px)", scale: 0.9 }}
                  animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                  exit={{ opacity: 0, filter: "blur(20px)", scale: 1.1 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black"
                >
                  <TextScramble
                    className="text-white text-4xl md:text-6xl lg:text-8xl font-bold tracking-[0.2em] uppercase font-mono text-center px-4 mix-blend-screen"
                    duration={3.5}
                    speed={0.05}
                    characterSet="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                  >
                    PRAJWAL SRINIVAS
                  </TextScramble>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    transition={{ delay: 3, duration: 3 }}
                    className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-900 pointer-events-none"
                  />
                  <CommandCenter onPlaySound={playTick} onHome={() => setIsRevealed(true)} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="portfolio"
            initial={{ opacity: 0, filter: "blur(20px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 z-50 bg-black flex flex-col p-4 md:p-8 overflow-hidden"
          >
            <MainPortfolio onPlaySound={playTick} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
