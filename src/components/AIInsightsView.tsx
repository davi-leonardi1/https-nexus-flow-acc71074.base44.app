import { useState } from 'react';
import { Task, Habit, AIInsight } from '../types';
import { 
  Sparkles, 
  RefreshCcw, 
  Lightbulb, 
  Trophy, 
  Zap,
  ChevronRight,
  TrendingUp,
  Brain
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeProductivity } from '../lib/gemini';
import { cn } from '../lib/utils';

interface Props {
  tasks: Task[];
  habits: Habit[];
}

export default function AIInsightsView({ tasks, habits }: Props) {
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateInsights = async () => {
    setIsLoading(true);
    const result = await analyzeProductivity(tasks, habits);
    if (result) {
      setInsight(result);
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="glass-card p-12 relative overflow-hidden flex flex-col items-center text-center">
        {/* Animated Background Element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] -z-10" />

        <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mb-6 border border-primary/30 shadow-inner">
          <Sparkles className="text-primary animate-pulse" size={40} />
        </div>
        
        <h3 className="text-4xl font-extrabold mb-4 tracking-[-2px]">Análise Nexus Inteligente</h3>
        <p className="text-gray-400 max-w-lg mb-8 leading-relaxed">
          Nossa IA analisa seu padrão de produtividade, hábitos e tarefas para sugerir o caminho ideal de foco para você hoje.
        </p>

        <button 
          onClick={generateInsights}
          disabled={isLoading}
          className={cn(
            "relative group flex items-center gap-3 bg-primary px-8 py-4 rounded-2xl font-bold shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100",
            isLoading && "cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <>
              <RefreshCcw className="animate-spin" size={20} />
              Processando sua jornada...
            </>
          ) : (
            <>
              <Zap size={20} />
              Gerar Insights agora
            </>
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {insight && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Summary & Score */}
            <div className="space-y-8">
              <div className="glass-card p-8 border-primary/20">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <h4 className="section-label mb-0">Resumo Executivo</h4>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase font-bold text-primary/60 tracking-widest">N-Score</span>
                    <span className="text-3xl font-black text-primary">{insight.productivityScore}/100</span>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed text-lg">
                  "{insight.summary}"
                </p>
                
                <div className="mt-8 pt-8 border-t border-white/5 flex items-center gap-4 text-xs text-gray-500">
                  <TrendingUp size={16} />
                  <span>Baseado nos seus últimos 7 dias de atividade</span>
                </div>
              </div>

              <div className="glass-card p-8 bg-gradient-to-br from-primary/10 to-transparent">
                 <h4 className="font-bold flex items-center gap-2 mb-6">
                   <Trophy className="text-orange-400" size={20} />
                   Desafio do Dia
                 </h4>
                 <div className="p-4 glass bg-white/5 rounded-2xl border-white/10">
                   <p className="text-sm italic">"Complete todas as tarefas de prioridade ALTA antes das 15h para maximizar sua energia criativa."</p>
                 </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="glass-card p-8">
              <h4 className="section-label mb-8">Sugestões Estratégicas</h4>
              <div className="space-y-4">
                {insight.suggestions.map((s, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 glass bg-white/[0.02] border-white/5 hover:border-primary/30 hover:bg-white/[0.04] transition-all group flex gap-4 items-start"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <span className="text-xs font-bold text-primary">{i+1}</span>
                    </div>
                    <p className="text-gray-300 group-hover:text-white transition-colors">{s}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
