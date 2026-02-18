
import React from 'react';

export const Hero: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-52 lg:pb-32 min-h-[90vh] flex items-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/30 text-indigo-200 text-xs font-medium mb-8 tracking-wide backdrop-blur-sm shadow-[0_0_15px_rgba(79,70,229,0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            AI-Powered Digital Evolution
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Future-Proof <br />
            <span className="text-gradient-title">Digital Reality</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-xl mb-10 leading-relaxed font-light border-l-2 border-indigo-500 pl-6">
            We architect scalable, high-performance digital ecosystems. Merging artistic vision with deep tech engineering for the next generation of web.
          </p>

          <div className="flex flex-col sm:flex-row gap-6">
            <button
              onClick={() => scrollToSection('portfolio')}
              className="w-full sm:w-auto bg-white text-indigo-900 hover:bg-gray-100 px-8 py-4 rounded-full text-base font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 flex justify-center items-center active:scale-95"
            >
              View Portfolio
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-medium text-white border border-white/20 hover:bg-white/10 transition-all flex items-center justify-center gap-2 group backdrop-blur-sm active:scale-95"
            >
              Our Services
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>
        </div>

        {/* Right Visual Element */}
        <div className="relative h-[400px] md:h-[600px] flex items-center justify-center">
          <div className="relative w-64 h-64 md:w-[450px] md:h-[450px] animate-float">
            <div className="absolute inset-0 rounded-full glass-sphere z-10 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 animate-spin-slow"></div>
              <div className="w-2/3 h-2/3 border border-white/10 rounded-full absolute animate-ping" style={{ animationDuration: '4s' }}></div>
              <div className="w-1/2 h-1/2 border border-indigo-400/30 rounded-full absolute"></div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-indigo-500/20 rounded-full -z-10 rotate-45"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[180%] border border-purple-500/10 rounded-full -z-20 -rotate-12"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-600/30 blur-[100px] -z-30"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
