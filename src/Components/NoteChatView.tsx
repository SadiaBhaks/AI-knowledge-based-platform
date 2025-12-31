"use client";
import { useState, useRef, useEffect } from "react";

interface NoteChatViewProps {
  initialNoteContent: string;
  noteTitle: string;
}

interface ChatMessage {
  role: "user" | "ai";
  text: string;
}

export default function NoteChatView({ initialNoteContent, noteTitle }: NoteChatViewProps) {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, loading]);

  const handleChat = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message;
    setMessage("");
    setChatHistory((prev) => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, noteContent: initialNoteContent }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to get AI response");

      setChatHistory((prev) => [...prev, { role: "ai", text: data.reply }]);
    } catch (err: unknown) {
      const errorText = err instanceof Error ? err.message : "Something went wrong";
      setChatHistory((prev) => [...prev, { role: "ai", text: `Error: ${errorText}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="p-6 bg-white border-b border-gray-100 shadow-sm">
        <h3 className="text-xl font-black text-purple-700 flex items-center gap-2">
          <span>⚡</span> {noteTitle}
        </h3>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
          AI Chat Mode &bull; Context Loaded
        </p>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4"
      >
        <div className="bg-purple-100 text-purple-800 p-4 rounded-2xl rounded-tl-none max-w-[85%] text-sm font-medium shadow-sm">
          {`Hi! I've analyzed your note &quot;${noteTitle}&quot;. What would you like to know about it?`}
        </div>

        {chatHistory.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div 
              className={`max-w-[85%] p-4 rounded-2xl text-sm shadow-sm ${
                msg.role === "user" 
                ? "bg-blue-600 text-white rounded-tr-none" 
                : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-gray-100">
        <div className="relative flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleChat()}
            placeholder="Ask about this note..."
            className="w-full p-4 pr-16 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
          <button
            onClick={handleChat}
            disabled={loading || !message.trim()}
            className="absolute right-2 p-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:bg-gray-300 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}