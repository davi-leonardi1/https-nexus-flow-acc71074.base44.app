import { Task, Priority, TaskStatus } from '../types';
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertCircle,
  Calendar,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import React, { useState, Dispatch, SetStateAction } from 'react';

interface Props {
  tasks: Task[];
  setTasks: Dispatch<SetStateAction<Task[]>>;
}

export default function TasksView({ tasks, setTasks }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  
  // New Task State
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('medium');
  const [newCategory, setNewCategory] = useState('Trabalho');

  const filteredTasks = tasks.filter(task => {
    const statusMatch = filter === 'all' || task.status === filter;
    const priorityMatch = priorityFilter === 'all' || task.priority === priorityFilter;
    return statusMatch && priorityMatch;
  });

  const addTask = () => {
    if (!newTitle.trim()) return;
    
    const task: Task = {
      id: crypto.randomUUID(),
      title: newTitle,
      description: '',
      priority: newPriority,
      status: 'todo',
      category: newCategory,
      dueDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    setTasks([task, ...tasks]);
    setNewTitle('');
    setIsAdding(false);
  };

  const toggleStatus = (id: string) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const nextStatus: TaskStatus = t.status === 'todo' ? 'in-progress' : t.status === 'in-progress' ? 'completed' : 'todo';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const getPriorityColor = (p: Priority) => {
    switch(p) {
      case 'high': return 'bg-red-400/20 text-red-400 border-red-400/30';
      case 'medium': return 'bg-amber-400/20 text-amber-400 border-amber-400/30';
      case 'low': return 'bg-blue-400/20 text-blue-400 border-blue-400/30';
    }
  };

  const getStatusIcon = (s: TaskStatus) => {
    switch(s) {
      case 'todo': return <Circle size={20} />;
      case 'in-progress': return <Clock size={20} className="text-amber-400" />;
      case 'completed': return <CheckCircle2 size={20} className="text-green-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters Area */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-primary px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
          >
            <Plus size={18} />
            Nova Tarefa
          </button>
          
          <div className="h-6 w-px bg-white/10 mx-2 hidden md:block" />
          
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
            {(['all', 'todo', 'in-progress', 'completed'] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all",
                  filter === s ? "bg-white/10 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"
                )}
              >
                {s === 'all' ? 'Tudo' : s === 'todo' ? 'A fazer' : s === 'in-progress' ? 'Fazendo' : 'Pronto'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
            {(['all', 'high', 'medium', 'low'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all",
                  priorityFilter === p ? "bg-white/10 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"
                )}
              >
                {p === 'all' ? 'Prioridade' : p === 'high' ? 'Alta' : p === 'medium' ? 'Média' : 'Baixa'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="grid grid-cols-1 gap-3">
        <h3 className="section-label mb-2">Tarefas Inteligentes</h3>
        <AnimatePresence mode="popLayout">
          {filteredTasks.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 flex flex-col items-center gap-4 text-center"
            >
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-gray-500">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <p className="font-bold">Nenhuma tarefa encontrada</p>
                <p className="text-sm text-gray-400">Tente mudar os filtros ou crie uma nova.</p>
              </div>
            </motion.div>
          ) : (
            filteredTasks.map(task => (
              <motion.div
                layout
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass-card p-4 flex items-center gap-4 group hover:bg-white/[0.05]"
              >
                <button 
                  onClick={() => toggleStatus(task.id)}
                  className="shrink-0 text-gray-500 hover:scale-110 transition-transform"
                >
                  {getStatusIcon(task.status)}
                </button>
                
                <div className="flex-1 min-w-0">
                  <h4 className={cn(
                    "font-medium transition-all truncate",
                    task.status === 'completed' && "text-gray-500 line-through"
                  )}>
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-1 shrink-0">
                    <span className={cn(
                      "px-2 py-0.5 rounded-md text-[10px] uppercase font-bold border",
                      getPriorityColor(task.priority)
                    )}>
                      {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-gray-500">
                      <Tag size={10} />
                      {task.category}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-gray-500">
                      <Calendar size={10} />
                      {format(new Date(task.dueDate), 'd MMM')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400">
                    <AlertCircle size={18} />
                  </button>
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="p-2 hover:bg-red-400/10 rounded-lg text-red-400"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Add Task Modal overlay */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md glass p-8 shadow-2xl"
            >
              <h3 className="text-xl font-bold mb-6">Criar Nova Tarefa</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 font-bold uppercase mb-1 block">Título</label>
                  <input 
                    autoFocus
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50"
                    placeholder="O que precisa ser feito?"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 font-bold uppercase mb-1 block">Prioridade</label>
                    <select 
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as Priority)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50"
                    >
                      <option value="low" className="bg-gray-900">Baixa</option>
                      <option value="medium" className="bg-gray-900">Média</option>
                      <option value="high" className="bg-gray-900">Alta</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 font-bold uppercase mb-1 block">Categoria</label>
                    <select 
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50"
                    >
                      <option value="Trabalho" className="bg-gray-900">Trabalho</option>
                      <option value="Pessoal" className="bg-gray-900">Pessoal</option>
                      <option value="Estudos" className="bg-gray-900">Estudos</option>
                      <option value="Saúde" className="bg-gray-900">Saúde</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setIsAdding(false)}
                    className="flex-1 px-4 py-3 bg-white/5 rounded-xl text-sm font-bold hover:bg-white/10 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={addTask}
                    className="flex-1 px-4 py-3 bg-primary rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
