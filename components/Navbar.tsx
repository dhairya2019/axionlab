
import React from 'react';

interface NavbarProps {
  scrolled: boolean;
  onStartProject: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ scrolled, onStartProject }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className={`fixed w-full z-50 top-0 transition-all duration-300 ${scrolled ? 'glass-panel h-16' : 'h-24'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          <div 
            className="flex-shrink-0 flex items-center gap-3 cursor-pointer group" 
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          >
            <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-display font-bold text-lg shadow-neon group-hover:scale-110 transition-transform">
              A
            </div>
            <span className="font-display font-semibold text-lg tracking-tight text-white hidden sm:block">
              Axion Lab
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-10">
            {['Services', 'Portfolio', 'Process', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-sm font-medium text-gray-300 hover:text-white transition-all hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] focus:outline-none"
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onStartProject}
              className="hidden sm:block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-6 py-2 rounded-full text-sm font-medium transition-all shadow-neon hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] active:scale-95"
            >
              Start a Project
            </button>
            <button className="md:hidden text-white hover:text-indigo-400">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
