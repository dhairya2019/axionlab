
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const systems = [
    { 
      id: "SYST-01",
      name: "Dify.ai", 
      classification: "Agent Orchestration",
      deployment: "Global / Cloud",
      architecture: "Recursive Context Layer",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800" 
    },
    { 
      id: "SYST-02",
      name: "LlamaIndex", 
      classification: "Data Framework",
      deployment: "Enterprise / Private",
      architecture: "Vector-Store Agnostic",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800"
    },
    { 
      id: "SYST-03",
      name: "Langflow", 
      classification: "Workflow Engine",
      deployment: "Hybrid / Edge",
      architecture: "Directed Acyclic Graph",
      image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=800"
    },
    { 
      id: "SYST-04",
      name: "True Corp", 
      classification: "Telecomm Mesh",
      deployment: "National (Thailand)",
      architecture: "Microservices Integration",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800"
    },
    { 
      id: "SYST-05",
      name: "Almost Gods", 
      classification: "Commerce Infra",
      deployment: "Global / Retail",
      architecture: "Headless Checkout Tunnel",
      image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800"
    },
    { 
      id: "SYST-06",
      name: "MetaPOS", 
      classification: "Retail Intelligence",
      deployment: "Regional / Physical",
      architecture: "Real-time BI Layer",
      image: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <div className="pt-32 md:pt-64 px-6 md:px-12 overflow-x-hidden">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto mb-48 md:mb-80">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="fluid-heading font-black tracking-tighter mb-16 text-white uppercase leading-[0.82]">
            Engineering <br /> for the <br /> obsessed.
          </h1>
          <p className="max-w-xl text-lg md:text-2xl text-muted font-medium leading-tight mb-20 uppercase tracking-tight">
            We embed. We analyze. We architect. We execute. <br />
            Systems engineered from within the ecosystems they serve.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-0 border border-white/10 w-fit">
            <a 
              href="#/initiate" 
              className="bg-accent text-white px-12 py-8 text-[11px] font-black uppercase tracking-[0.4em] inline-flex items-center justify-center gap-6 hover:bg-white hover:text-black transition-all"
            >
              Initiate System <ArrowRight size={14} />
            </a>
            <a 
              href="#systems" 
              className="bg-transparent border-l border-white/10 text-white px-12 py-8 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-white/5 transition-all text-center"
            >
              View Classifications
            </a>
          </div>
        </motion.div>
      </section>

      {/* Domain Grid */}
      <section className="max-w-7xl mx-auto mb-48 md:mb-80">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-white/10">
          {[
            "AI Agent Orchestration",
            "Commerce Infrastructure",
            "Platform Engineering",
            "Data Mesh Protocols"
          ].map((item, i) => (
            <div key={i} className="p-12 border-r border-white/10 last:border-r-0 hover:bg-white/5 transition-colors">
              <span className="block font-mono text-accent text-[10px] mb-8 tracking-widest">0{i+1}</span>
              <h3 className="text-2xl font-black leading-none uppercase tracking-tighter text-white">{item}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Systems Classification Section */}
      <section id="systems" className="max-w-7xl mx-auto pb-64">
        <h2 className="text-[10px] text-accent font-bold uppercase tracking-[0.6em] mb-20 border-b border-white/10 pb-6">System Classifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
          {systems.map((system, i) => (
            <div 
              key={i} 
              className="relative bg-background group overflow-hidden min-h-[550px] flex flex-col justify-end p-10"
            >
              {/* Image Layer */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={system.image} 
                  alt={system.name} 
                  className="w-full h-full object-cover grayscale opacity-10 group-hover:opacity-30 transition-all duration-1000"
                />
              </div>

              {/* Data Layer */}
              <div className="relative z-10 space-y-10">
                <div className="space-y-2">
                  <span className="font-mono text-[9px] text-accent font-black tracking-[0.4em]">{system.id}</span>
                  <h3 className="text-5xl font-black text-white leading-none uppercase tracking-tighter">
                    {system.name}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-y-6 pt-10 border-t border-white/10">
                  <div>
                    <p className="text-[8px] text-muted uppercase tracking-[0.3em] font-black mb-1">Classification</p>
                    <p className="text-[11px] font-bold uppercase text-white tracking-tighter">{system.classification}</p>
                  </div>
                  <div>
                    <p className="text-[8px] text-muted uppercase tracking-[0.3em] font-black mb-1">Status</p>
                    <p className="text-[11px] font-bold uppercase text-accent tracking-tighter">Deployed</p>
                  </div>
                  <div>
                    <p className="text-[8px] text-muted uppercase tracking-[0.3em] font-black mb-1">Deployment</p>
                    <p className="text-[11px] font-bold uppercase text-white tracking-tighter">{system.deployment}</p>
                  </div>
                  <div>
                    <p className="text-[8px] text-muted uppercase tracking-[0.3em] font-black mb-1">Architecture</p>
                    <p className="text-[11px] font-bold uppercase text-white tracking-tighter whitespace-nowrap overflow-hidden text-ellipsis">{system.architecture}</p>
                  </div>
                </div>

                <a 
                  href="#/work" 
                  className="inline-flex items-center gap-3 text-accent text-[10px] font-black uppercase tracking-[0.4em] hover:text-white transition-colors pt-6"
                >
                  Retrieve Dossier <ArrowRight size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
