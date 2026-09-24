"use client";

import React, { useState, useEffect } from "react";
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, Volume2 } from "lucide-react";
import { UserProfile } from "../types/travel";

interface CallingModalProps {
  user: UserProfile;
  callType: "audio" | "video";
  onClose: () => void;
}

export default function CallingModal({ user, callType, onClose }: CallingModalProps) {
  const [callStatus, setCallStatus] = useState<"Ringing..." | "Connected" | "Call Ended">("Ringing...");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(callType === "audio");
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCallStatus("Connected");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callStatus === "Connected") {
      interval = setInterval(() => setDuration((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleEndCall = () => {
    setCallStatus("Call Ended");
    setTimeout(onClose, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-8 text-white">
      {/* Top Details */}
      <div className="text-center pt-8 space-y-2">
        <h3 className="text-2xl font-bold">{user.name}</h3>
        <p className="text-sm text-white/70">
          {callStatus === "Connected" ? formatDuration(duration) : callStatus}
        </p>
      </div>

      {/* Center Display */}
      <div className="relative flex flex-col items-center">
        {callType === "video" && !isVideoOff && callStatus === "Connected" ? (
          <div className="w-64 h-80 rounded-3xl overflow-hidden border-2 border-white/20 bg-slate-900 shadow-2xl relative">
            <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
            <div className="absolute bottom-3 left-3 bg-black/50 px-3 py-1 rounded-full text-xs">
              {user.name.split(" ")[0]}
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-[#E15A44] shadow-2xl animate-pulse">
              <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-2 right-2 bg-emerald-500 w-5 h-5 rounded-full border-2 border-white" />
          </div>
        )}
      </div>

      {/* Call Actions */}
      <div className="flex items-center gap-6 pb-10">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`p-4 rounded-full transition ${isMuted ? "bg-white text-black" : "bg-white/20 hover:bg-white/30"}`}
        >
          {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>

        <button
          onClick={handleEndCall}
          className="p-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-xl transition scale-110 active:scale-95"
        >
          <PhoneOff className="w-7 h-7" />
        </button>

        {callType === "video" && (
          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`p-4 rounded-full transition ${isVideoOff ? "bg-white text-black" : "bg-white/20 hover:bg-white/30"}`}
          >
            {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
          </button>
        )}
      </div>
    </div>
  );
}