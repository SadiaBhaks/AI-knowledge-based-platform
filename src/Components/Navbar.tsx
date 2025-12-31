"use client";

import Link from "next/link";

import { Brain } from "lucide-react";



export default function Navbar() {

  return (

    <nav className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">

      <div className="flex items-center gap-2">

        <Brain className="w-8 h-8 text-indigo-600" />

        <Link href="/" className="text-xl font-bold tracking-tighter text-gray-900">

          AI KNOWLEDGE HUB

        </Link>

      </div>

     

      <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest">

        Llama 3.3 Powered

      </div>

    </nav>

  );

}
