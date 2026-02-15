
import React from "react";

export default function Insights() {
  return (
    <div className="pt-40 px-6 md:px-12 max-w-7xl mx-auto min-h-screen pb-40">
      <div className="border-t border-white/10 pt-24 max-w-4xl">
        <h1 className="text-[10px] text-accent font-black uppercase tracking-[0.6em] mb-12">Research & Briefings</h1>
        <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-16">System <br /> Maintenance.</h2>
        <div className="space-y-12">
          <p className="text-xl md:text-2xl text-muted uppercase font-bold tracking-tight leading-tight max-w-2xl">
            Our research node is currently undergoing structural maintenance. <br /> Technical briefings and post-deployment breakdowns are being re-indexed.
          </p>
          <div className="flex gap-4 items-center">
            <span className="w-2 h-2 bg-accent animate-pulse" />
            <p className="font-mono text-[9px] text-muted uppercase tracking-[0.4em] font-black">Next Index: Q3_2024</p>
          </div>
        </div>
      </div>
    </div>
  );
}
