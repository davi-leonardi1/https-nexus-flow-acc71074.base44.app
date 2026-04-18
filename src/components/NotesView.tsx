import { Note } from '../types';
import { 
  Plus, 
  Trash2, 
  FileText, 
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, Dispatch, SetStateAction } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../lib/utils';

interface Props {
  notes: Note[];
  setNotes: Dispatch<SetStateAction<Note[]>>;
}

export default function NotesView({ notes, setNotes }: Props) {
  const [selectedId, setSelectedId] = useState(notes[0]?.id || null);
  
  const currentNote = notes.find(n => n.id === selectedId);

  const updateContent = (content: string) => {
    setNotes(prev => prev.map(n => 
      n.id === selectedId 
        ? { ...n, content, updatedAt: new Date().toISOString() } 
        : n
    ));
  };

  const addNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      content: '',
      updatedAt: new Date().toISOString()
    };
    setNotes([newNote, ...notes]);
    setSelectedId(newNote.id);
  };

  const deleteNote = (id: string) => {
    const nextNotes = notes.filter(n => n.id !== id);
    setNotes(nextNotes);
    if (selectedId === id) {
      setSelectedId(nextNotes[0]?.id || null);
    }
  };

  return (
    <div className="flex h-[70vh] glass p-0 overflow-hidden">
      {/* Sidebar List */}
      <div className="w-64 border-r border-white/5 flex flex-col shrink-0">
        <div className="p-4 flex items-center justify-between border-b border-white/5">
          <h3 className="section-label mb-0">Minhas Notas</h3>
          <button 
            onClick={addNote}
            className="p-1.5 hover:bg-white/5 rounded-lg text-primary transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {notes.map(note => (
            <button
              key={note.id}
              onClick={() => setSelectedId(note.id)}
              className={cn(
                "w-full text-left p-3 rounded-xl transition-all group",
                selectedId === note.id 
                  ? "bg-primary text-white" 
                  : "hover:bg-white/5 text-gray-400 hover:text-white"
              )}
            >
              <h4 className="font-semibold text-sm truncate mb-1">
                {note.content.split('\n')[0] || 'Nota Vazia'}
              </h4>
              <p className="text-[10px] opacity-60">
                {format(new Date(note.updatedAt), 'd MMM, HH:mm', { locale: ptBR })}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Editor Area */}
      {selectedId ? (
        <div className="flex-1 flex flex-col bg-white/[0.01]">
          <div className="p-4 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <FileText size={14} />
              <span>{currentNote?.content.length} caracteres</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400">
                <Maximize2 size={16} />
              </button>
              <button 
                onClick={() => deleteNote(selectedId)}
                className="p-2 hover:bg-red-400/10 rounded-lg text-red-400"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          <textarea
            value={currentNote?.content}
            onChange={(e) => updateContent(e.target.value)}
            placeholder="Comece a escrever aqui..."
            className="flex-1 p-8 bg-transparent focus:outline-none resize-none text-gray-200 leading-relaxed"
          />
        </div>
      ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-gray-500">
            <FileText size={48} className="mb-4 opacity-20" />
            <p>Selecione ou crie uma nota para começar</p>
          </div>
      )}
    </div>
  );
}
