"use client";

import { useState, useEffect } from "react";

import { signIn, useSession, signOut } from "next-auth/react";

import AddNoteForm from "@/Components/AddNoteForm";

import NoteCard from "@/Components/NoteCard";



interface Note {

  id: number;

  title: string;

  content: string;

  tags: string[];

  createdAt: string;

}



export default function HomePage() {

  const { data: session, status } = useSession();

  const [showAuthForm, setShowAuthForm] = useState(false);

  const [isLoginView, setIsLoginView] = useState(true);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [notes, setNotes] = useState<Note[]>([]);

  const [loadingNotes, setLoadingNotes] = useState(false);



  const fetchNotes = async () => {

    setLoadingNotes(true);

    try {

      const res = await fetch("/api/notes");

      if (res.ok) {

        const data = await res.json();

        setNotes(data);

      }

    } catch (err) {

      console.error("Failed to load notes", err);

    } finally {

      setLoadingNotes(false);

    }

  };



  useEffect(() => {

    if (session) fetchNotes();

  }, [session]);



  if (status === "loading") {

    return (

      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">

        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>

        <p className="text-gray-500 font-medium">Loading Workspace...</p>

      </div>

    );

  }



  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    setError("");

    if (isLoginView) {

      const result = await signIn("credentials", { redirect: false, email, password });

      if (result?.error) setError("Invalid email or password");

    } else {

      const res = await fetch("/api/auth/register", {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ email, password }),

      });

      if (res.ok) {

        setIsLoginView(true);

        alert("Registration successful! Please log in.");

      } else {

        const data = await res.json();

        setError(data.message || "Registration failed");

      }

    }

  };



 

  if (!session) {

    return (

      <main className="flex flex-col items-center justify-center min-h-screen  bg-gray-50">

        {!showAuthForm ? (

         <div className="relative min-h-screen w-full flex flex-col items-center justify-center text-center px-4 bg-gray-50 overflow-hidden">



  {/* FULL SCREEN WAVE BACKGROUND */}

  <svg

    className="absolute inset-0 w-full h-full"

    viewBox="0 0 1440 900"

    preserveAspectRatio="none"

  >

    <path

      fill="#2563eb"

      fillOpacity="0.08"

      d="M0,320L80,336C160,352,320,384,480,368C640,352,800,288,960,272C1120,256,1280,288,1360,304L1440,320L1440,0L0,0Z"

    />

    <path

      fill="#2563eb"

      fillOpacity="0.05"

      d="M0,480L120,464C240,448,480,416,720,432C960,448,1200,512,1320,544L1440,576L1440,0L0,0Z"

    />

  </svg>



  {/* CONTENT */}

  <h1 className="relative z-10 text-4xl md:text-7xl font-black mb-6 text-gray-900 tracking-tighter">

    My AI <span className="text-blue-600">Workspace</span>

  </h1>



  <p className="relative z-10 text-gray-500 mb-10 max-w-2xl text-lg md:text-xl font-medium leading-relaxed mx-auto">

    The ultimate second brain. Create notes and chat with them using Llama 3.3.

  </p>



  <button

    onClick={() => setShowAuthForm(true)}

    className="relative z-10 px-12 py-5 bg-blue-600 text-white font-black rounded-[2rem] hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 hover:scale-105 active:scale-95"

  >

    Get Started 📘

  </button>

</div>



        ) : (

          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl w-full max-w-md border border-gray-100 animate-in zoom-in">

            <h2 className="text-3xl font-black mb-2 text-center text-gray-900">{isLoginView ? "Welcome Back" : "Create Account"}</h2>

            {error && <div className="bg-red-50 text-red-500 text-sm p-4 rounded-xl mb-6 text-center font-bold">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">

              <input type="email" placeholder="Email Address" className="w-full p-4 bg-gray-50 rounded-xl outline-none text-black" value={email} onChange={(e) => setEmail(e.target.value)} required />

              <input type="password" placeholder="Password" className="w-full p-4 bg-gray-50 rounded-xl outline-none text-black" value={password} onChange={(e) => setPassword(e.target.value)} required />

              <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-black active:scale-95 transition-all">{isLoginView ? "SIGN IN" : "REGISTER"}</button>

            </form>

            <button onClick={() => setIsLoginView(!isLoginView)} className="w-full mt-6 text-sm font-bold text-blue-600">{isLoginView ? "New here? Create an account" : "Already have an account? Sign in"}</button>

          </div>

        )}

      </main>

    );

  }



  return (

    <div className="min-h-screen bg-gray-50 text-black font-sans">

      <nav className="p-4 flex justify-between items-center bg-white/80 backdrop-blur-md border-b sticky top-0 z-[50] shadow-sm">

        <div className="flex items-center gap-2">

          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black">✨</div>

          <span className="font-black text-gray-900 tracking-tight">AI Workspace</span>

        </div>

        <div className="flex items-center gap-4">

          <div className="hidden sm:flex flex-col items-end">

             <span className="text-[10px] font-black text-gray-400 uppercase">Current Session</span>

             <span className="text-xs font-bold text-gray-700">{session.user?.email}</span>

          </div>

          <button onClick={() => signOut()} className="px-4 py-2 text-xs font-black text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-all active:scale-95">LOGOUT</button>

        </div>

      </nav>



      <main className="p-6 w-full px-4 md:px-10">

        <div className="mb-10 mt-4">

          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Your Notes</h2>

          <p className="text-gray-500 font-medium">Query your second brain with Llama 3.3 AI.</p>

        </div>



        <div className="max-w-3xl mx-auto mb-16">

           <AddNoteForm onSuccess={fetchNotes} />

        </div>



       

        <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-8 items-start pb-20">

          {loadingNotes ? (

            <div className="col-span-full flex flex-col items-center py-20">

               <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>

               <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Fetching notes...</p>

            </div>

          ) : notes.length === 0 ? (

            <div className="col-span-full text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-200">

               <p className="text-gray-400 font-bold text-lg">No notes found. Create your first one above!</p>

            </div>

          ) : (

            notes.map((note) => (

              <NoteCard key={note.id} note={note} onRefresh={fetchNotes} />

            ))

          )}

        </div>

      </main>

    </div>

  );

}