import React from "react";

export default function Footer() {
  return (
    <footer className="px-6 md:px-12 py-20 border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
        <div className="space-y-4">
          <h2 className="text-2xl font-black tracking-tighter">AXIONLAB</h2>
          <div className="space-y-1">
            <p className="text-[10px] text-muted uppercase tracking-widest">© {new Date().getFullYear()} AXIONLAB Engineering. All rights reserved.</p>
            <p className="text-[9px] text-muted/50 uppercase tracking-[0.2em] font-medium">Backed by Microtech Outsourcing Services LLP</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-8 text-xs uppercase font-bold tracking-widest">
          <a href="#/philosophy" className="hover:text-accent">Philosophy</a>
          <a href="#/capabilities" className="hover:text-accent">Capabilities</a>
          <a href="#/work" className="hover:text-accent">Work</a>
          <a href="#/initiate" className="hover:text-accent">Initiate</a>
          <a href="mailto:support@axionlab.in" className="hover:text-accent">Contact</a>
        </div>
      </div>
    </footer>
  );
}