import { useEffect, useRef } from "react";
import { useAudioTick } from "@/hooks/use-audio-tick";

export function OPTTimer() {
  const textRef = useRef<HTMLSpanElement>(null);
  const { playTick, playRapid } = useAudioTick();
  const tickDelay = useRef(0);
  const lastState = useRef(-1);

  useEffect(() => {
    let start = performance.now();
    let duration = 6500; // 2.5s rapid + 4.0s slow ticks
    let frameId: number;

    function animate(time: number) {
      if (!textRef.current) return;
      let elapsed = time - start;
      if (elapsed > duration) elapsed = duration;

      let currentText = "00:00:00";

      if (elapsed < 2500) {
        // RAPID PHASE (0s to 2.5s)
        if (time - tickDelay.current > 70) { 
          playRapid();
          tickDelay.current = time;
        }

        let progress = elapsed / 2500;
        
        // 90 Days -> 1 Day -> 24 Hours -> 60 Sec -> 4 Sec
        if (progress < 0.4) { 
            let days = Math.max(1, Math.floor(90 - (progress/0.4) * 89));
            currentText = `${days.toString().padStart(2, '0')} DAYS`;
        } else if (progress < 0.7) { 
            let p = (progress - 0.4) / 0.3;
            let hours = Math.max(1, Math.floor(24 - p * 23));
            currentText = `${hours.toString().padStart(2, '0')} HOURS`;
        } else { 
            let p = (progress - 0.7) / 0.3;
            let secs = Math.max(4, Math.floor(60 - p * 56)); // Stop precisely at 4
            currentText = `00:00:${secs.toString().padStart(2, '0')}`;
        }
      } else {
        // SLOW DOWN PHASE (2.5s to 6.5s)
        let slowElapsed = elapsed - 2500; 
        
        let secondsLeft = 3 - Math.floor(slowElapsed / 1000);
        if (secondsLeft < 0) secondsLeft = 0;

        currentText = `00:00:0${secondsLeft}`;

        // Play heavy tick exactly once per second change
        if (lastState.current !== secondsLeft) {
            playTick();
            lastState.current = secondsLeft;
        }
      }

      // Add intense cinematic scramble for the first 0.3s of transition
      if (elapsed < 300) {
        const characters = '!@#$%^&*()_+';
        currentText = currentText.split('').map(c => c === ' ' ? ' ' : characters[Math.floor(Math.random() * characters.length)]).join('');
      }

      if (textRef.current.innerText !== currentText) {
        textRef.current.innerText = currentText;
      }

      if (elapsed < duration) {
        frameId = requestAnimationFrame(animate);
      }
    }

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [playTick, playRapid]);

  return (
    <span 
      ref={textRef} 
      className="inline-block tabular-nums tracking-tighter"
      style={{ minWidth: '7ch', textAlign: 'center' }} // Prevent layout shifting
    >
      90 DAYS
    </span>
  );
}
