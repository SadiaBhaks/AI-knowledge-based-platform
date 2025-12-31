"use client";
import { useEffect, useState } from "react";
import AddNoteForm from "@/Components/AddNoteForm";
import NoteCard from "@/Components/NoteCard";

interface Note {
  id: number;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState<string | null>(null); 

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes");
      const data = await res.json();

      
      if (Array.isArray(data)) {
        setNotes(data);
        setError(null);
      } else {
        console.error("API did not return an array:", data);
        setNotes([]); // Reset to empty array so .map doesn't crash
        setError(data.error || "Failed to load notes");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setNotes([]); 
      setError("Network error. Is the server running?");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">My Notes</h1>

      {/* Show error message if something went wrong */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <AddNoteForm onSuccess={fetchNotes} />

      <div className="mt-6">
        
        {Array.isArray(notes) && notes.length === 0 && !error && <p>No notes yet.</p>}

        {Array.isArray(notes) && notes.map((note) => (
          <NoteCard key={note.id} note={note} onRefresh={fetchNotes} />
        ))}
      </div>
    </div>
  );
}