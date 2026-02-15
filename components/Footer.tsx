
import React from 'react';

interface FooterProps {
  onStartProject: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onStartProject }) => {
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
    <footer className="bg-black/60 border-t border-white/10 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1">
            <div 
              className="flex items-center gap-3 mb-8 cursor-pointer group" 
              onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
            >
              <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-neon group-hover:scale-110 transition-transform">A</div>
              <span className="font-display font-semibold text-xl text-white tracking-tight">Axion Lab</span>
            </div>
            <p className="text-gray-400 text-sm mb-8 font-light leading-relaxed max-w-xs">
              Architecting the digital future with precision, passion, and high-performance code.
            </p>
            <button 
              onClick={onStartProject}
              className="text-xs font-bold uppercase tracking-widest text-indigo-400 hover:text-white border border-indigo-500/30 hover:border-white px-4 py-2 rounded transition-all mb-8 block active:scale-95"
            >
              Partner with us
            </button>
            <div className="flex gap-6">
              {['public', 'alternate_email', 'rss_feed'].map((icon) => (
                <button key={icon} className="text-gray-500 hover:text-white transition-colors focus:outline-none">
                  <span className="material-symbols-outlined text-xl">{icon}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-[0.2em] mb-8">Company</h4>
            <ul className="space-y-5 text-sm text-gray-400 font-light">
              {['About Us', 'Careers', 'Blog', 'Contact'].map(link => (
                <li key={link}>
                  <button 
                    onClick={() => scrollToSection(link.toLowerCase() === 'contact' ? 'contact' : '')}
                    className="hover:text-white transition-colors focus:outline-none"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-[0.2em] mb-8">Services</h4>
            <ul className="space-y-5 text-sm text-gray-400 font-light">
              {['Web Development', 'Mobile Apps', 'AI Solutions', 'DevOps'].map(link => (
                <li key={link}>
                  <button 
                    onClick={() => scrollToSection('services')}
                    className="hover:text-white transition-colors focus:outline-none text-left"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-[0.2em] mb-8">Locations</h4>
            <div className="space-y-8">
              <div className="flex gap-4 items-start">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
                <div>
                  <p className="text-white text-sm font-medium">India</p>
                  <p className="text-gray-500 text-xs font-light">HQ & Engineering</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0"></div>
                <div>
                  <p className="text-white text-sm font-medium">Global</p>
                  <p className="text-gray-500 text-xs font-light">Remote Operations</p>
                </div>
              </div>
              
              <div className="mt-8 rounded-xl overflow-hidden h-28 w-full relative group cursor-pointer border border-white/5" onClick={() => window.open('https://maps.google.com', '_blank')}>
                <img
                  alt="City Grid"
                  className="w-full h-full object-cover filter grayscale opacity-40 group-hover:opacity-70 transition-all duration-500"
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=400&auto=format&fit=crop"
                />
                <div className="absolute inset-0 bg-indigo-900/10 mix-blend-overlay"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded text-[10px] text-white font-bold border border-white/20">VIEW MAP</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-xs font-light">
            © {new Date().getFullYear()} Axion Lab. All rights reserved.
          </p>
          <div className="flex gap-10 text-xs text-gray-500 font-light">
            <button className="hover:text-white transition-colors focus:outline-none">Privacy Policy</button>
            <button className="hover:text-white transition-colors focus:outline-none">Terms of Service</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
