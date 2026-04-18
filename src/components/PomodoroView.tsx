import { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee, 
  Timer,
  Bell,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function PomodoroView() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play sound or notify
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode: 'work' | 'break') => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'work' ? 25 * 60 : 5 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = mode === 'work' 
    ? ((25 * 60 - timeLeft) / (25 * 60)) * 100 
    : ((5 * 60 - timeLeft) / (5 * 60)) * 100;

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="glass-card p-12 flex flex-col items-center">
        {/* Mode Selector */}
        <div className="flex bg-white/5 p-1 rounded-2xl mb-12">
          <button
            onClick={() => switchMode('work')}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
              mode === 'work' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-400 hover:text-white"
            )}
          >
            <Timer size={16} />
            Foco
          </button>
          <button
            onClick={() => switchMode('break')}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
              mode === 'break' ? "bg-blue-400 text-white shadow-lg shadow-blue-400/20" : "text-gray-400 hover:text-white"
            )}
          >
            <Coffee size={16} />
            Pausa
          </button>
        </div>

        {/* Circular Timer Display */}
        <div className="relative w-64 h-64 mb-12 group">
          {/* Progress BG */}
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="8"
            />
            <motion.circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke={mode === 'work' ? "#6C63FF" : "#60A5FA"}
              strokeWidth="8"
              strokeDasharray="753.98"
              strokeDashoffset={753.98 - (753.98 * progress) / 100}
              strokeLinecap="round"
              className="transition-all duration-300 ease-out"
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-7xl font-extrabold tracking-[-4px] leading-none">
              {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </span>
            <p className="section-label mb-0 mt-4">
              {mode === 'work' ? 'Sessão de Foco' : 'Momento de Pausa'}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
          <button 
            onClick={resetTimer}
            className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all hover:scale-110"
          >
            <RotateCcw size={24} />
          </button>
          
          <button 
            onClick={toggleTimer}
            className={cn(
              "w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl transition-all hover:scale-105 active:scale-95",
              mode === 'work' ? "bg-primary shadow-primary/30" : "bg-blue-400 shadow-blue-400/30"
            )}
          >
            {isActive ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
          </button>

          <button className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all hover:scale-110">
            <Settings size={24} />
          </button>
        </div>

        <div className="mt-12 flex items-center gap-2 text-xs text-gray-400">
          <Bell size={14} />
          <span>Notificações ativadas</span>
        </div>
      </div>
    </div>
  );
}
