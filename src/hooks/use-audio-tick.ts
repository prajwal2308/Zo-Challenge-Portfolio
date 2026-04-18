import { useCallback, useRef } from "react";

export function useAudioTick() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientNodesRef = useRef<{ sources: AudioNode[], gain: GainNode, interval?: ReturnType<typeof setTimeout> } | null>(null);
  const musicBufferRef = useRef<AudioBuffer | null>(null);

  const initCtx = () => {
    if (typeof window === "undefined") return null;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    return ctx;
  };

  const createBrownNoiseBuffer = (ctx: AudioContext, duration: number) => {
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        const out = (lastOut + (0.02 * white)) / 1.02;
        data[i] = out * 3.5;
        lastOut = out;
    }
    return buffer;
  };

  const playLonelyNote = useCallback(() => {
    const ctx = initCtx();
    if (!ctx) return;

    const notes = [130.81, 155.56, 196.00, 233.08, 293.66];
    const freq = notes[Math.floor(Math.random() * notes.length)];

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    filter.type = 'lowpass';
    filter.frequency.value = 1200;
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 0.1); 
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 8); 

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 8.1);
  }, []);

  const playRapid = useCallback(() => {
    const ctx = initCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(2500, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.01);
    filter.type = 'bandpass';
    filter.frequency.value = 3000;
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.002);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.01);
    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.02);
  }, []);

  const playTick = useCallback(() => {
    const ctx = initCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1500, ctx.currentTime);
    filter.type = 'bandpass';
    filter.frequency.value = 1500;
    filter.Q.value = 15;
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 0.001);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.015);
    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.02);
  }, []);

  const playSmoothNotif = useCallback(() => {
    const ctx = initCtx();
    if (!ctx) return;
    const noise = ctx.createBufferSource();
    const bufferSize = ctx.sampleRate * 0.1;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    noise.buffer = buffer;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 1000;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0, ctx.currentTime);
    noiseGain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.05);
    noiseGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start();

    const osc = ctx.createOscillator();
    const chimeGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime + 0.05); 
    chimeGain.gain.setValueAtTime(0, ctx.currentTime + 0.05);
    chimeGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.06);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.connect(chimeGain);
    chimeGain.connect(ctx.destination);
    osc.start(ctx.currentTime + 0.05);
    osc.stop(ctx.currentTime + 0.5);
  }, []);

  const playStampSlam = useCallback(() => {
    const ctx = initCtx();
    if (!ctx) return;
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(60, ctx.currentTime);
    sub.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.1);
    subGain.gain.setValueAtTime(0.6, ctx.currentTime);
    subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    sub.connect(subGain);
    subGain.connect(ctx.destination);
    sub.start();
    sub.stop(ctx.currentTime + 0.3);

    const noise = ctx.createBufferSource();
    const bufferSize = ctx.sampleRate * 0.2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    noise.buffer = buffer;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.3, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    noise.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start();

    const ring = ctx.createOscillator();
    const ringGain = ctx.createGain();
    ring.type = 'triangle';
    ring.frequency.setValueAtTime(1000, ctx.currentTime);
    ringGain.gain.setValueAtTime(0.1, ctx.currentTime);
    ringGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    ring.connect(ringGain);
    ringGain.connect(ctx.destination);
    ring.start();
    ring.stop(ctx.currentTime + 0.5);
  }, []);

  const startSadMusic = useCallback(async () => {
    const ctx = initCtx();
    if (!ctx || ambientNodesRef.current) return;

    const mainGain = ctx.createGain();
    mainGain.gain.setValueAtTime(0, ctx.currentTime);
    mainGain.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 4);

    const sources: AudioNode[] = [];

    // 1. Reality Layer: Multi-Band Noise
    const rumble = ctx.createBufferSource();
    rumble.buffer = createBrownNoiseBuffer(ctx, 10);
    rumble.loop = true;
    const rumFilter = ctx.createBiquadFilter();
    rumFilter.type = 'lowpass';
    rumFilter.frequency.value = 100;
    const rumGain = ctx.createGain();
    rumGain.gain.value = 0.2;
    rumble.connect(rumFilter);
    rumFilter.connect(rumGain);
    rumGain.connect(mainGain);
    rumble.start();
    sources.push(rumble);

    // 2. Nostalgia MP3 Layer
    try {
        if (!musicBufferRef.current) {
            const response = await fetch('/bgm.mp3');
            const arrayBuffer = await response.arrayBuffer();
            musicBufferRef.current = await ctx.decodeAudioData(arrayBuffer);
        }
        
        const musicSource = ctx.createBufferSource();
        musicSource.buffer = musicBufferRef.current;
        musicSource.loop = true;  // Changed from false to true for continuous loop
        
        const musicGain = ctx.createGain();
        musicGain.gain.value = 0.15; // Slow volume
        
        musicSource.connect(musicGain);
        musicGain.connect(mainGain);
        musicSource.start();
        sources.push(musicSource);
    } catch (error) {
        console.error("Failed to load bgm.mp3:", error);
    }

    // 3. Stochastic Melancholy (Lonely Piano)
    const triggerNote = () => {
        playLonelyNote();
        const nextTime = 4000 + Math.random() * 8000;
        if (ambientNodesRef.current) {
            ambientNodesRef.current.interval = setTimeout(triggerNote, nextTime);
        }
    };
    
    mainGain.connect(ctx.destination);
    ambientNodesRef.current = { sources, gain: mainGain };
    triggerNote();
  }, [playLonelyNote]);

  const stopSadMusic = useCallback(() => {
    const nodes = ambientNodesRef.current;
    const ctx = initCtx();
    if (!nodes || !ctx) return;

    if (nodes.interval) clearTimeout(nodes.interval);
    nodes.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 8);
    
    setTimeout(() => {
      nodes.sources.forEach(src => {
        try { 
            if (src instanceof OscillatorNode || src instanceof AudioBufferSourceNode) {
                src.stop(); 
            }
        } catch(e) {}
      });
      ambientNodesRef.current = null;
    }, 8500);
  }, []);

  return { playTick, playRapid, playSmoothNotif, playStampSlam, startSadMusic, stopSadMusic };
}
