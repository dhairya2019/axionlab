
import React from "react";

export default function Careers() {
  return (
    <div className="pt-40 px-6 md:px-12 max-w-7xl mx-auto min-h-screen pb-40">
      <div className="border-t border-white/10 pt-24 max-w-5xl">
        <h1 className="text-[10px] text-accent font-black uppercase tracking-[0.6em] mb-12">Personnel Acquisition</h1>
        <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-16">Engineering <br /> Pure.</h2>
        <div className="space-y-16">
          <p className="text-2xl md:text-4xl font-black leading-tight uppercase tracking-tighter max-w-3xl">
            We do not hire generalists. We do not hire managers. We hire engineers obsessed with the internal logic of complex systems.
          </p>
          <div className="space-y-8">
            <p className="text-muted text-sm uppercase font-bold tracking-[0.2em]">Required Competencies:</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white text-lg font-black uppercase tracking-tighter">
              <li className="border-l border-white/20 pl-6 hover:border-accent transition-colors">Distributed Systems Architecture</li>
              <li className="border-l border-white/20 pl-6 hover:border-accent transition-colors">Headless Logic Orchestration</li>
              <li className="border-l border-white/20 pl-6 hover:border-accent transition-colors">Native Protocol Engineering</li>
              <li className="border-l border-white/20 pl-6 hover:border-accent transition-colors">Security Surface Hardening</li>
            </ul>
          </div>
          <div className="pt-12">
            <a 
              href="mailto:careers@axionlab.in" 
              className="bg-white text-black px-12 py-8 text-xs font-black uppercase tracking-[0.4em] hover:bg-accent hover:text-white transition-all inline-block"
            >
              Dispatch Dossier
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
