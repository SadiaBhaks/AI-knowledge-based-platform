"use client";
import { useState } from "react";

interface AddNoteFormProps {
  onSuccess: () => void; 
  note?: { id: number; title: string; content: string; tags: string[] }; 
}

export default function AddNoteForm({ onSuccess, note }: AddNoteFormProps) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [tags, setTags] = useState(note?.tags?.join(", ") || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setIsSubmitting(true);

    try {
      const method = note ? "PUT" : "POST";
      const body = note 
        ? { id: note.id, title, content, tags } 
        : { title, content, tags };

      const response = await fetch("/api/notes", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to save note");
      }

      // Clear form only if it's a new note (POST)
      if (!note) {
        setTitle("");
        setContent("");
        setTags("");
      }
      
      onSuccess();
    } catch (error) {
      alert("Error: Could not save the note. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="mb-6 space-y-3 bg-white p-5 rounded-xl shadow-sm border border-gray-200"
    >
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">
          Note Title
        </label>
        <input
          type="text"
          placeholder="Enter a title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
          className="border p-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold transition-all"
        />
      </div>
      
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">
          Content
        </label>
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
          rows={5}
          className="border p-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all"
        />
      </div>
      
      <div className="pt-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1 block mb-1">
          Tags (separate with commas)
        </label>
        <input
          type="text"
          placeholder="e.g. ideas, work, personal"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          disabled={isSubmitting}
          className="w-full p-3 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
        />
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full text-white px-4 py-3 rounded-lg font-bold transition-all mt-4 flex items-center justify-center gap-2 ${
          isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
        }`}
      >
        {isSubmitting ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Saving...
          </>
        ) : (
          note ? "Update Note" : "Save Note ✨"
        )}
      </button>
    </form>
  );
}