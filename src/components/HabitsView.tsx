import { Habit } from '../types';
import { 
  Plus, 
  Flame, 
  Trash2, 
  Check,
  Award,
  Calendar,
  Droplets,
  Dumbbell,
  Moon,
  Book,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { format, subDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import React, { useState, Dispatch, SetStateAction } from 'react';

interface Props {
  habits: Habit[];
  setHabits: Dispatch<SetStateAction<Habit[]>>;
}

const HABIT_ICONS = {
  Droplets: <Droplets size={20} />,
  Dumbbell: <Dumbbell size={20} />,
  Moon: <Moon size={20} />,
  Book: <Book size={20} />,
  Heart: <Heart size={20} />
};

export default function HabitsView({ habits, setHabits }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  
  // Last 7 days for the tracker
  const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), 6 - i));

  const toggleHabit = (habitId: string, date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const isCompleted = habit.completions.includes(dateStr);
        const newCompletions = isCompleted 
          ? habit.completions.filter(d => d !== dateStr)
          : [...habit.completions, dateStr];
        
        // Simple streak calculation (only counts consecutive days backwards from today)
        let streak = 0;
        let checkDate = new Date();
        while (newCompletions.includes(format(checkDate, 'yyyy-MM-dd'))) {
          streak++;
          checkDate = subDays(checkDate, 1);
        }
        
        return { ...habit, completions: newCompletions, streak };
      }
      return habit;
    }));
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h3 className="section-label mb-1">Hábitos Diários</h3>
          <p className="text-sm text-text-dim">Desenvolva consistência nos seus objetivos diários.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="glass-button flex items-center gap-2"
        >
          <Plus size={18} />
          <span>Criar Hábito</span>
        </button>
      </header>

      {/* Habit List */}
      <div className="grid grid-cols-1 gap-6">
        {habits.map((habit, i) => (
          <motion.div
            key={habit.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: `${habit.color}20`, color: habit.color }}
                >
                  {HABIT_ICONS[habit.icon as keyof typeof HABIT_ICONS] || <Check size={20} />}
                </div>
                <div>
                  <h4 className="font-bold text-lg">{habit.name}</h4>
                  <div className="flex items-center gap-2 text-orange-400">
                    <Flame size={14} />
                    <span className="text-xs font-bold">{habit.streak} dias de streak</span>
                  </div>
                </div>
              </div>

              {/* Day Tracker */}
              <div className="flex items-center gap-2">
                {last7Days.map(date => {
                  const dateStr = format(date, 'yyyy-MM-dd');
                  const isCompleted = habit.completions.includes(dateStr);
                  const isToday = isSameDay(date, new Date());

                  return (
                    <div key={dateStr} className="flex flex-col items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-gray-500">
                        {format(date, 'EEE', { locale: ptBR })}
                      </span>
                      <button
                        onClick={() => toggleHabit(habit.id, date)}
                        className={cn(
                          "w-10 h-10 rounded-xl transition-all flex items-center justify-center border",
                          isCompleted 
                            ? "border-transparent text-white" 
                            : "bg-white/5 border-white/5 text-transparent hover:border-white/20",
                          isToday && !isCompleted && "border-primary/50"
                        )}
                        style={{ backgroundColor: isCompleted ? habit.color : undefined }}
                      >
                        <Check size={18} className={cn(isCompleted ? "scale-100" : "scale-0 transition-transform")} />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <button className="p-3 hover:bg-white/5 rounded-xl text-gray-500 transition-colors">
                  <Award size={20} />
                </button>
                <button 
                  onClick={() => deleteHabit(habit.id)}
                  className="p-3 hover:bg-red-400/10 rounded-xl text-red-400 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Habit Stats / Rewards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 border-blue-400/20 bg-blue-400/5">
          <div className="flex items-center gap-3 mb-4">
            <h4 className="section-label mb-0">Análise Semanal</h4>
          </div>
          <p className="text-sm text-gray-400 mb-6">
            Sua consistência nesta semana foi de <span className="text-blue-400 font-bold">78%</span>. Continue mantendo o ritmo!
          </p>
          <div className="flex gap-1 h-2 bg-white/5 rounded-full overflow-hidden">
             {[1,2,3,4,5,6,7].map(i => (
               <div key={i} className={cn("flex-1", i < 6 ? "bg-blue-400" : "bg-white/10")} />
             ))}
          </div>
        </div>

        <div className="glass-card p-6 border-orange-400/20 bg-orange-400/5">
          <div className="flex items-center gap-3 mb-4">
            <h4 className="section-label mb-0">Conquistas Disponíveis</h4>
          </div>
          <div className="space-y-3">
             <div className="flex items-center gap-3 opacity-50">
               <div className="w-8 h-8 rounded-full border border-dashed border-gray-500 flex items-center justify-center">
                 <Flame size={14} />
               </div>
               <span className="text-xs">Chegue a 10 dias de streak em 3 hábitos</span>
             </div>
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full border border-orange-400 flex items-center justify-center bg-orange-400/20 text-orange-400">
                 <Check size={14} />
               </div>
               <span className="text-xs">Primeiro hábito completado hoje!</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
