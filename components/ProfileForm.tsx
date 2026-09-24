"use client";
import React, { useState } from "react";
import { Camera, MapPin, Calendar, Compass, Sparkles } from "lucide-react";

interface ProfileFormProps {
  onComplete: (profile: any) => void;
}

export default function ProfileForm({ onComplete }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    home_city: "",
    destination: "",
    travel_date: "",
    travel_role: "traveler",
    bio: "",
    tags: [] as string[],
    photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
  });

  const availableTags = ["Cafe Hopper", "Trekker", "Nightlife", "Solo Explorer", "Photographer", "Foodie", "Beach Bum"];

  const toggleTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, photo_url: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.destination.trim()) {
      alert("Please fill in your name and destination!");
      return;
    }
    onComplete(formData);
  };

  return (
    <div className="w-full max-w-md mx-auto p-5 bg-[#041217] text-teal-50 min-h-screen pb-12">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="text-teal-400 w-6 h-6" />
        <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-teal-400 via-cyan-300 to-teal-200 bg-clip-text text-transparent">
          Create Travel Profile
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile Picture */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-teal-400/40 shadow-xl shadow-teal-950">
            <img src={formData.photo_url} alt="Profile" className="w-full h-full object-cover" />
            <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer hover:bg-black/60 transition">
              <Camera className="w-6 h-6 text-white" />
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>
          <p className="text-xs text-teal-400/70">Tap to upload your picture</p>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2">
            <label className="text-xs text-teal-300/80">Your Name</label>
            <input
              required
              className="w-full bg-[#0E2A32] border border-teal-800/40 rounded-xl px-3 py-2.5 text-sm text-white placeholder-teal-600 focus:outline-none focus:border-teal-400"
              placeholder="e.g. Samiksha"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs text-teal-300/80">Age</label>
            <input
              required
              type="number"
              className="w-full bg-[#0E2A32] border border-teal-800/40 rounded-xl px-3 py-2.5 text-sm text-white placeholder-teal-600 focus:outline-none focus:border-teal-400"
              placeholder="22"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
          </div>
        </div>

        {/* Travel Details Box */}
        <div className="bg-[#0E2A32]/80 p-4 rounded-2xl border border-teal-800/50 space-y-3 shadow-inner">
          <div className="flex items-center gap-2 text-teal-400 font-semibold text-sm">
            <Compass className="w-4 h-4" /> Travel Plans
          </div>

          <div>
            <label className="text-xs text-teal-300/80 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-teal-400" /> Target Destination
            </label>
            <input
              required
              className="w-full bg-[#081E24] border border-teal-800/60 rounded-xl px-3 py-2 text-sm mt-1 text-white placeholder-teal-700 focus:outline-none focus:border-teal-400"
              placeholder="e.g. Goa, Manali, Bali"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs text-teal-300/80 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-cyan-400" /> Travel Dates
            </label>
            <input
              required
              className="w-full bg-[#081E24] border border-teal-800/60 rounded-xl px-3 py-2 text-sm mt-1 text-white placeholder-teal-700 focus:outline-none focus:border-teal-400"
              placeholder="e.g. 15 Oct - 22 Oct"
              value={formData.travel_date}
              onChange={(e) => setFormData({ ...formData, travel_date: e.target.value })}
            />
          </div>

          <div className="flex gap-2 pt-1">
            {["traveler", "local"].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setFormData({ ...formData, travel_role: role })}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg capitalize transition ${
                  formData.travel_role === role
                    ? "bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 font-bold shadow-md shadow-teal-500/20"
                    : "bg-[#081E24] text-teal-300/70 border border-teal-800/50"
                }`}
              >
                I am a {role}
              </button>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="text-xs text-teal-300/80">Bio & What You Want to Do</label>
          <textarea
            rows={3}
            className="w-full bg-[#0E2A32] border border-teal-800/40 rounded-xl px-3 py-2 text-sm text-white placeholder-teal-600 focus:outline-none focus:border-teal-400"
            placeholder="Looking for a partner to explore beaches, sunset spots, and local food..."
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          />
        </div>

        {/* Vibe Tags */}
        <div>
          <label className="text-xs text-teal-300/80 mb-2 block">Travel Style Tags</label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition border ${
                  formData.tags.includes(tag)
                    ? "bg-teal-950/80 border-teal-400 text-teal-300 shadow-sm shadow-teal-500/20"
                    : "bg-[#0E2A32] border-teal-800/40 text-teal-400/70 hover:border-teal-600/60"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 mt-2 bg-gradient-to-r from-teal-400 to-cyan-500 hover:brightness-110 font-bold rounded-xl shadow-lg shadow-teal-500/25 transition transform active:scale-95 text-slate-950"
        >
          Save Profile & Discover Matches ✈️
        </button>
      </form>
    </div>
  );
}