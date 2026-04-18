import { motion } from "framer-motion";
import { TextScramble } from "@/components/ui/text-scramble";

interface FinalWaitingRoomProps {
  playRapid: () => void;
}

export function FinalWaitingRoom({ playRapid }: FinalWaitingRoomProps) {
  return (
    
      <div className="flex flex-col items-center leading-[0.8] mix-blend-screen overflow-visible will-change-transform whitespace-nowrap mt-4">
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
         <TextScramble
          className="text-zinc-50 text-[2rem] md:text-[3rem] lg:text-[4rem] font-black tracking-tighter uppercase inline-block origin-center"
          style={{ textShadow: "0 20px 50px rgba(0,0,0,0.9), 0 0 100px rgba(221, 12, 12, 0.9)" }}
          duration={1.8}
          speed={0.03}
          characterSet="01!*&()—_[]OPPURTUNITY"
          onScrambleStep={playRapid}
        >
          FOR ONE OPPORTUNITY
        </TextScramble>
      </div>
  
  );
}
