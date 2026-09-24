"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, MapPin, Calendar, Compass, MessageCircle, ArrowLeft } from "lucide-react";
import confetti from "canvas-confetti";

interface SwipeDeckProps {
  userProfile: any;
  onEditProfile: () => void;
}

export default function SwipeDeck({ userProfile, onEditProfile }: SwipeDeckProps) {
  const [cards, setCards] = useState([
    {
      id: 1,
      name: "Aarav Sharma",
      age: 24,
      destination: userProfile?.destination || "Goa",
      travel_date: "16 Oct - 22 Oct",
      role: "traveler",
      bio: "Visiting for a week! Looking for someone to explore Old Goa and check out secret sunset cliffs.",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
      tags: ["Cafe Hopper", "Trekker"],
    },
    {
      id: 2,
      name: "Rhea Sen",
      age: 23,
      destination: userProfile?.destination || "Goa",
      travel_date: "Resident",
      role: "local",
      bio: "Local resident. Happy to show you around the hidden spots tourist guides skip.",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80",
      tags: ["Foodie", "Beach Bum"],
    },
    {
      id: 3,
      name: "Kabir Mehta",
      age: 25,
      destination: userProfile?.destination || "Goa",
      travel_date: "18 Oct - 25 Oct",
      role: "traveler",
      bio: "Solo road-tripper. Up for scootering along the coastline and grabbing seafood.",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80",
      tags: ["Photographer", "Nightlife"],
    },
  ]);

  const [matchedUser, setMatchedUser] = useState<any | null>(null);

  const handleSwipe = (direction: "left" | "right") => {
    const currentCard = cards[cards.length - 1];
    if (direction === "right") {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#14B8A6", "#06B6D4", "#2DD4BF"],
      });
      setMatchedUser(currentCard);
    }
    setCards((prev) => prev.slice(0, -1));
  };

  const activeCard = cards[cards.length - 1];

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-[#041217] text-teal-50 flex flex-col justify-between p-4 pb-8 relative">
      {/* Header */}
      <div className="flex justify-between items-center py-2 px-1 border-b border-teal-900/50">
        <button onClick={onEditProfile} className="flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-200 transition">
          <ArrowLeft className="w-4 h-4" /> Edit Profile
        </button>
        <div className="text-center">
          <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest block">Destination</span>
          <h2 className="text-sm font-bold flex items-center justify-center gap-1 text-white">
            <MapPin className="w-3.5 h-3.5 text-teal-400" /> {userProfile?.destination || "Explore"}
          </h2>
        </div>
        <span className="text-xs px-2.5 py-1 bg-[#0E2A32] rounded-full border border-teal-800/50 text-teal-300">
          {cards.length} left
        </span>
      </div>

      {/* Swipe Deck Viewport */}
      <div className="relative w-full h-[520px] flex items-center justify-center my-auto">
        <AnimatePresence>
          {activeCard ? (
            <motion.div
              key={activeCard.id}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.x > 100) handleSwipe("right");
                else if (info.offset.x < -100) handleSwipe("left");
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl border border-teal-600/30 bg-[#0E2A32] cursor-grab active:cursor-grabbing select-none"
            >
              <img src={activeCard.photo} alt={activeCard.name} className="w-full h-full object-cover pointer-events-none brightness-95" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#041217] via-[#041217]/40 to-transparent pointer-events-none" />

              {/* Tag Badge */}
              <div className="absolute top-4 left-4 flex gap-2 pointer-events-none">
                <span
                  className={`text-xs px-3 py-1 font-bold rounded-full uppercase tracking-wider backdrop-blur-md shadow-md ${
                    activeCard.role === "local"
                      ? "bg-teal-400 text-slate-950 shadow-teal-500/20"
                      : "bg-teal-950/80 text-teal-300 border border-teal-500/40"
                  }`}
                >
                  {activeCard.role === "local" ? "🌟 Local Guide" : "✈️ Traveler"}
                </span>
              </div>

              {/* Profile Bio Footer */}
              <div className="absolute bottom-5 left-5 right-5 space-y-2 pointer-events-none">
                <h3 className="text-2xl font-bold text-white">
                  {activeCard.name}, <span className="text-teal-200 font-normal">{activeCard.age}</span>
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-teal-300 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" /> {activeCard.travel_date}
                </div>

                <p className="text-xs text-teal-100/80 line-clamp-2 leading-relaxed">{activeCard.bio}</p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeCard.tags.map((tag) => (
                    <span key={tag} className="text-[10px] px-2.5 py-0.5 bg-teal-950/70 rounded-md backdrop-blur-sm border border-teal-500/30 text-teal-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="text-center p-8 border border-dashed border-teal-800/40 rounded-3xl bg-[#0E2A32]/40">
              <Compass className="w-12 h-12 text-teal-400 mx-auto mb-3 animate-spin" />
              <h4 className="font-bold text-teal-200">All Travelers Explored!</h4>
              <p className="text-xs text-teal-400/60 mt-1 max-w-[200px] mx-auto">
                Check back soon or edit your destination to connect with others.
              </p>
              <button
                onClick={onEditProfile}
                className="mt-4 px-4 py-2 bg-[#0E2A32] hover:bg-teal-900/50 text-xs font-semibold rounded-xl border border-teal-700/50 text-teal-300 transition"
              >
                Change Destination
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Swipe Action Buttons */}
      {activeCard && (
        <div className="flex justify-center gap-8 items-center pt-2">
          <button
            onClick={() => handleSwipe("left")}
            className="w-14 h-14 rounded-full bg-[#0E2A32] border border-teal-800/60 flex items-center justify-center text-teal-400 hover:text-rose-400 hover:border-rose-400/40 shadow-lg active:scale-90 transition"
          >
            <X className="w-7 h-7" />
          </button>
          <button
            onClick={() => handleSwipe("right")}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-teal-400 to-cyan-400 flex items-center justify-center text-slate-950 shadow-xl shadow-teal-500/30 hover:scale-105 active:scale-90 transition"
          >
            <Heart className="w-8 h-8 fill-slate-950 stroke-none" />
          </button>
        </div>
      )}

      {/* Instant Match Popup Modal */}
      {matchedUser && (
        <div className="fixed inset-0 z-50 bg-[#041217]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0E2A32] border border-teal-600/40 rounded-3xl p-6 max-w-xs w-full text-center space-y-4 shadow-2xl">
            <h3 className="text-2xl font-black bg-gradient-to-r from-teal-300 to-cyan-300 bg-clip-text text-transparent">
              It&apos;s a Travel Match!
            </h3>
            <p className="text-xs text-teal-200/80">
              You and <span className="text-white font-semibold">{matchedUser.name}</span> will both be in{" "}
              <span className="text-cyan-300 font-bold">{matchedUser.destination}</span>!
            </p>

            <div className="flex justify-center -space-x-4 py-2">
              <img
                src={userProfile?.photo_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600"}
                alt="You"
                className="w-16 h-16 rounded-full object-cover border-2 border-teal-400 shadow-md"
              />
              <img
                src={matchedUser.photo}
                alt={matchedUser.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400 shadow-md"
              />
            </div>

            <button
              onClick={() => {
                alert(`Chat room opened with ${matchedUser.name}! "Hey, let's explore ${matchedUser.destination} together!"`);
                setMatchedUser(null);
              }}
              className="w-full py-3 bg-gradient-to-r from-teal-400 to-cyan-400 hover:brightness-110 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25 transition"
            >
              <MessageCircle className="w-4 h-4" /> Send Travel Message
            </button>

            <button
              onClick={() => setMatchedUser(null)}
              className="w-full text-xs text-teal-400/70 hover:text-teal-200 py-1 transition"
            >
              Keep Browsing
            </button>
          </div>
        </div>
      )}
    </div>
  );
}