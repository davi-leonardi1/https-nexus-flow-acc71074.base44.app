import { Task, Habit } from '../types';
import { 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Activity,
  Flame,
  Award,
  FileDown
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { motion } from 'motion/react';
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';

interface Props {
  tasks: Task[];
  habits: Habit[];
}

const data = [
  { name: 'Seg', tasks: 4, habits: 2 },
  { name: 'Ter', tasks: 3, habits: 3 },
  { name: 'Qua', tasks: 6, habits: 1 },
  { name: 'Qui', tasks: 8, habits: 3 },
  { name: 'Sex', tasks: 5, habits: 2 },
  { name: 'Sab', tasks: 2, habits: 3 },
  { name: 'Dom', tasks: 3, habits: 3 },
];

export default function DashboardView({ tasks, habits }: Props) {
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.filter(t => t.status !== 'completed').length;
  const activeHabits = habits.length;

  const exportPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.text('NexusFlow - Relatório de Produtividade', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Data: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 20, 30);
    
    doc.setFontSize(16);
    doc.text('Resumo Geral', 20, 45);
    doc.setFontSize(12);
    doc.text(`Tarefas Concluídas: ${completedTasks}`, 20, 55);
    doc.text(`Tarefas Pendentes: ${pendingTasks}`, 20, 62);
    doc.text(`Hábitos Ativos: ${activeHabits}`, 20, 69);
    
    doc.setFontSize(16);
    doc.text('Minhas Tarefas', 20, 85);
    doc.setFontSize(10);
    tasks.forEach((task, index) => {
      const y = 95 + (index * 7);
      if (y < 280) {
        doc.text(`${task.status === 'completed' ? '[X]' : '[ ]'} ${task.title} (${task.priority})`, 25, y);
      }
    });
    
    doc.save(`NexusFlow-Report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };
  
  const stats = [
    { label: 'Concluídas', value: completedTasks, icon: CheckCircle2, color: 'text-green-400' },
    { label: 'Pendentes', value: pendingTasks, icon: Clock, color: 'text-amber-400' },
    { label: 'Hábitos Ativos', value: activeHabits, icon: Activity, color: 'text-blue-400' },
    { label: 'Streak Atual', value: 5, icon: Flame, color: 'text-orange-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[1px] text-text-dim font-bold">{stat.label}</p>
                <p className="text-[32px] font-extrabold mt-1 tracking-tight">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-green-400 bg-green-400/10 w-fit px-2 py-1 rounded-full">
              <TrendingUp size={12} />
              <span>+12% vs anterior</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-6">
          {/* Chart */}
          <div className="glass-card p-6 min-h-[400px]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="section-label mb-0">Fluxo de Produtividade</h3>
              <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs focus:outline-none">
                <option>Última Semana</option>
                <option>Último Mês</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6C63FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="rgba(255,255,255,0.4)" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.4)" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 17, 26, 0.9)', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(10px)'
                    }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="tasks" 
                    stroke="#6C63FF" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorTasks)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Rail */}
        <div className="space-y-6">
          {/* Recent Activity / Goals */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="section-label mb-0">Metas de Hoje</h3>
              <button 
                onClick={exportPDF}
                className="p-2 hover:bg-white/5 rounded-xl text-primary transition-colors flex items-center gap-2 text-xs font-bold"
              >
                <FileDown size={14} />
                PDF
              </button>
            </div>
            <div className="space-y-4">
              {[
                { id: 1, text: 'Completar 5 tarefas', progress: 80, color: 'bg-primary' },
                { id: 2, text: 'Beber 2L de água', progress: 60, color: 'bg-blue-400' },
                { id: 3, text: 'Ler por 30 min', progress: 10, color: 'bg-green-400' },
              ].map(goal => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">{goal.text}</span>
                    <span className="font-semibold">{goal.progress}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full ${goal.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-primary/10 rounded-2xl border border-primary/20 flex items-center gap-4">
              <div className="p-2 bg-primary rounded-xl">
                <Award size={20} />
              </div>
              <div>
                <p className="text-sm font-bold">Quase lá!</p>
                <p className="text-xs text-primary/80">Faltam 2 tarefas para bater a meta.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
