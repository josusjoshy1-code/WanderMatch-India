"use client";

import dynamic from "next/dynamic";
import React from "react";

// Dynamically import your main app component with SSR completely disabled
const WanderMatchApp = dynamic(() => import("@/components/WanderMatchContent"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#EDEAE2] flex items-center justify-center text-xs font-bold text-slate-600">
      Loading WanderMatch India...
    </div>
  ),
});

export default function Page() {
  return <WanderMatchApp />;
}