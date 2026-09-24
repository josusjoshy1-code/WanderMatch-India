"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Flame, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    if (isRegistering) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setErrorMsg(error.message);
      else alert("Registration successful! Please check your email to verify your account.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setErrorMsg(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#EDEAE2] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-[400px] bg-[#FBF9F5] rounded-[42px] p-8 shadow-2xl border border-[#E4DFD5]">
        <div className="text-center pt-4 pb-4 space-y-2">
          <div className="inline-flex p-3 rounded-full bg-[#E15A44]/10 text-[#E15A44]">
            <Flame className="w-8 h-8 fill-[#E15A44]" />
          </div>
          <h1 className="text-2xl font-black text-[#1F1C18]">WanderMatch India</h1>
          <p className="text-xs text-slate-500">Create a real account to connect with live travelers.</p>
        </div>

        {errorMsg && <div className="p-2 mb-3 bg-rose-50 text-rose-600 text-xs rounded-xl font-medium">{errorMsg}</div>}

        <form onSubmit={handleAuth} className="space-y-3.5">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#E15A44]"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#E15A44]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#E15A44] text-white text-xs font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2"
          >
            {loading ? "Processing..." : isRegistering ? "Sign Up" : "Sign In"} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-4">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-xs font-semibold text-slate-600 hover:text-[#E15A44] transition"
          >
            {isRegistering ? "Already have an account? Sign In" : "Need an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}