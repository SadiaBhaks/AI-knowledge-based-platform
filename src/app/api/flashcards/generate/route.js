import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { noteId, content } = await req.json();

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a study assistant. Return ONLY a JSON object with a 'flashcards' array. Each item needs 'question' and 'answer' keys.",
        },
        { role: "user", content: content },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    const rawContent = chatCompletion.choices[0]?.message?.content;
    const parsedData = JSON.parse(rawContent || "{}");
    const cardsArray = parsedData.flashcards || [];

    const savedCards = [];
    for (const card of cardsArray) {
      const newCard = await prisma.flashcard.create({
        data: {
          question: card.question,
          answer: card.answer,
          noteId: Number(noteId),
          interval: 0,
          repetition: 0,
          easiness: 2.5,
          nextReview: new Date(),
        },
      });
      savedCards.push(newCard);
    }

    return NextResponse.json(savedCards);
  } catch (error) {
    console.error("Llama Error:", error);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}