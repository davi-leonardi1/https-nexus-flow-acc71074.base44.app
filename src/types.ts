export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  category: string;
  dueDate: string;
  createdAt: string;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  completions: string[]; // dates in YYYY-MM-DD
  streak: number;
  color: string;
}

export interface Note {
  id: string;
  content: string;
  updatedAt: string;
}

export interface AIInsight {
  summary: string;
  suggestions: string[];
  productivityScore: number;
}
