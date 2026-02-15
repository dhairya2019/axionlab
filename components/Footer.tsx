import React from "react";

export default function Footer() {
  return (
    <footer className="px-6 md:px-12 py-24 border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16 md:gap-12">
        <div className="space-y-8">
          <div className="flex items-center group cursor-default">
            <h2 className="text-2xl font-black tracking-tighter uppercase">AXIONLAB</h2>
          </div>
          <div className="space-y-4">
            <p className="text-[10px] text-muted uppercase tracking-widest font-bold">© {new Date().getFullYear()} AXIONLAB Engineering. All rights reserved.</p>
            <p className="text-[9px] text-muted uppercase tracking-[0.2em] font-black max-w-xs leading-relaxed">
              Backed by <a href="https://metapos.net" className="text-white hover:text-accent transition-colors underline underline-offset-4 decoration-white/20">Microtech LLC</a>
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:flex flex-wrap gap-x-12 gap-y-6 text-[10px] uppercase font-black tracking-[0.3em]">
          <div className="flex flex-col gap-4">
             <p className="text-accent mb-2">Navigation</p>
             <a href="#/philosophy" className="hover:text-white text-muted transition-colors">Philosophy</a>
             <a href="#/capabilities" className="hover:text-white text-muted transition-colors">Capabilities</a>
          </div>
          <div className="flex flex-col gap-4">
             <p className="text-accent mb-2">Systems</p>
             <a href="#/work" className="hover:text-white text-muted transition-colors">Work Dossier</a>
             <a href="#/insights" className="hover:text-white text-muted transition-colors">Insights</a>
          </div>
          <div className="flex flex-col gap-4">
             <p className="text-accent mb-2">Contact</p>
             <a href="#/initiate" className="hover:text-white text-muted transition-colors">Initiate</a>
             <a href="mailto:support@axionlab.in" className="hover:text-white text-muted transition-colors">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}