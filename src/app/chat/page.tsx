"use client";
import NoteChatView from "@/Components/NoteChatView";

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto h-[85vh] bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <NoteChatView 
          initialNoteContent="" // Start empty so user can paste anything
          noteTitle="General Assistant" 
        />
      </div>
    </div>
  );
}