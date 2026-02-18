
"use client";

import React, { useState } from "react";

export default function Initiate() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    companyName: '',
    website: '',
    industry: '',
    budget: '$100k - $250k',
    timeline: '',
    scope: '',
    email: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    const message = `
SYSTEM INITIATION REQUEST
-------------------------
IDENT: ${formData.companyName}
WEB: ${formData.website}
SECTOR: ${formData.industry}
CAPITAL: ${formData.budget}
PHASE: ${formData.timeline}

SCOPE_PARAMETERS:
${formData.scope}

NODE_CONTACT: ${formData.email}
    `.trim();

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, message }),
      });

      if (!response.ok) throw new Error('Transmission failed');
      
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  if (status === 'success') {
    return (
      <div className="pt-40 px-6 md:px-12 max-w-7xl mx-auto pb-40 text-center flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-24 h-24 border-2 border-accent flex items-center justify-center mb-16">
          <div className="w-12 h-12 bg-accent animate-pulse" />
        </div>
        <h1 className="text-6xl md:text-8xl font-black mb-12 uppercase tracking-tighter leading-none">Transmission <br /> Confirmed.</h1>
        <p className="text-xl text-muted max-w-xl mb-16 uppercase tracking-tight font-bold">
          The architecture brief has been logged into AXION_CORE. Next sequence: Finalize synchronization via strategy terminal.
        </p>
        <button 
          onClick={() => window.open("https://calendly.com/axionlab-session", "_blank", "noopener,noreferrer")}
          className="bg-accent text-white px-16 py-8 text-xs font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all"
        >
          Open Sync Terminal
        </button>
        <button 
          onClick={() => setStatus('idle')}
          className="mt-12 text-[10px] text-muted uppercase tracking-[0.4em] font-black hover:text-white"
        >
          Back to Terminal
        </button>
      </div>
    );
  }

  return (
    <div className="pt-32 md:pt-64 px-6 md:px-12 max-w-7xl mx-auto pb-64">
      <div className="grid md:grid-cols-2 gap-32">
        <div className="sticky top-64 self-start">
          <h1 className="text-7xl md:text-9xl font-black leading-[0.85] mb-12 uppercase tracking-tighter">Initiate <br /> System.</h1>
          <p className="text-xl md:text-2xl text-muted leading-tight mb-20 max-w-sm uppercase tracking-tight font-bold">
            We partner selectively. <br /> Define the architecture.
          </p>
          <div className="space-y-6 pt-16 border-t border-white/10 hidden md:block">
            <p className="font-mono text-[9px] uppercase tracking-[0.5em] font-black text-accent">Protocol 01</p>
            <p className="text-muted text-[10px] uppercase font-bold tracking-widest max-w-xs leading-relaxed">
              Absolute confidentiality. All data parameters are encrypted and stored in isolated environments.
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-16 border-t border-white/10 pt-16">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <label className="text-[9px] font-black uppercase tracking-[0.4em] text-muted">Entity Identifier</label>
              <input 
                required 
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                type="text" 
                placeholder="COMPANY_NAME"
                className="w-full bg-surface border-b border-white/10 p-6 text-white text-sm font-bold uppercase tracking-widest focus:border-accent outline-none transition-colors" 
              />
            </div>
            <div className="space-y-4">
              <label className="text-[9px] font-black uppercase tracking-[0.4em] text-muted">Web Node</label>
              <input 
                name="website"
                value={formData.website}
                onChange={handleChange}
                type="url" 
                placeholder="HTTPS://"
                className="w-full bg-surface border-b border-white/10 p-6 text-white text-sm font-bold uppercase tracking-widest focus:border-accent outline-none transition-colors" 
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[9px] font-black uppercase tracking-[0.4em] text-muted">Market Sector</label>
            <input 
              required 
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              type="text" 
              placeholder="INDUSTRY_CLASSIFICATION"
              className="w-full bg-surface border-b border-white/10 p-6 text-white text-sm font-bold uppercase tracking-widest focus:border-accent outline-none transition-colors" 
            />
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <label className="text-[9px] font-black uppercase tracking-[0.4em] text-muted">Capital Range</label>
              <select 
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full bg-surface border-b border-white/10 p-6 text-white text-sm font-bold uppercase tracking-widest focus:border-accent outline-none appearance-none transition-colors cursor-pointer"
              >
                <option>$50k - $100k</option>
                <option>$100k - $250k</option>
                <option>$250k+</option>
              </select>
            </div>
            <div className="space-y-4">
              <label className="text-[9px] font-black uppercase tracking-[0.4em] text-muted">Timeline Phase</label>
              <input 
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                type="text" 
                placeholder="E.G. 180_DAYS" 
                className="w-full bg-surface border-b border-white/10 p-6 text-white text-sm font-bold uppercase tracking-widest focus:border-accent outline-none transition-colors" 
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[9px] font-black uppercase tracking-[0.4em] text-muted">Scope Parameters</label>
            <textarea 
              required 
              name="scope"
              value={formData.scope}
              onChange={handleChange}
              rows={5} 
              placeholder="TECHNICAL_REQUIREMENTS..."
              className="w-full bg-surface border-b border-white/10 p-6 text-white text-sm font-bold uppercase tracking-widest focus:border-accent outline-none resize-none transition-colors" 
            />
          </div>

          <div className="space-y-4 pb-12">
            <label className="text-[9px] font-black uppercase tracking-[0.4em] text-muted">Auth Node Email</label>
            <input 
              required 
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email" 
              placeholder="USER@ENTITY.COM"
              className="w-full bg-surface border-b border-white/10 p-6 text-white text-sm font-bold uppercase tracking-widest focus:border-accent outline-none transition-colors" 
            />
          </div>

          <button 
            type="submit" 
            disabled={status === 'sending'}
            className="w-full bg-accent text-white py-10 text-xs font-black uppercase tracking-[0.5em] hover:bg-white hover:text-black transition-all disabled:opacity-50"
          >
            {status === 'sending' ? 'TRANSMITTING...' : 'INITIALIZE SYNC'}
          </button>
          
          {status === 'error' && (
            <p className="text-center font-mono text-[9px] text-accent uppercase tracking-[0.4em] font-black">Signal Interference. Please retry sequence.</p>
          )}
        </form>
      </div>
    </div>
  );
}
