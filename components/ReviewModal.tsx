"use client";

import React, { useState } from "react";
import { Star, X } from "lucide-react";
import { Review } from "../types/travel";

interface ReviewModalProps {
  title: string;
  itemType: "Itinerary" | "Stay" | "Dining";
  onClose: () => void;
  onSubmitReview: (review: Review) => void;
}

export default function ReviewModal({ title, itemType, onClose, onSubmitReview }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [author, setAuthor] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !author.trim()) return;

    const newReview: Review = {
      id: Date.now().toString(),
      author: author.trim(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${author.trim()}`,
      rating,
      date: "Just now",
      comment: comment.trim(),
    };

    onSubmitReview(newReview);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FBF9F5] w-full max-w-md rounded-3xl p-6 border border-[#E7E2D8] shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#EAE5DA] text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-[#1F1C18]">Rate & Review</h3>
        <p className="text-xs text-[#706B63] mt-0.5">
          Share your experience for <span className="font-semibold text-[#E15A44]">{title}</span>
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Your Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 text-[#E15A44] transition hover:scale-110"
                >
                  <Star className={`w-6 h-6 ${star <= rating ? "fill-[#E15A44]" : "stroke-[#E15A44] fill-none"}`} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Your Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Aditi Rao"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full bg-white border border-[#DDD7CD] rounded-xl px-3.5 py-2 text-xs text-[#1F1C18] focus:outline-none focus:border-[#E15A44]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Your Detailed Experience</label>
            <textarea
              required
              rows={3}
              placeholder="Was the food fresh? How was the host and view?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-white border border-[#DDD7CD] rounded-xl p-3 text-xs text-[#1F1C18] focus:outline-none focus:border-[#E15A44]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#E15A44] hover:bg-[#c94d3a] text-white text-xs font-bold rounded-xl shadow-lg transition"
          >
            Submit Verified Review
          </button>
        </form>
      </div>
    </div>
  );
}