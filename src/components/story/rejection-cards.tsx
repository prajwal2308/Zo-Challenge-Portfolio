import { useEffect } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { useAudioTick } from "@/hooks/use-audio-tick";

const REJECTIONS = [
  // Wave 1
  { text: "Thank you for your interest. Unfortunately, we have decided to move forward with other candidates.", delay: 0.2, x: "-35vw", y: "-35vh", rotation: -2 },
  { text: "Due to the high volume of applications, we cannot offer individual feedback.", delay: 0.6, x: "35vw", y: "25vh", rotation: 3 },
  // Wave 2
  { text: "Please note: We strictly do not offer visa sponsorship for this role.", delay: 1.0, x: "-38vw", y: "30vh", rotation: -4 },
  { text: "While your background is very impressive, we need someone with 3+ years of experience.", delay: 1.3, x: "25vw", y: "-35vh", rotation: 5 },
  // Wave 3
  { text: "Your application for Software Engineer (New Grad) has been declined.", delay: 1.6, x: "-20vw", y: "40vh", rotation: -1 },
  { text: "After careful review of your qualifications, we will not be proceeding.", delay: 1.8, x: "38vw", y: "-10vh", rotation: 4 },
  // Wave 4
  { text: "Requirement: Must be a US Citizen or Permanent Resident.", delay: 2.1, x: "-5vw", y: "-42vh", rotation: -3 },
  { text: "Unfortunately, this role does not support OPT/CPT/F-1 candidates.", delay: 2.4, x: "-42vw", y: "-15vh", rotation: 6 },
  // Wave 5
  { text: "The position has been permanently closed or put on hold.", delay: 2.7, x: "32vw", y: "45vh", rotation: -2 },
  { text: "We have reviewed your resume and decided not to move forward.", delay: 3.0, x: "15vw", y: "-45vh", rotation: 1 },
  // Wave 6
  { text: "Automated Reply: Application Status Update", delay: 3.2, x: "-25vw", y: "15vh", rotation: -5 },
  { text: "We wish you the best of luck in your job search.", delay: 3.4, x: "10vw", y: "38vh", rotation: 3 },
  // Wave 7
  { text: "Status: Not Selected", delay: 3.5, x: "-20vw", y: "-20vh", rotation: 4 },
  { text: "Status: Not Selected", delay: 3.6, x: "20vw", y: "-5vh", rotation: -3 },
  { text: "Status: Not Selected", delay: 3.7, x: "-10vw", y: "10vh", rotation: 2 },
  { text: "Status: Not Selected", delay: 3.8, x: "15vw", y: "15vh", rotation: -4 },
  // Wave 8 - Overwhelming cluster
  { text: "Status: Rejected", delay: 3.9, x: "-30vw", y: "0vh", rotation: -6 },
  { text: "Status: Rejected", delay: 4.0, x: "40vw", y: "10vh", rotation: 5 },
  { text: "Status: Rejected", delay: 4.1, x: "0vw", y: "25vh", rotation: 3 },
  { text: "Status: Rejected", delay: 4.2, x: "5vw", y: "-25vh", rotation: -2 },
  // Final Hero Hit
  { text: "REJECTED", delay: 4.8, x: "0vw", y: "0vh", rotation: -5, isStamp: true },
];

export function RejectionCards() {
  const { playSmoothNotif, playStampSlam } = useAudioTick();

  useEffect(() => {
    // Audio triggers removed per user request to focus on background atmosphere
  }, [playSmoothNotif, playStampSlam]);

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none overflow-hidden">
      {REJECTIONS.map((msg, i) => {
         if ('isStamp' in msg && msg.isStamp) {
           return (
             <motion.div
               key={i}
               initial={{ opacity: 0, scale: 6, rotateZ: msg.rotation - 25 }}
               animate={{ opacity: 1, scale: 1, rotateZ: msg.rotation }}
               // Custom bezier easing pushes past 1.0 into a rigid physical bounce
               transition={{ delay: msg.delay, duration: 0.25, ease: [0.17, 1.15, 0.25, 1] }}
               className="absolute z-50 pointer-events-none will-change-transform"
               style={{ x: msg.x, y: msg.y }}
             >
                <div className="relative inline-block drop-shadow-[0_20px_40px_rgba(193,18,31,0.5)] opacity-95 pointer-events-none">
                    <img 
                      src="https://npr.brightspotcdn.com/0d/46/f59f1fe44312b1e2883a4b478bde/rejected-stamp-transparent-5.png" 
                      alt="Rejected Stamp" 
                      className="w-[300px] md:w-[450px] object-contain drop-shadow-[0_0_20px_rgba(200,0,0,0.5)] rotate-[-5deg]"
                    />
                </div>

                {/* Delayed post-processing bloom effect prevents GPU lag during the slam */}
                <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ delay: msg.delay + 0.25, duration: 0.5 }}
                   className="absolute inset-x-0 bottom-0 top-0 m-auto h-[150%] w-[150%] bg-[#c1121f]/30 mix-blend-screen blur-[60px] rounded-[100%] pointer-events-none -translate-x-[15%] -translate-y-[15%]"
                />
             </motion.div>
           );
         }

         return (
           <motion.div
             key={i}
             initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)", rotateZ: (msg.rotation || 0) - 10 }}
             animate={{ opacity: 0.95, scale: 1, filter: "blur(0px)", rotateZ: msg.rotation }}
             exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)", transition: { duration: 1 } }}
             transition={{ delay: msg.delay, duration: 2.5, ease: "easeOut" }}
             className="absolute w-[300px] md:w-[400px] p-5 bg-zinc-900/95 border-white/10 border backdrop-blur-3xl rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
             style={{ x: msg.x, y: msg.y }}
           >
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 text-white/40">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <div className="h-2.5 w-32 bg-white/20 rounded-sm" />
                  <div className="h-2 w-20 bg-white/10 rounded-sm" />
                </div>
                <div className="text-[10px] text-zinc-600 font-mono">
                  8:00 AM
                </div>
              </div>
              <p className="text-zinc-400 text-xs md:text-sm tracking-wider leading-relaxed font-mono">
                {msg.text}
              </p>
           </motion.div>
         );
      })}
    </div>
  );
}
