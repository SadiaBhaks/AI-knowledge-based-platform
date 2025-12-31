"use client"; // Change layout to client component for state management
import { useState } from "react";
import Navbar from "@/Components/Navbar";
import Sidebar from "@/Components/Sidebar";
import AuthProvider from "@/Components/AuthProvider";
import { Menu } from "lucide-react"; // Import Menu icon
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Changed this from true to false so it doesn't show up automatically
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <html lang="en" className="h-full w-full">
      <body className="h-full w-full bg-gray-50">
        <AuthProvider>
          <Navbar />
          
          {/* Floating Menu Button to open sidebar if it's closed */}
          {!isSidebarOpen && (
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="fixed bottom-8 left-8 z-[110] bg-indigo-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}

          <div className="flex h-full w-full">
            <Sidebar 
              isOpen={isSidebarOpen} 
              onClose={() => setIsSidebarOpen(false)} 
            />
            
            <main className={`flex-1 pt-16 min-h-full transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
              <div className="h-full w-full ">
                {children}
              </div>
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}