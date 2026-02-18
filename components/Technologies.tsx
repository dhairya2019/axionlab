
import React from 'react';

const TECH_STACK = [
  { name: 'React', icon: 'data_object', color: 'text-cyan-400' },
  { name: 'Node.js', icon: 'terminal', color: 'text-green-500' },
  { name: 'Python', icon: 'psychology', color: 'text-blue-500' },
  { name: 'AWS', icon: 'cloud', color: 'text-orange-500' },
  { name: 'Docker', icon: 'container', color: 'text-blue-400' },
  { name: 'PostgreSQL', icon: 'database', color: 'text-indigo-400' },
  { name: 'Flutter', icon: 'phone_iphone', color: 'text-blue-300' },
  { name: 'TensorFlow', icon: 'memory', color: 'text-orange-600' }
];

export const Technologies: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-display font-bold text-white mb-4">Our Technology Stack</h2>
          <p className="text-gray-400 font-light max-w-2xl mx-auto">
            We utilize the most advanced tools and frameworks to build high-performance digital systems.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {TECH_STACK.map((tech, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center group hover:border-indigo-500/50 transition-all duration-300">
              <span className={`material-symbols-outlined text-4xl mb-3 ${tech.color} group-hover:scale-110 transition-transform`}>
                {tech.icon}
              </span>
              <span className="text-white font-medium tracking-wide">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
