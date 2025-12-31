"use client";
import { useState, useEffect } from "react";

interface Flashcard {
  id: number;
  question: string;
  answer: string;
}

// This tells TypeScript what the "props" are, clearing the red lines in the header
interface ModalProps {
  noteId: number;
  noteContent: string;
  onClose: () => void;
}

export default function FlashcardModal({ noteId, noteContent, onClose }: ModalProps) {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch(`/api/flashcards?noteId=${noteId}`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setCards(data);
          setLoading(false);
        } else {
          await generateNewCards();
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCards();
  }, [noteId]);

  const generateNewCards = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/flashcards/generate", {
        method: "POST",
        body: JSON.stringify({ noteId, content: noteContent }),
      });
      const data = await res.json();
      setCards(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (quality: number) => {
    const card = cards[currentIndex];
    if (!card) return;

    await fetch("/api/flashcards", {
      method: "PUT",
      body: JSON.stringify({ cardId: card.id, quality }),
    });

    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowAnswer(false);
    } else {
      onClose();
    }
  };

  if (loading) return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-gray-900/50 backdrop-blur-md">
      <div className="bg-white p-8 rounded-3xl">
        <p className="animate-pulse font-bold">🧠 Llama is generating cards...</p>
      </div>
    </div>
  );

  const currentCard = cards[currentIndex];
  if (!currentCard) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60" onClick={onClose} />
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 p-8">
        <div className="flex justify-between mb-10">
          <span className="text-xs font-bold text-indigo-500 uppercase">Card {currentIndex + 1} / {cards.length}</span>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="text-center min-h-[150px] flex flex-col justify-center">
          <h2 className="text-[10px] font-black uppercase text-gray-400 mb-2">{showAnswer ? "Answer" : "Question"}</h2>
          <p className="text-xl font-bold text-gray-800">{showAnswer ? currentCard.answer : currentCard.question}</p>
        </div>
        <div className="mt-10">
          {!showAnswer ? (
            <button onClick={() => setShowAnswer(true)} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl">SHOW ANSWER</button>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => handleReview(1)} className="p-3 bg-red-50 text-red-600 font-bold rounded-xl text-xs">Forgot</button>
              <button onClick={() => handleReview(3)} className="p-3 bg-yellow-50 text-yellow-600 font-bold rounded-xl text-xs">Hard</button>
              <button onClick={() => handleReview(5)} className="p-3 bg-green-50 text-green-600 font-bold rounded-xl text-xs">Easy</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}