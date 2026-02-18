import React from "react";
import { Link } from "react-router-dom";

export default function Work() {
  const projects = [
    {
      name: "Dify.ai",
      overview: "LLM application development framework.",
      challenge: "Managing complex agentic workflows with multi-model support and production reliability.",
      architecture: "Next.js / Python / Vector DB / Redis",
      execution: "Implemented high-performance prompt orchestration and recursive memory management layers.",
      outcome: "Standardized production framework for multi-agent autonomous systems."
    },
    {
      name: "LlamaIndex",
      overview: "Data framework for connecting private data to large language models.",
      challenge: "Orchestrating high-fidelity RAG pipelines across disparate enterprise data sources.",
      architecture: "Metadata Filtering / Hybrid Search / Vector Indexing",
      execution: "Developed specialized retrieval nodes and post-processing logic for refined context delivery.",
      outcome: "Established the industry standard for production-grade RAG architecture."
    },
    {
      name: "Langflow",
      overview: "Visual orchestration engine for agentic workflows.",
      challenge: "Execution of complex directed acyclic graphs for AI reasoning at enterprise scale.",
      architecture: "React Flow / Python FastAPI / LangChain",
      execution: "Scaled the execution core to handle real-time agentic interactions with sub-100ms latency.",
      outcome: "Significant reduction in prototyping-to-production lifecycle for AI systems."
    },
    {
      name: "True.th",
      overview: "National-scale digital telecommunications ecosystem (Thailand).",
      challenge: "Unification of mobile, media, and fintech layers into a high-concurrency architecture.",
      architecture: "Service Mesh / Native Protocols / High-Throughput Middleware",
      execution: "Architected the core synchronization engine for millions of concurrent sessions.",
      outcome: "Maintained 99.99% availability for critical national digital infrastructure."
    },
    {
      name: "Almost Gods",
      overview: "Flagship platform for global luxury streetwear label.",
      challenge: "Management of extreme traffic surges during product drops and global inventory parity.",
      architecture: "Headless Engine / Custom React Storefront / Edge Node Distribution",
      execution: "Engineered a low-latency checkout tunnel for sustained high-concurrency load.",
      outcome: "Zero-latency user experience during 100k+ concurrent request surges."
    },
    {
      name: "MetaPOS",
      overview: "Real-time retail intelligence and point-of-sale ecosystem.",
      challenge: "Ingestion and parsing of fragmented legacy ERP data into actionable BI layers.",
      architecture: "Rust Parser / PostgreSQL / Real-time Analytics Dashboard",
      execution: "Implemented sub-50ms ingestion protocol for multi-location data synchronization. Developed in partnership with Microtech LLC.",
      outcome: "Real-time stock forecasting across 40+ physical retail hubs.",
      link: "https://metapos.net"
    }
  ];

  return (
    <div className="pt-32 md:pt-56 px-6 md:px-12 max-w-7xl mx-auto pb-64">
      <header className="mb-32">
        <h1 className="text-[10px] text-accent font-bold uppercase tracking-[0.5em] mb-6">
          Technical Dossiers
        </h1>
        <div className="w-16 h-1 bg-accent" />
      </header>

      <div className="space-y-48 md:space-y-72">
        {projects.map((project, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-16 relative">
            <div className="md:col-span-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <h2 className="text-6xl sm:text-8xl lg:text-[11vw] font-black leading-[0.8] tracking-tighter uppercase">
                {project.name}
              </h2>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-4 text-accent text-[11px] font-black uppercase tracking-[0.4em] mb-4 hover:text-white transition-colors"
                >
                  Visit Node <span className="text-lg">↗</span>
                </a>
              )}
            </div>

            <div className="md:col-span-4 space-y-16">
              <div>
                <h3 className="text-[10px] text-accent font-bold uppercase tracking-widest mb-6">
                  Overview
                </h3>
                <p className="text-xl md:text-2xl leading-[1.1] font-bold uppercase tracking-tighter">
                  {project.overview}
                </p>
              </div>
              <div>
                <h3 className="text-[10px] text-accent font-bold uppercase tracking-widest mb-6">
                  Technical Challenge
                </h3>
                <p className="text-muted leading-tight font-medium uppercase text-sm tracking-tight">
                  {project.challenge}
                </p>
              </div>
            </div>

            <div className="md:col-span-8 space-y-16">
              <div className="bg-surface p-10 border border-white/10">
                <h3 className="text-[10px] text-accent font-bold uppercase tracking-widest mb-10">
                  System Architecture
                </h3>
                <code className="text-lg md:text-2xl font-mono text-white leading-tight block tracking-tighter">
                  {project.architecture}
                </code>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-[10px] text-accent font-bold uppercase tracking-widest mb-6">
                    Execution
                  </h3>
                  <p className="text-muted leading-snug text-sm uppercase font-medium">
                    {project.execution}
                    {project.name === "MetaPOS" && (
                      <span className="block mt-4 text-white/50">
                        *Backed by{" "}
                        <a href="https://metapos.net" className="underline hover:text-accent">
                          Microtech LLC
                        </a>
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="text-[10px] text-accent font-bold uppercase tracking-widest mb-6">
                    Outcome
                  </h3>
                  <p className="text-muted leading-snug text-sm uppercase font-medium">
                    {project.outcome}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
