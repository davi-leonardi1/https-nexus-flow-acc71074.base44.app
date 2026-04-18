import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  RefreshCcw, 
  StickyNote, 
  Timer, 
  Sparkles, 
  Search, 
  Plus, 
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task, Habit, Note } from './types';
import { cn } from './lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Components
import DashboardView from './components/DashboardView';
import TasksView from './components/TasksView';
import HabitsView from './components/HabitsView';
import NotesView from './components/NotesView';
import PomodoroView from './components/PomodoroView';
import AIInsightsView from './components/AIInsightsView';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // State
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('nexusflow_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('nexusflow_habits');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Beber Água', icon: 'Droplets', completions: [], streak: 0, color: '#3B82F6' },
      { id: '2', name: 'Exercício', icon: 'Dumbbell', completions: [], streak: 0, color: '#EF4444' },
      { id: '3', name: 'Meditação', icon: 'Moon', completions: [], streak: 0, color: '#8B5CF6' },
    ];
  });
  
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('nexusflow_notes');
    return saved ? JSON.parse(saved) : [{ id: '1', content: '', updatedAt: new Date().toISOString() }];
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem('nexusflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('nexusflow_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('nexusflow_notes', JSON.stringify(notes));
  }, [notes]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tarefas', icon: CheckSquare },
    { id: 'habits', label: 'Hábitos', icon: RefreshCcw },
    { id: 'notes', label: 'Notas', icon: StickyNote },
    { id: 'pomodoro', label: 'Pomodoro', icon: Timer },
    { id: 'ai', label: 'N-AI Insights', icon: Sparkles },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-white selection:bg-primary/30">
      {/* Mobile Sidebar Toggle */}
      <button 
        className="lg:hidden fixed top-4 right-4 z-50 p-2 glass rounded-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -260 }}
        animate={{ x: isSidebarOpen ? 0 : -260 }}
        className={cn(
          "fixed lg:relative z-40 w-64 h-full glass border-r border-white/5 transition-all flex flex-col shrink-0",
          !isSidebarOpen && "lg:w-0 overflow-hidden border-none"
        )}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
            <span className="text-xl font-bold italic">N</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tighter whitespace-nowrap uppercase">NexusFlow</h1>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group whitespace-nowrap",
                activeTab === item.id 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon size={18} className={cn(
                "transition-transform group-hover:scale-110",
                activeTab === item.id ? "text-white" : "text-gray-500"
              )} />
              {item.label}
              {activeTab === item.id && (
                <motion.div 
                  layoutId="active-pill"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-white" 
                />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <div className="p-4 glass rounded-2xl bg-white/5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-400 shrink-0" />
              <div className="overflow-hidden">
                <p className="text-xs font-semibold truncate">User Nexus</p>
                <p className="text-[10px] text-gray-400">Plano Pro</p>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative p-4 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
          {/* Header Area */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-[42px] font-extrabold tracking-[-2px] leading-none mb-2">
                {activeTab === 'dashboard' ? 'Olá, Nexus User' : menuItems.find(m => m.id === activeTab)?.label}
              </h2>
              <p className="text-sm text-text-dim font-medium">
                {activeTab === 'dashboard' 
                  ? `Você tem ${tasks.filter(t => t.status !== 'completed').length} tarefas pendentes para hoje.`
                  : format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input 
                  type="text" 
                  placeholder="Busca global..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-primary/50 transition-colors w-full md:w-64"
                />
              </div>
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && (
                <DashboardView tasks={tasks} habits={habits} />
              )}
              {activeTab === 'tasks' && (
                <TasksView tasks={tasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()))} setTasks={setTasks} />
              )}
              {activeTab === 'habits' && (
                <HabitsView habits={habits.filter(h => h.name.toLowerCase().includes(searchQuery.toLowerCase()))} setHabits={setHabits} />
              )}
              {activeTab === 'notes' && (
                <NotesView notes={notes.filter(n => n.content.toLowerCase().includes(searchQuery.toLowerCase()))} setNotes={setNotes} />
              )}
              {activeTab === 'pomodoro' && (
                <PomodoroView />
              )}
              {activeTab === 'ai' && (
                <AIInsightsView tasks={tasks} habits={habits} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

