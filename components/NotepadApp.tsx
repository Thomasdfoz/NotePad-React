
import React, { useState, useEffect, useCallback } from 'react';
import { getNotesForUser, saveNotesForUser } from '../services/storageService';
import type { User, Note } from '../types';

interface NotepadAppProps {
  user: User;
  onLogout: () => void;
}

const NotepadApp: React.FC<NotepadAppProps> = ({ user, onLogout }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const userNotes = getNotesForUser(user.username);
    setNotes(userNotes);
    if (userNotes.length > 0) {
      setActiveNoteId(userNotes[0].id);
    }
  }, [user.username]);

  const saveNotes = useCallback((updatedNotes: Note[]) => {
    saveNotesForUser(user.username, updatedNotes);
  }, [user.username]);

  const handleNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    setActiveNoteId(newNote.id);
    saveNotes(updatedNotes);
    if(window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleNoteSelect = (id: string) => {
    setActiveNoteId(id);
     if(window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleNoteUpdate = (id: string, title: string, content: string) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, title, content, updatedAt: new Date().toISOString() } : note
    );
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  const handleNoteDelete = (id: string) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    if (activeNoteId === id) {
      setActiveNoteId(updatedNotes.length > 0 ? updatedNotes[0].id : null);
    }
    saveNotes(updatedNotes);
  };
  
  const activeNote = notes.find((note) => note.id === activeNoteId);

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100">
      {/* Sidebar */}
      <aside className={`absolute md:relative z-20 flex flex-col bg-slate-800/80 backdrop-blur-sm h-full transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64 md:w-72' : 'w-0 overflow-hidden'}`}>
         <div className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
          <h1 className="text-xl font-bold text-white">My Notes</h1>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-4 flex-shrink-0">
            <button onClick={handleNewNote} className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
            New Note
            </button>
        </div>
        <nav className="flex-1 overflow-y-auto">
            <ul>
            {notes.map((note) => (
                <li key={note.id}>
                <button
                    onClick={() => handleNoteSelect(note.id)}
                    className={`w-full text-left p-4 border-l-4 ${activeNoteId === note.id ? 'bg-slate-700/50 border-sky-400' : 'border-transparent hover:bg-slate-700/30'}`}
                >
                    <h3 className="font-semibold truncate text-slate-200">{note.title}</h3>
                    <p className="text-xs text-slate-400 truncate">{note.content || 'No content'}</p>
                </button>
                </li>
            ))}
            </ul>
        </nav>
        <div className="p-4 mt-auto border-t border-slate-700 flex items-center justify-between">
            <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center font-bold text-white mr-3">
                    {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-slate-300">{user.username}</span>
            </div>
            <button onClick={onLogout} className="text-slate-400 hover:text-white" title="Logout">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700 md:hidden">
            <button onClick={() => setIsSidebarOpen(true)} className="text-slate-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <span className="font-bold text-lg">{activeNote?.title || 'Notepad'}</span>
             {activeNote ? (
                <button onClick={() => handleNoteDelete(activeNote.id)} className="text-red-400 hover:text-red-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
            ) : <div className="w-6 h-6"></div>}
        </header>

        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          {activeNote ? (
            <div className="max-w-4xl mx-auto h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                     <div className="text-xs text-slate-500">
                        Last updated: {new Date(activeNote.updatedAt).toLocaleString()}
                    </div>
                    <button onClick={() => handleNoteDelete(activeNote.id)} className="hidden md:block text-slate-400 hover:text-red-400 font-medium py-2 px-4 rounded-lg hover:bg-slate-700/50 transition-colors flex items-center text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                        Delete
                    </button>
                </div>
              <input
                type="text"
                value={activeNote.title}
                onChange={(e) => handleNoteUpdate(activeNote.id, e.target.value, activeNote.content)}
                className="bg-transparent text-4xl font-bold text-white focus:outline-none mb-4"
                placeholder="Note Title"
              />
              <textarea
                value={activeNote.content}
                onChange={(e) => handleNoteUpdate(activeNote.id, activeNote.title, e.target.value)}
                className="bg-slate-900 flex-1 resize-none text-lg text-slate-300 focus:outline-none w-full leading-relaxed"
                placeholder="Start writing..."
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <h2 className="text-2xl font-semibold">No note selected</h2>
              <p className="mt-2">Select a note from the list or create a new one.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NotepadApp;
