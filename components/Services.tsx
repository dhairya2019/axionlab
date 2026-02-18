
import React from 'react';

const SERVICE_ITEMS = [
  {
    icon: 'code',
    title: 'Web Development',
    desc: 'Scalable React & Next.js applications built for speed, SEO, and seamless user experiences.',
    color: 'from-indigo-500 to-purple-600',
    iconColor: 'text-indigo-500'
  },
  {
    icon: 'smartphone',
    title: 'App Development',
    desc: 'Native performance for iOS and Android using Flutter and React Native architectures.',
    color: 'from-purple-500 to-pink-600',
    iconColor: 'text-purple-500'
  },
  {
    icon: 'smart_toy',
    title: 'AI Agents',
    desc: 'Intelligent automation and LLM integration to transform business workflows.',
    color: 'from-blue-500 to-cyan-500',
    iconColor: 'text-blue-500'
  }
];

export const Services: React.FC = () => {
  return (
    <section id="services" className="py-32 relative bg-background-dark/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8 border-b border-white/10 pb-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">Core Capabilities</h2>
            <p className="text-gray-400 text-lg font-light">
              Comprehensive technical solutions tailored for elegance, growth, and resilience in the digital age.
            </p>
          </div>
          <button className="text-indigo-400 font-medium hover:text-white transition-colors flex items-center gap-2 group focus:outline-none">
            View all services <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_outward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICE_ITEMS.map((service, idx) => (
            <div key={idx} className="group relative p-8 rounded-2xl glass-panel hover:translate-y-[-8px] transition-all duration-500 overflow-hidden border border-white/10 hover:border-indigo-500/40">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className={`material-symbols-outlined text-9xl ${service.iconColor}`}>{service.icon}</span>
              </div>
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-8 text-white shadow-lg`}>
                <span className="material-symbols-outlined">{service.icon}</span>
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-3">{service.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8 font-light">{service.desc}</p>
              <button className="text-indigo-400 text-sm font-medium flex items-center gap-2 group-hover:gap-3 transition-all group-hover:text-white focus:outline-none">
                Learn more <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>
          ))}

          {/* Wide Architecture Card */}
          <div className="group relative p-8 rounded-2xl glass-panel transition-all duration-500 lg:col-span-2 overflow-hidden bg-gradient-to-r from-white/5 to-transparent border border-white/10">
            <div className="flex flex-col md:flex-row gap-8 items-start h-full relative z-10">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 text-white shadow-lg">
                <span className="material-symbols-outlined">dns</span>
              </div>
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-xl font-display font-bold text-white mb-3">Platforms & Architecture</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-xl font-light">
                    Robust backend architecture and cloud infrastructure design. We architect systems that can handle millions of concurrent requests without breaking a sweat, ensuring 99.9% uptime and security compliance.
                  </p>
                </div>
                <button className="text-indigo-400 text-sm font-medium flex items-center gap-2 group-hover:gap-3 transition-all group-hover:text-white mt-4 focus:outline-none">
                  Learn more <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          <div className="group relative p-8 rounded-2xl glass-panel transition-all duration-500 overflow-hidden border border-white/10">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-9xl text-orange-500">all_inclusive</span>
            </div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mb-8 text-white shadow-lg">
              <span className="material-symbols-outlined">all_inclusive</span>
            </div>
            <h3 className="text-xl font-display font-bold text-white mb-3">DevOps</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 font-light">CI/CD pipelines, container orchestration, and automated infrastructure management.</p>
            <button className="text-indigo-400 text-sm font-medium flex items-center gap-2 group-hover:gap-3 transition-all group-hover:text-white focus:outline-none">
              Learn more <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
