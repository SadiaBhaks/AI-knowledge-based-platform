import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, noteContent } = await req.json();

    if (!message || !noteContent) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { 
            role: "system", 
            content: "You are a helpful notepad assistant. Answer questions based ONLY on the user's notes provided." 
          },
          { 
            role: "user", 
            content: `MY NOTES:\n${noteContent}\n\nUSER QUESTION: ${message}` 
          }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Groq API Error");
    }

    return NextResponse.json({ reply: data.choices[0].message.content });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Something went wrong";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}