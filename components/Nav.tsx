import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { name: "Philosophy", href: "#/philosophy" },
  { name: "Capabilities", href: "#/capabilities" },
  { name: "Work", href: "#/work" },
  { name: "Insights", href: "#/insights" },
];

export default function Nav() {
  const [pathname, setPathname] = useState(() => {
    return window.location.hash.replace(/^#/, '') || '/';
  });
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      setPathname(window.location.hash.replace(/^#/, '') || '/');
      setMobileMenuOpen(false);
    };
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full z-50 border-b transition-all duration-300 ${
          scrolled || mobileMenuOpen
            ? "bg-background border-white/10" 
            : "bg-transparent border-transparent"
        } px-6 md:px-12 flex justify-between items-center h-20 md:h-24`}
      >
        <a href="#/" className="group relative z-50">
          <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase">
            AXIONLAB
          </h1>
        </a>
        
        {/* Desktop Links */}
        <div className="hidden lg:flex items-center h-full">
          <div className="flex gap-12 mr-12">
            {LINKS.map((link) => (
              <a 
                key={link.href} 
                href={link.href}
                className={`text-[13px] uppercase font-bold tracking-[0.25em] transition-colors hover:text-white ${
                  pathname === link.href.replace(/^#/, '') ? "text-white" : "text-muted"
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>
          <a 
            href="#/initiate" 
            className="px-10 h-14 bg-accent text-white flex items-center justify-center text-[12px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-colors"
          >
            Initiate
          </a>
        </div>
        
        {/* Mobile Toggle */}
        <button 
          className="lg:hidden z-50 text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-background transition-all duration-300 lg:hidden overflow-y-auto scrollbar-hide ${
          mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <div className="flex flex-col min-h-full">
          {/* Header in Menu (Matches Reference) */}
          <div className="flex justify-between items-center px-6 h-20 border-b border-white/10">
            <h1 className="text-xl font-black tracking-tighter uppercase">AXIONLAB</h1>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="text-white p-2"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-col pt-12 px-6 space-y-6">
            {LINKS.map((link) => (
              <a 
                key={link.href} 
                href={link.href}
                className={`text-3xl sm:text-4xl font-black uppercase tracking-tighter transition-colors leading-[0.9] ${
                  pathname === link.href.replace(/^#/, '') ? "text-accent" : "text-white"
                }`}
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4">
              <a 
                href="#/initiate" 
                className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-accent leading-[0.9] block"
              >
                Initiate <br /> System
              </a>
            </div>
          </div>
          
          <div className="mt-auto px-6 pb-12 pt-12 border-t border-white/5">
            <p className="text-[10px] text-muted uppercase tracking-[0.5em] mb-4 font-bold">Terminal Connection</p>
            <a href="mailto:support@axionlab.in" className="text-xl font-bold hover:text-accent transition-colors block uppercase tracking-tighter">support@axionlab.in</a>
            <p className="text-[8px] text-muted/20 uppercase tracking-[0.3em] mt-2">Node v4.0.2 / Secure Production</p>
          </div>
        </div>
      </div>
    </>
  );
}
