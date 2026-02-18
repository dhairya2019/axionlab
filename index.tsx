import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet, ScrollRestoration } from 'react-router-dom';

// ✅ CSS import — this is what makes Vite compile Tailwind + globals into the bundle.
// Without this, the build has NO styles (app/globals.css was only imported in the
// dead Next.js app/layout.tsx file, never in the actual Vite entry point).
import './app/globals.css';

import Home         from './app/page';
import Philosophy   from './app/philosophy/page';
import Capabilities from './app/capabilities/page';
import Work         from './app/work/page';
import Insights     from './app/insights/page';
import Careers      from './app/careers/page';
import Initiate     from './app/initiate/page';
import Nav          from './components/Nav';
import Footer       from './components/Footer';
import { Chatbot }  from './components/Chatbot';

function RootLayout() {
  return (
    <div className="bg-background text-white min-h-screen selection:bg-accent flex flex-col relative">
      {/* ScrollRestoration replaces the manual window.scrollTo(0,0) calls
          that were scattered across the old hash router logic */}
      <ScrollRestoration />
      <Nav />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Chatbot />
      <Footer />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true,          element: <Home /> },
      { path: 'philosophy',   element: <Philosophy /> },
      { path: 'capabilities', element: <Capabilities /> },
      { path: 'work',         element: <Work /> },
      { path: 'insights',     element: <Insights /> },
      { path: 'careers',      element: <Careers /> },
      { path: 'initiate',     element: <Initiate /> },
      // Unknown paths fall back to home (no jarring 404)
      { path: '*',            element: <Home /> },
    ],
  },
]);

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(<RouterProvider router={router} />);
}
