
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

        <div className="mt-48 bg-surface p-12 md:p-32 border border-white/10">
          <p className="text-2xl md:text-6xl font-black leading-[0.9] tracking-tighter uppercase max-w-5xl">
            We remain anonymous. Our work is the interface. We speak through the systems we deploy and the infrastructure we stabilize.
          </p>
        </div>
      </div>
    </div>
  );
}
