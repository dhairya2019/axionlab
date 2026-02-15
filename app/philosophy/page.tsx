import React from "react";

export default function Philosophy() {
  return (
    <div className="pt-32 md:pt-64 px-6 md:px-12 max-w-7xl mx-auto pb-64">
      <div className="border-t border-white/10 pt-24">
        <h1 className="text-[10px] text-accent font-black uppercase tracking-[0.6em] mb-16">Operational Philosophy</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 md:gap-40 items-start mb-64">
          <h2 className="text-7xl sm:text-8xl lg:text-[10vw] font-black leading-[0.8] tracking-tighter uppercase">Built <br /> From <br /> Within.</h2>
          <div className="space-y-12 text-lg md:text-2xl text-muted leading-tight uppercase font-bold tracking-tight">
            <p>We do not operate as consultants. We embed directly into the technical and cultural layers of an organization to isolate friction points others overlook.</p>
            <p>Methodology is derived from systems engineering, not marketing. We prioritize resilience, absolute scale, and hardened logic over aesthetic trends.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 border-y border-white/10 py-24">
          {[
            { label: "Lab Engineers", value: "14" },
            { label: "Infrastructure Architects", value: "04" },
            { label: "Systems Designers", value: "03" },
            { label: "Protocol Specialists", value: "02" }
          ].map((stat, i) => (
            <div key={i}>
              <span className="text-5xl md:text-8xl font-black block mb-4 tracking-tighter">{stat.value}</span>
              <span className="text-[10px] uppercase font-black tracking-[0.4em] text-accent">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Refined Stealth Protocol Section - oriented for clarity */}
        <div className="mt-48 grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-24 border border-white/10 p-8 md:p-24 bg-surface relative group">
          <div className="lg:col-span-8 flex flex-col justify-center space-y-12">
            <div className="space-y-4">
              <span className="font-mono text-[9px] text-accent uppercase tracking-[0.6em] font-black block">Status: Stealth Protocol</span>
              <p className="text-4xl md:text-7xl font-black leading-[0.85] tracking-tighter uppercase text-white">
                We remain anonymous. <br /> Our work is the interface.
              </p>
            </div>
            <p className="text-muted text-lg md:text-xl uppercase font-bold tracking-tight leading-tight max-w-3xl">
              Infrastructure should be felt, not seen. By maintaining a profile of absolute discretion, we ensure the focus remains entirely on the performance and integrity of the systems we stabilize.
            </p>
          </div>
          
          <div className="lg:col-span-4 flex flex-col justify-between pt-12 lg:pt-0 lg:border-l lg:border-white/10 lg:pl-24 space-y-12">
            <div className="space-y-4">
              <p className="text-[10px] text-muted uppercase tracking-[0.4em] font-black border-b border-white/10 pb-4">Operational Mandate</p>
              <p className="text-sm font-bold text-white uppercase tracking-widest leading-relaxed">
                We speak through the systems we deploy and the infrastructure we stabilize. No personal brands. No visibility tiers.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-[9px] text-muted uppercase tracking-[0.3em] font-black">Visibility</p>
                <p className="text-[11px] font-bold text-white uppercase tracking-widest">Zero</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] text-muted uppercase tracking-[0.3em] font-black">Performance</p>
                <p className="text-[11px] font-bold text-white uppercase tracking-widest">Critical</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}