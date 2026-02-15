
import React, { useState } from 'react';

export const Contact: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to dispatch transmission.');
      }

      setStatus('success');
      setEmail('');
      setMessage('');
      
      setTimeout(() => {
        setStatus('idle');
      }, 6000);

    } catch (error: any) {
      console.error("Transmission Error:", error);
      setErrorMessage(error.message || 'The secure tunnel is currently unstable. Please try again.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8">
              Let's build <br /><span className="text-gradient-title">something great</span>
            </h2>
            <p className="text-gray-400 text-lg mb-12 font-light max-w-md">
              Our engineering team is ready to scale your vision. Drop a line and receive a technical consultation within 24 hours.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-white group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-all">
                  <span className="material-symbols-outlined text-indigo-500 text-xl">mail</span>
                </div>
                <span className="font-light group-hover:text-indigo-400 transition-colors">support@axionlab.in</span>
              </div>
              <div className="flex items-center gap-4 text-white group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-all">
                  <span className="material-symbols-outlined text-indigo-500 text-xl">call</span>
                </div>
                <span className="font-light group-hover:text-indigo-400 transition-colors">+91 9306364272</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white text-[10px] font-bold mb-2 uppercase tracking-[0.2em] opacity-60">Authentication: Your Email</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all focus:ring-1 focus:ring-indigo-500/50"
                  placeholder="name@company.com"
                />
              </div>
              <div>
                <label className="block text-white text-[10px] font-bold mb-2 uppercase tracking-[0.2em] opacity-60">Inquiry Parameters</label>
                <textarea 
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all focus:ring-1 focus:ring-indigo-500/50 resize-none"
                  placeholder="Project scope or support request..."
                ></textarea>
              </div>
              
              <button 
                type="submit"
                disabled={status === 'sending' || status === 'success'}
                className={`w-full py-5 rounded-2xl font-bold transition-all text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 ${
                  status === 'success' ? 'bg-emerald-500 text-white' : 
                  status === 'error' ? 'bg-red-500 text-white' :
                  'bg-indigo-600 hover:bg-indigo-500 text-white shadow-neon'
                }`}
              >
                {status === 'idle' && <>Initiate Transmission <span className="material-symbols-outlined text-base">rocket_launch</span></>}
                {status === 'sending' && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                {status === 'success' && <>Data Relayed <span className="material-symbols-outlined text-base">check_circle</span></>}
                {status === 'error' && <>Retry Transmission <span className="material-symbols-outlined text-base">sync_problem</span></>}
              </button>
            </form>
            
            {status === 'error' && (
              <p className="mt-4 text-center text-red-400 text-[10px] uppercase tracking-widest font-bold">
                {errorMessage}
              </p>
            )}
            
            {status === 'success' && (
              <div className="absolute inset-0 bg-[#0f0c29]/95 backdrop-blur-xl rounded-3xl flex flex-col items-center justify-center p-8 text-center animate-[fadeIn_0.5s_cubic-bezier(0.16,1,0.3,1)]">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                  <span className="material-symbols-outlined text-4xl text-emerald-400">verified</span>
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-3 tracking-tight">Transmission Complete</h3>
                <p className="text-gray-400 font-light text-sm leading-relaxed max-w-xs">
                  Inquiry logged in Axion Core. A copy has been dispatched to your provided address.
                </p>
                <button 
                  onClick={() => setStatus('idle')} 
                  className="mt-8 text-indigo-400 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.3em] border-b border-indigo-500/20 pb-1"
                >
                  New Inquiry
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
