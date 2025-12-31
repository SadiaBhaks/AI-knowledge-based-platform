import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// 1. GET USER-SPECIFIC NOTES
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notes = await prisma.note.findMany({ 
      where: { authorId: session.user.id }, 
      orderBy: { createdAt: "desc" } 
    });
    
    return NextResponse.json(notes);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch notes";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// 2. CREATE A NOTE LINKED TO USER
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, tags } = await request.json();

    const tagsArray = Array.isArray(tags) 
      ? tags 
      : tags?.split(",").map((t: string) => t.trim()).filter(Boolean) || [];

    const newNote = await prisma.note.create({ 
      data: { 
        title, 
        content, 
        tags: tagsArray,
        authorId: session.user.id 
      } 
    });
    
    return NextResponse.json(newNote, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create note";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// 3. UPDATE A NOTE
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, title, content, tags } = await request.json();

    const tagsArray = Array.isArray(tags) 
      ? tags 
      : tags?.split(",").map((t: string) => t.trim()).filter(Boolean) || [];

    const updatedNote = await prisma.note.update({
      where: { 
        id: Number(id),
        authorId: session.user.id 
      },
      data: { title, content, tags: tagsArray },
    });

    return NextResponse.json(updatedNote);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// 4. DELETE A NOTE
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await request.json();

    await prisma.note.delete({ 
      where: { 
        id: Number(id),
        authorId: session.user.id 
      } 
    });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}