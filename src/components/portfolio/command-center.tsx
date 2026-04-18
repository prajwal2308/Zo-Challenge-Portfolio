import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

interface HistoryItem {
  type: 'input' | 'output' | 'error' | 'success';
  content: string;
}

interface CommandCenterProps {
  onPlaySound?: () => void;
  onHome?: () => void;
  isEmbedded?: boolean;
  onStopMusic?: () => void;
}

export function CommandCenter({ onPlaySound, onHome, isEmbedded, onStopMusic }: CommandCenterProps) {
  const [history, setHistory] = useState<HistoryItem[]>([
    { type: 'output', content: "ZO CLOUD OS [Version 1.0.42]" },
    { type: 'output', content: "Connection established with Cloud Node..." },
    { type: 'output', content: "" },
    { type: 'output', content: "Available commands:" },
    { type: 'output', content: "  /home     - Reveal Portfolio" },
    { type: 'output', content: "  /book     - Initiate booking flow" },
    { type: 'output', content: "  /projects - Browse top work" },
    { type: 'output', content: "  /contact  - Get social links" },
    { type: 'output', content: "  /clear    - Clear terminal shell" },
  ]);
  const [input, setInput] = useState("");
  const [bookingStep, setBookingStep] = useState<number | null>(null);
  const [bookingData, setBookingData] = useState({ name: "", date: "", intent: "" });
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    
    // Stop music on any user interaction
    onStopMusic?.();
    
    // Handle Booking Flow
    if (bookingStep !== null) {
      processBooking(cmd);
      return;
    }

    setHistory(prev => [...prev, { type: 'input', content: cmd }]);

    if (trimmed === '/help') {
      setHistory(prev => [...prev, { type: 'output', content: "AVAILABLE COMMANDS:\n/home     - Reveal Portfolio\n/book     - Initiate booking flow\n/projects - Browse top work\n/contact  - Get social links\n/clear    - Clear terminal shell" }]);
    } else if (trimmed === '/home') {
      setHistory(prev => [...prev, { type: 'success', content: "SYSTEM AUTHENTICATED. ACCESSING..." }]);
      setTimeout(() => onHome?.(), 800);
    } else if (trimmed === '/clear') {
      setHistory([]);
    } else if (trimmed === '/projects') {
      setHistory(prev => [...prev, { type: 'output', content: "OUR TOP WORK:\n1. HYPER-ORCHESTRATOR (ZO)\n2. BEUNEC CLOUD\n3. THINKER-CURATOR AI\nType numeric code to view (Coming Soon)" }]);
    } else if (trimmed === '/contact') {
      setHistory(prev => [...prev, { type: 'output', content: "ZO NODE CONNECTION:\nEmail: prajwal.srinivas238@gmail.com\nLinkedIn: linkedin.com/in/prajwalsrinivas238" }]);
    } else if (trimmed === '/book') {
      setBookingStep(0);
      setHistory(prev => [...prev, { type: 'output', content: "INITIATING BOOKING PROTOCOL...\nWhat is your name?" }]);
    } else if (trimmed !== "") {
      setHistory(prev => [...prev, { type: 'error', content: `Unknown command: ${trimmed}. Type '/help' for options.` }]);
    }
  };

  const processBooking = async (val: string) => {
    setHistory(prev => [...prev, { type: 'input', content: val }]);
    
    if (bookingStep === 0) {
      setBookingData(prev => ({ ...prev, name: val }));
      setBookingStep(1);
      setHistory(prev => [...prev, { type: 'output', content: `Nice to meet you, ${val}. What date/time are you thinking?` }]);
    } else if (bookingStep === 1) {
      setBookingData(prev => ({ ...prev, date: val }));
      setBookingStep(2);
      setHistory(prev => [...prev, { type: 'output', content: "Understood. Finally, what's the purpose of this call?" }]);
    } else if (bookingStep === 2) {
    } else if (bookingStep === 2) {
      const finalBookingData = { ...bookingData, intent: val };
      setBookingStep(null);
      setHistory(prev => [...prev, 
        { type: 'success', content: "SYNCHRONIZING WITH ZO CALENDAR..." }
      ]);
      
      try {
        const response = await fetch('/api/booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(finalBookingData)
        });
        
        if (response.ok) {
          setHistory(prev => [...prev, 
            { type: 'success', content: "SUCCESS: Booking confirmed! Check your email for details." }
          ]);
        } else {
          setHistory(prev => [...prev, 
            { type: 'output', content: "Booking saved. Prajwal will reach out soon." }
          ]);
        }
      } catch (error) {
        setHistory(prev => [...prev, 
          { type: 'output', content: "Booking saved. Prajwal will reach out soon." }
        ]);
      }
    }
  };

  return (
    <motion.div 
      initial={isEmbedded ? { opacity: 0 } : { opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className={isEmbedded ? "w-full h-full min-h-[300px]" : "fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl z-50 p-4 md:p-8"}
    >
      <div className={`bg-black/80 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl h-full flex flex-col ${isEmbedded ? 'rounded-xl' : 'rounded-t-xl'}`}>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-b border-white/5">
          <Terminal className="w-3 h-3 text-zinc-500" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">SYSTEM_CONSOLE</span>
          <div className="ml-auto flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-zinc-800" />
            <div className="w-2 h-2 rounded-full bg-zinc-800" />
          </div>
        </div>

        <div 
          ref={scrollRef}
          className={`${isEmbedded ? 'flex-1' : 'h-48 md:h-64'} overflow-y-auto p-4 font-mono text-[11px] md:text-xs space-y-1.5 scrollbar-hide`}
        >
          {history.map((item, i) => (
            <div key={i} className={
                item.type === 'error' ? 'text-red-500' : 
                item.type === 'input' ? 'text-zinc-400' : 
                item.type === 'success' ? 'text-emerald-500' :
                'text-zinc-200'
            }>
              {item.type === 'input' && <span className="mr-2 text-zinc-600">❯</span>}
              {item.content}
            </div>
          ))}
        </div>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim()) {
              handleCommand(input);
              setInput("");
            }
          }}
          className="p-4 border-t border-white/5 flex items-center gap-3"
        >
          <span className="text-emerald-500 font-mono text-xs animate-pulse">❯</span>
          <input
            ref={inputRef}
            autoFocus={!isEmbedded}
            type="text"
            value={input}
            onChange={(e) => {
                setInput(e.target.value);
                onPlaySound?.();
            }}
            placeholder="Type a command..."
            className="flex-1 bg-transparent border-none outline-none text-white font-mono text-xs placeholder:text-zinc-700"
          />
        </form>
      </div>
    </motion.div>
  );
}
