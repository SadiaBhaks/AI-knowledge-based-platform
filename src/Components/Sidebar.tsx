"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlusCircle, UserPlus, Info, BookOpen, X } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  // If isOpen is false, the sidebar translates off-screen to the left
  return (
    <aside 
      className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-[100] transition-transform duration-300 ease-in-out transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-4 flex justify-between items-center border-b border-gray-100">
        <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Menu</span>
        {/* The Cross Button */}
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-2">
        {[
         
          { name: "Register", href: "/register", icon: UserPlus },
          { name: "AI Info", href: "/ai-info", icon: Info },
          { name: "My Library", href: "/dashboard", icon: BookOpen },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
              pathname === item.href ? "bg-indigo-50 text-indigo-600" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm font-bold">{item.name}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}