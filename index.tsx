
import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import Home from './app/page';
import Philosophy from './app/philosophy/page';
import Capabilities from './app/capabilities/page';
import Work from './app/work/page';
import Insights from './app/insights/page';
import Careers from './app/careers/page';
import Initiate from './app/initiate/page';
import Nav from './components/Nav';
import Footer from './components/Footer';
import { Chatbot } from './components/Chatbot';

function App() {
  const [currentPath, setCurrentPath] = useState(() => {
    const hash = window.location.hash.replace(/^#/, '');
    // If it's a routing hash (starts with /), return it. Otherwise default to /
    return hash.startsWith('/') ? hash : '/';
  });

  const navigate = useCallback((path: string) => {
    // Standardize path - ensure it starts with /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    
    setCurrentPath(normalizedPath);
    
    // Update hash defensively
    const targetHash = `#${normalizedPath}`;
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    }
    
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash.startsWith('/')) {
        if (hash !== currentPath) {
          setCurrentPath(hash);
        }
      }
    };

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (!anchor) return;
      
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      // 1. Handle standard routing hashes like "#/work" or root "/"
      if (href.startsWith('#/') || href === '/') {
        e.preventDefault();
        e.stopPropagation();
        const path = href.startsWith('#') ? href.substring(1) : href;
        navigate(path);
      } 
      // 2. Handle in-page anchors like "#systems"
      else if (href.startsWith('#') && !href.startsWith('#/')) {
        e.preventDefault();
        e.stopPropagation();
        const id = href.substring(1);
        if (id) {
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
      // 3. Handle external links or mailto
      else if (href.startsWith('http') || href.startsWith('mailto:')) {
        if (!anchor.getAttribute('target')) {
          e.preventDefault();
          window.open(href, '_blank', 'noopener,noreferrer');
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    document.addEventListener('click', handleGlobalClick, true);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      document.removeEventListener('click', handleGlobalClick, true);
    };
  }, [currentPath, navigate]);

  const renderPage = () => {
    switch (currentPath) {
      case '/': return <Home />;
      case '/philosophy': return <Philosophy />;
      case '/capabilities': return <Capabilities />;
      case '/work': return <Work />;
      case '/insights': return <Insights />;
      case '/careers': return <Careers />;
      case '/initiate': return <Initiate />;
      default: return <Home />;
    }
  };

  return (
    <div className="bg-background text-white min-h-screen selection:bg-accent flex flex-col relative">
      <Nav key={currentPath} />
      <div className="flex-grow">
        {renderPage()}
      </div>
      <Chatbot />
      <Footer />
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
