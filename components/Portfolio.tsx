
import React, { useState } from 'react';

interface Project {
  id: number;
  title: string;
  tag: string;
  desc: string;
  longDesc: string;
  color: string;
  image: string;
  tech: string[];
}

const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Aether Nexus',
    tag: 'Enterprise AI',
    desc: 'Real-time neural data visualization for biotech leaders.',
    longDesc: 'Aether Nexus provides a cutting-edge interface for visualizing complex neural patterns in real-time. Built with React and high-performance WebGL components, it enables biotech researchers to identify trends in milliseconds that previously took hours.',
    color: 'bg-indigo-600/80',
    image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1200&auto=format&fit=crop',
    tech: ['React', 'Three.js', 'Python', 'WebSockets']
  },
  {
    id: 2,
    title: 'Lumina Pay',
    tag: 'FinTech Ecosystem',
    desc: 'The next generation of cross-border frictionless payments.',
    longDesc: 'Lumina Pay reimagines the digital banking experience for a global workforce. We engineered a robust, secure infrastructure that handles cross-border transactions with sub-second finality using advanced ledger technology and biometric security.',
    color: 'bg-purple-600/80',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop',
    tech: ['Flutter', 'Rust', 'PostgreSQL', 'Biometric Auth']
  },
  {
    id: 3,
    title: 'Titan Infrastructure',
    tag: 'Cloud & DevOps',
    desc: 'Auto-scaling global mesh for high-traffic streaming.',
    longDesc: 'Titan is a cloud-native monitoring and deployment engine. It utilizes predictive machine learning to anticipate traffic spikes and scale infrastructure horizontally before user experience is impacted. Zero-downtime is not a goal; it is our standard.',
    color: 'bg-emerald-600/80',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=1200&auto=format&fit=crop',
    tech: ['Kubernetes', 'Terraform', 'Go', 'Prometheus']
  },
  {
    id: 4,
    title: 'CyberSentry 2.0',
    tag: 'Cybersecurity',
    desc: 'AI-driven threat detection for distributed networks.',
    longDesc: 'CyberSentry 2.0 is an advanced security platform that uses deep learning to identify anomalies in network traffic. It automatically quarantines potential threats and provides security teams with detailed forensic analysis within seconds of an incident.',
    color: 'bg-blue-600/80',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop',
    tech: ['TensorFlow', 'C++', 'AWS', 'Security Hub']
  },
  {
    id: 5,
    title: 'Flux Design System',
    tag: 'UI/UX Design',
    desc: 'Standardizing visual excellence for Fortune 500s.',
    longDesc: 'Flux is a comprehensive design system engineered for scalability and consistency. It bridges the gap between design and development with automated token syncing and a modular React component library used by over 500 developers.',
    color: 'bg-pink-600/80',
    image: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=1200&auto=format&fit=crop',
    tech: ['Figma API', 'Storybook', 'TypeScript', 'Tailwind']
  },
  {
    id: 6,
    title: 'Helix Health',
    tag: 'HealthTech',
    desc: 'Decentralized patient data management with E2E encryption.',
    longDesc: 'Helix Health empowers patients to own their medical data. We built a privacy-first platform that allows seamless sharing of records between authorized providers while maintaining strict compliance with global health data regulations.',
    color: 'bg-cyan-600/80',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200&auto=format&fit=crop',
    tech: ['Next.js', 'Solidity', 'IPFS', 'GraphQL']
  }
];

export const Portfolio: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="portfolio" className="py-24 relative bg-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-indigo-400 font-bold tracking-wider text-sm uppercase mb-2 block">Selected Works</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white">Innovation Portfolio</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROJECTS.map((project) => (
            <div 
              key={project.id} 
              onClick={() => setSelectedProject(project)}
              className="group relative rounded-2xl overflow-hidden cursor-pointer h-96 shadow-xl border border-white/5 active:scale-[0.98] transition-transform"
            >
              <img
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-50 group-hover:brightness-90"
                src={project.image}
              />
              <div className="absolute inset-0 portfolio-overlay opacity-90 group-hover:opacity-70 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <div className={`inline-block px-3 py-1 ${project.color} backdrop-blur-md text-white text-[10px] font-bold rounded-full mb-3 uppercase tracking-wider`}>
                  {project.tag}
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-2">{project.title}</h3>
                <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75 transform translate-y-2 group-hover:translate-y-0">
                  {project.desc}
                </p>
                <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="text-xs text-white/50 underline">View Case Study</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
              onClick={() => setSelectedProject(null)}
            ></div>
            <div className="relative glass-panel w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 md:p-10 shadow-2xl animate-[fadeIn_0.3s_ease-out]">
              <button 
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors focus:outline-none z-20"
                onClick={() => setSelectedProject(null)}
              >
                <span className="material-symbols-outlined text-3xl">close</span>
              </button>
              
              <div className="grid md:grid-cols-2 gap-10">
                <div className="rounded-2xl overflow-hidden shadow-2xl h-full min-h-[300px]">
                  <img src={selectedProject.image} className="w-full h-full object-cover" alt={selectedProject.title} />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-indigo-400 font-bold text-xs uppercase tracking-widest mb-2">{selectedProject.tag}</span>
                  <h3 className="text-4xl font-display font-bold text-white mb-6">{selectedProject.title}</h3>
                  <p className="text-gray-300 leading-relaxed font-light mb-8 text-lg">
                    {selectedProject.longDesc}
                  </p>
                  
                  <div className="mb-8">
                    <h4 className="text-white font-bold text-sm uppercase mb-4 tracking-wider">Engineering Details</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tech.map(t => (
                        <span key={t} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-indigo-200">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button className="bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-full font-bold transition-all w-full md:w-auto px-8 active:scale-95 shadow-neon">
                    Explore Technical Architecture
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-16 text-center">
          <button className="inline-flex items-center gap-3 text-white border border-white/10 px-8 py-3 rounded-full hover:bg-white/5 hover:border-indigo-500/50 transition-all focus:outline-none">
            Download Experience Ledger <span className="material-symbols-outlined text-sm">download</span>
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  );
};
