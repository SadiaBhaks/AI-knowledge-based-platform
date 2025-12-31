"use client";
import { useState } from "react";
import AddNoteForm from "./AddNoteForm";
import NoteChatView from "./NoteChatView";
// You'll need to create this component next
import FlashcardModal from "./FlashcardModal"; 

interface Note {
  id: number;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
}

interface NoteCardProps {
  note: Note;
  onRefresh: () => void;
}

export default function NoteCard({ note, onRefresh }: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showFlashcards, setShowFlashcards] = useState(false); // New state
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch("/api/notes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: note.id }),
      });

      if (res.ok) {
        setShowModal(false);
        onRefresh();
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("Failed to delete note");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="group border p-6 mb-4 rounded-2xl shadow-sm bg-white hover:shadow-md transition-all border-gray-100 relative flex flex-col h-full overflow-visible">
        {isEditing ? (
          <div className="relative h-full">
            <button 
              onClick={() => setIsEditing(false)}
              className="absolute -top-2 -right-2 text-xs bg-gray-100 p-1.5 rounded-full hover:bg-gray-200 z-10 shadow-sm"
            >
              ✕
            </button>
            <AddNoteForm
              note={note}
              onSuccess={() => {
                setIsEditing(false);
                onRefresh();
              }}
            />
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start mb-3">
              <h2 className="font-bold text-xl text-gray-900 leading-tight">
                {note.title}
              </h2>
              <span className="text-[10px] font-bold text-gray-400 uppercase bg-gray-50 px-2 py-1 rounded shrink-0 ml-2">
                {new Date(note.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="flex-grow mb-6">
              <p className="text-gray-600 text-sm whitespace-pre-wrap leading-relaxed">
                {note.content}
              </p>
            </div>

            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-6">
                {note.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[10px] font-bold uppercase"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-2 pt-4 border-t border-gray-100 mt-auto">
              <button
                onClick={() => setShowChat(true)}
                className="flex-grow px-3 py-2 bg-purple-600 text-white text-xs font-black rounded-xl hover:bg-purple-700 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
              >
                <span>⚡</span> CHAT
              </button>

              {/* NEW SMART FLASHCARD BUTTON */}
              <button
                onClick={() => setShowFlashcards(true)}
                className="px-3 py-2 bg-indigo-50 text-indigo-600 text-xs font-black rounded-xl hover:bg-indigo-100 transition-all active:scale-95 flex items-center gap-2"
              >
                🧠 SMART REVIEW
              </button>

              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-2 bg-gray-50 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-200 transition-all active:scale-95"
              >
                EDIT
              </button>

              <button
                onClick={() => setShowModal(true)}
                className="px-3 py-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>

      {/* FLASHCARD MODAL OVERLAY */}
      {showFlashcards && (
        <FlashcardModal 
          noteId={note.id} 
          noteContent={note.content} 
          onClose={() => setShowFlashcards(false)} 
        />
      )}

      {showChat && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowChat(false)} />
          <div className="bg-white w-full max-w-4xl h-[85vh] rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col animate-in zoom-in duration-300">
            <button 
              onClick={() => setShowChat(false)}
              className="absolute top-6 right-6 z-20 p-2 bg-white/90 backdrop-blur shadow-md rounded-full hover:bg-gray-100 text-gray-500 transition-all active:scale-90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <NoteChatView initialNoteContent={note.content} noteTitle={note.title} />
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[100]">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => !isDeleting && setShowModal(false)} />
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-[90%] max-w-sm text-center relative z-10 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black mb-2 text-gray-900">Delete Note?</h2>
            <p className="text-gray-500 mb-8">Are you sure? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button disabled={isDeleting} onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all">
                Cancel
              </button>
              <button disabled={isDeleting} onClick={handleDelete} className="flex-1 px-4 py-3 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all flex items-center justify-center gap-2">
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}