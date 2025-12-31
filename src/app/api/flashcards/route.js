import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { calculateSM2 } from "@/lib/sm2";

// 1. FETCH FLASHCARDS FOR A SPECIFIC NOTE
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const noteId = searchParams.get("noteId");

    if (!noteId) {
      return NextResponse.json({ error: "Note ID required" }, { status: 400 });
    }

    const flashcards = await prisma.flashcard.findMany({
      where: { noteId: Number(noteId) },
      orderBy: { nextReview: "asc" }, // Show cards due for review first
    });

    return NextResponse.json(flashcards);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch cards" }, { status: 500 });
  }
}

// 2. UPDATE A FLASHCARD (SM-2 LOGIC)
export async function PUT(req) {
  try {
    const { cardId, quality } = await req.json();

    // Find the existing card data
    const card = await prisma.flashcard.findUnique({ 
      where: { id: cardId } 
    });

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    // Calculate new values using the SM-2 algorithm
    const { repetition, interval, easiness, nextReview } = calculateSM2(
      quality,
      card.repetition,
      card.interval,
      card.easiness
    );

    // Update the database
    const updated = await prisma.flashcard.update({
      where: { id: cardId },
      data: { 
        repetition, 
        interval, 
        easiness, 
        nextReview 
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}