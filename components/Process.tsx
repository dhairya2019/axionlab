
import React from 'react';

export const Process: React.FC = () => {
  return (
    <section id="process" className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-12 leading-tight">
              Precision Engineering Meets <br />
              <span className="text-indigo-400 italic font-serif">Human Ingenuity</span>
            </h2>

            <div className="space-y-12">
              {[
                {
                  step: 1,
                  title: 'Discovery & Strategy',
                  desc: 'We dive deep into your business logic to architect the perfect technical roadmap, ensuring every line of code serves a purpose.'
                },
                {
                  step: 2,
                  title: 'Agile Development',
                  desc: 'Iterative sprints with constant feedback loops to ensure alignment with vision. We build in the open, with transparency.'
                },
                {
                  step: 3,
                  title: 'Deployment & Scale',
                  desc: 'Zero-downtime deployments and auto-scaling infrastructure setup. We prepare your system for success from day one.'
                }
              ].map((item) => (
                <div key={item.step} className="flex gap-6 group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 font-display font-bold text-lg group-hover:bg-indigo-600 group-hover:text-white group-hover:border-transparent transition-all shadow-lg shadow-indigo-500/10 group-hover:shadow-indigo-500/50">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-xl mb-2">{item.title}</h4>
                    <p className="text-gray-400 text-base font-light leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="relative h-[550px] w-full flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/30 to-purple-600/30 filter blur-3xl transform scale-90 -z-10"></div>
              
              <div className="relative bg-[#0d1117] rounded-xl border border-gray-700/50 shadow-2xl overflow-hidden p-6 font-mono text-xs md:text-sm text-gray-300 opacity-95 w-full transform rotate-1 hover:rotate-0 transition-transform duration-500 z-10">
                <div className="flex gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                </div>
                
                <div className="space-y-1.5 leading-relaxed">
                  <p><span className="text-pink-400">const</span> <span className="text-blue-400">axionEngine</span> = <span className="text-pink-400">new</span> <span className="text-yellow-300">AI_Core</span>({`{`}</p>
                  <p className="pl-4">mode: <span className="text-green-300">'autonomous'</span>,</p>
                  <p className="pl-4">optimization: <span className="text-purple-400">true</span>,</p>
                  <p className="pl-4">neural_network: {`{`}</p>
                  <p className="pl-8">layers: <span className="text-orange-400">1024</span>,</p>
                  <p className="pl-8">activation: <span className="text-green-300">'relu'</span></p>
                  <p className="pl-4">{`}`}</p>
                  <p>{`}`});</p>
                  <p className="mt-4"><span className="text-gray-500">// Initialize system protocol</span></p>
                  <p><span className="text-pink-400">await</span> <span className="text-blue-400">axionEngine</span>.<span className="text-yellow-300">deploy</span>(<span className="text-green-300">'global-scale'</span>);</p>
                </div>

                <div className="mt-12 p-8 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl">
                  <p className="text-white italic text-base md:text-lg font-light leading-relaxed text-center">
                    "Axion transformed our legacy systems into a modern, cloud-native powerhouse."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
