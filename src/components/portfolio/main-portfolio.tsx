import { motion, type Variants } from 'framer-motion';
import { Github, Mail, ExternalLink, Cpu, Database, Coffee, Calendar, Briefcase, GraduationCap, Code2, Cloud, Brain, Shield, Zap, Gamepad2 } from 'lucide-react';
import { useState } from 'react';
import { JobCatcher } from '@/components/game/job-catcher';

interface MainPortfolioProps {
    onPlaySound?: () => void;
    onStopMusic?: () => void;
}

export function MainPortfolio({ onPlaySound, onStopMusic }: MainPortfolioProps) {
  const [showGame, setShowGame] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCustomPay = async () => {
    const amount = parseInt(customAmount);
    if (!amount || amount < 1 || amount > 100) {
      alert('Please enter amount between $1 and $100');
      return;
    }
    setIsProcessing(true);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amount * 100 }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    }
    setIsProcessing(false);
  };

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] as const } },
  };

  const skills = [
    { icon: Code2, label: 'LANGUAGES', items: 'Python, JavaScript, TypeScript, Go, Java, SQL' },
    { icon: Zap, label: 'FRAMEWORKS', items: 'NextJS, React, NodeJS, Flask, TailWindCSS' },
    { icon: Cloud, label: 'CLOUD & DEVOPS', items: 'AWS, GCP, Docker, Kubernetes, Cloudflare' },
    { icon: Brain, label: 'AI & DATA', items: 'PyTorch, OpenAI API, LangChain, Redis, MongoDB' },
    { icon: Shield, label: 'CONCEPTS', items: 'System Design, Microservices, CI/CD, RESTful APIs' },
  ];

  const experience = [
    { title: 'Co-Founder & CTO', company: 'Beunec Technologies', period: 'May 2025 — Present', desc: 'Architected AI ecosystem with 1k+ users, 99.9% uptime via Cloudflare & AWS' },
    { title: 'Cloud Systems Engineer', company: 'Universal Selfcare', period: 'Dec 2025 — Jan 2026', desc: 'Built GCP serverless backend achieving 95% test coverage in 4-week sprint' },
    { title: 'Teaching Assistant', company: 'Rutgers University', period: 'Sept 2024 — Present', desc: 'Mentored 150+ students, improved performance by 25%' },
    { title: 'Software Developer', company: 'CSG International', period: 'Feb 2023 — Aug 2024', desc: 'Reduced post-release defects by 20% for global telecom clients' },
  ];

  const projects = [
    { title: 'Hyper-Orchestrator', desc: "World's first intelligent task orchestration engine for Zo Computer. 4.2x speedup via adaptive worker pools.", tech: 'Python, AsyncIO, AI', link: 'https://github.com/prajwal2308/hyper-orchestrator' },
    { title: 'Proactive Retrieval Thinker-Curator', desc: 'Multi-agent AI system enhancing LLM long-term memory. Reduced hallucination by 15%.', tech: 'Python, LangChain, Vector DB', link: 'https://github.com/prajwal2308/Proactive_Retrieval_Thinker_Curator_Model_for_AI_Memory' },
    { title: 'LoRaWAN Mesh IoT Simulator', desc: 'Containerized UDP mesh network with multi-hop routing and failure injection.', tech: 'Docker, Kubernetes, UDP', link: 'https://github.com/prajwal2308/DIS_PROJECT_LoRAWAN' },
  ];

  return (
    <>
      {showGame && <JobCatcher onExit={() => setShowGame(false)} />}
      <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-5 w-full max-w-5xl mx-auto h-full overflow-y-auto p-4 md:p-6">
        {/* Header */}
        <motion.div variants={item} className='text-center pb-2'>
          <h1 className='text-4xl md:text-5xl font-black text-white tracking-tight'>PRAJWAL SRINIVAS</h1>
          <p className='text-zinc-400 text-sm mt-1'>Full-Stack Cloud Developer & Master's Student at Rutgers (GPA 3.65)</p>
          <div className='flex flex-wrap justify-center gap-3 mt-3 text-xs text-zinc-500'>
            <a href='mailto:prajwal.srinivas238@gmail.com' className='hover:text-emerald-400 transition-colors'>prajwal.srinivas238@gmail.com</a>
            <span className='text-zinc-700'>|</span>
            <span>+1 (848) 230-1591</span>
            <span className='text-zinc-700'>|</span>
            <a href='https://linkedin.com/in/prajwalsrinivas238' target='_blank' className='hover:text-emerald-400 transition-colors'>linkedin.com/in/prajwalsrinivas238</a>
            <span className='text-zinc-700'>|</span>
            <span>New York, NY</span>
          </div>
        </motion.div>

        {/* Summary */}
        <motion.div variants={item} className='bg-zinc-900/60 border border-white/5 rounded-2xl p-5'>
          <h2 className='text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2'>
            <GraduationCap className='w-4 h-4 text-emerald-400' />
            Professional Summary
          </h2>
          <p className='text-zinc-400 text-sm leading-relaxed'>
            Full-Stack Cloud Developer with 2.5+ years building high-availability AI platforms and secure cloud infrastructure. As Co-Founder & CTO of Beunec, developed an end-to-end AI ecosystem leveraging AWS, MongoDB & Cloudflare to support 1k+ users. Currently pursuing Master's in Computer Science at Rutgers (graduating May 2026).
          </p>
        </motion.div>

        {/* Skills */}
        <motion.div variants={item} className='bg-zinc-900/60 border border-white/5 rounded-2xl p-5'>
          <h2 className='text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2'>
            <Cpu className='w-4 h-4 text-cyan-400' />
            Technical Skills
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
            {skills.map((skill, i) => (
              <div key={i} className='bg-black/30 rounded-xl p-3 border border-white/5'>
                <div className='flex items-center gap-2 mb-1'>
                  <skill.icon className='w-3 h-3 text-emerald-400' />
                  <span className='text-white text-xs font-bold'>{skill.label}</span>
                </div>
                <p className='text-zinc-500 text-xs pl-5'>{skill.items}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Experience */}
        <motion.div variants={item} className='bg-zinc-900/60 border border-white/5 rounded-2xl p-5'>
          <h2 className='text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2'>
            <Briefcase className='w-4 h-4 text-amber-400' />
            Professional Experience
          </h2>
          <div className='space-y-4'>
            {experience.map((exp, i) => (
              <div key={i} className='border-l-2 border-emerald-500/30 pl-4'>
                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-1'>
                  <div>
                    <span className='text-white font-semibold text-sm'>{exp.title}</span>
                    <span className='text-emerald-400 text-xs'> @ {exp.company}</span>
                  </div>
                  <span className='text-zinc-600 text-xs'>{exp.period}</span>
                </div>
                <p className='text-zinc-500 text-xs mt-1'>{exp.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Projects */}
        <motion.div variants={item} className='bg-zinc-900/60 border border-white/5 rounded-2xl p-5'>
          <h2 className='text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2'>
            <Database className='w-4 h-4 text-purple-400' />
            Projects
          </h2>
          <div className='space-y-3'>
            {projects.map((proj, i) => (
              <a key={i} href={proj.link} target='_blank' className='block bg-black/30 rounded-xl p-4 border border-white/5 hover:border-emerald-500/30 transition-all group'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-white font-semibold text-sm group-hover:text-emerald-400 transition-colors'>{proj.title}</h3>
                  <ExternalLink className='w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors' />
                </div>
                <p className='text-zinc-500 text-xs mt-1'>{proj.desc}</p>
                <span className='inline-block mt-2 px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-xs font-mono'>{proj.tech}</span>
              </a>
            ))}
          </div>
        </motion.div>

        {/* Actions + Support */}
        <motion.div variants={item} className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Quick Actions */}
          <div className='bg-zinc-900/60 border border-white/5 rounded-2xl p-5'>
            <h3 className='text-sm font-bold text-white uppercase tracking-wider mb-4'>Quick Actions</h3>
            <div className='space-y-2'>
              <a href='https://cal.com/prajwal-srinivas-l5fwe0/15min' target='_blank' className='flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all'>
                <Calendar className='w-5 h-5 text-emerald-400' />
                <span className='text-emerald-400 font-medium text-sm'>Book a 15min Call</span>
              </a>
              <a href='mailto:prajwal.srinivas238@gmail.com?subject=Hiring Inquiry' className='flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 transition-all'>
                <Mail className='w-5 h-5 text-blue-400' />
                <span className='text-blue-400 font-medium text-sm'>Send Email</span>
              </a>
              <a href='https://linkedin.com/in/prajwalsrinivas238' target='_blank' className='flex items-center gap-3 p-3 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-600/30 transition-all'>
                <ExternalLink className='w-5 h-5 text-blue-500' />
                <span className='text-blue-500 font-medium text-sm'>Connect on LinkedIn</span>
              </a>
              <a href='https://github.com/prajwal2308' target='_blank' className='flex items-center gap-3 p-3 rounded-xl bg-zinc-700/50 hover:bg-zinc-700/70 border border-zinc-600/30 transition-all'>
                <Github className='w-5 h-5 text-zinc-300' />
                <span className='text-zinc-300 font-medium text-sm'>View GitHub Profile</span>
              </a>
              <button onClick={() => setShowGame(true)} className='flex items-center gap-3 p-3 rounded-xl bg-zinc-700/50 hover:bg-zinc-700/70 border border-zinc-600/30 transition-all'>
                <Gamepad2 className='w-5 h-5 text-zinc-300' />
                <span className='text-zinc-300 font-medium text-sm'>Play Zo Game</span>
              </button>
            </div>
          </div>

          {/* Support */}
          <div className='bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-2xl p-5'>
            <div className='flex items-center gap-3 mb-4'>
              <Coffee className='w-6 h-6 text-amber-400' />
              <div>
                <h3 className='text-white font-bold text-sm'>Support My Work</h3>
                <p className='text-zinc-500 text-xs'>If this helped, buy me a coffee!</p>
              </div>
            </div>
            <div className='grid grid-cols-4 gap-2'>
              <a href='https://buy.stripe.com/9B67sN7Wd0bK4h0cjB3AY01' target='_blank' className='p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-center transition-all'>
                <span className='text-amber-400 font-bold text-sm'>$3</span>
              </a>
              <a href='https://buy.stripe.com/aFa4gBfoF3nW8xggzR3AY02' target='_blank' className='p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-center transition-all'>
                <span className='text-amber-400 font-bold text-sm'>$5</span>
              </a>
              <a href='https://buy.stripe.com/cNi00l0tLe2A14Oabt3AY03' target='_blank' className='p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-center transition-all'>
                <span className='text-amber-400 font-bold text-sm'>$7</span>
              </a>
              <a href='https://buy.stripe.com/6oUbJ3gsJ0bKdRAcjB3AY04' target='_blank' className='p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-center transition-all'>
                <span className='text-amber-400 font-bold text-sm'>$10</span>
              </a>
            </div>
            {!showCustom ? (
              <button onClick={() => setShowCustom(true)} className='mt-3 w-full py-2 text-xs text-amber-400/60 hover:text-amber-400 transition-colors'>
                Or enter custom amount →
              </button>
            ) : (
              <div className='mt-3 flex gap-2'>
                <div className='flex items-center gap-2 flex-1 px-3 py-2 rounded-lg bg-black/40 border border-amber-500/30'>
                  <span className='text-amber-400'>$</span>
                  <input type='number' value={customAmount} onChange={(e) => setCustomAmount(e.target.value)} placeholder='Amount' min='1' max='100' className='flex-1 bg-transparent text-amber-400 text-sm outline-none' />
                </div>
                <button onClick={handleCustomPay} disabled={isProcessing || !customAmount} className='px-4 py-2 rounded-lg bg-amber-500 text-black text-sm font-medium hover:bg-amber-400 transition-all disabled:opacity-50'>
                  {isProcessing ? '...' : 'Pay'}
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div variants={item} className='pt-4 border-t border-white/5 text-center'>
          <div className='text-[10px] font-mono tracking-widest uppercase text-zinc-600'>
            © 2026 Prajwal Srinivas | Built with Zo Computer
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}