import React from "react";
import Link from "next/link";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Capabilities',
  description: 'Commerce systems, platform engineering, AI agent orchestration, and data infrastructure. Full-stack systems architecture.',
  openGraph: {
    title: 'Capabilities | AXIONLAB',
    description: 'Commerce systems, platform engineering, AI agent orchestration, and data infrastructure. Full-stack systems architecture.',
    url: '/capabilities',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Capabilities | AXIONLAB',
    description: 'Commerce systems, platform engineering, AI agent orchestration, and data infrastructure. Full-stack systems architecture.',
  },
  alternates: { canonical: '/capabilities' },
}

export default function Capabilities() {
  const sectors = [
    {
      title: "Commerce Systems",
      details: ["Headless Logic", "Global Inventory Sync", "Logistics API Integration", "Automated Reconciliation"]
    },
    {
      title: "Platform Engineering",
      details: ["Distributed Service Mesh", "Infrastructure Migration", "Gateway Architecture", "Microservices Design"]
    },
    {
      title: "Application Development",
      details: ["Performance-First Protocols", "Native Rendering Engines", "Edge Computation", "Low-Latency Interfaces"]
    },
    {
      title: "Infrastructure & Automation",
      details: ["CI/CD Logic", "Predictive Monitoring", "Hardened Security", "Resource Efficiency"]
    }
  ];

  return (
    <div className="pt-32 md:pt-56 px-6 md:px-12 max-w-7xl mx-auto pb-64">
      <header className="mb-24">
        <h1 className="text-[10px] text-accent font-bold uppercase tracking-[0.5em] mb-6">Service Capabilities</h1>
        <div className="w-16 h-1 bg-accent" />
      </header>
      
      <div className="space-y-32">
        {sectors.map((sector, i) => (
          <div key={i} className="grid lg:grid-cols-12 gap-12 border-b border-white/10 pb-24 group">
            <div className="lg:col-span-6">
              <h2 className="text-5xl md:text-7xl font-black leading-[0.85] tracking-tighter uppercase group-hover:text-accent transition-colors duration-500">
                {sector.title}
              </h2>
            </div>
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12">
              {sector.details.map((detail, j) => (
                <div key={j} className="border-l-2 border-accent/20 pl-6 py-2 hover:border-accent transition-colors">
                  <h4 className="text-[10px] text-muted font-black uppercase tracking-widest mb-2">Protocol 0{j+1}</h4>
                  <span className="text-xl md:text-2xl font-bold text-white uppercase tracking-tighter">
                    {detail}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <section className="mt-40 p-12 md:p-24 border border-white/10 bg-surface">
        <h3 className="text-[10px] text-muted uppercase tracking-[0.5em] font-bold mb-12">Operational Execution Model</h3>
        <p className="text-2xl md:text-5xl font-black leading-[0.9] tracking-tighter uppercase max-w-5xl">
          We architect dynamic environments that evolve alongside traffic, complexity, and operational load. Stasis is failure.
        </p>
      </section>

      <section className="mt-32">
        <h3 className="text-[10px] text-accent font-bold uppercase tracking-[0.5em] mb-12">Technical Briefings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/insights/headless-commerce-architecture" className="border border-white/10 p-8 hover:border-accent transition-colors group">
            <span className="text-[9px] text-muted uppercase tracking-[0.4em] font-bold block mb-4">Commerce Systems</span>
            <span className="text-xl font-black uppercase tracking-tighter group-hover:text-accent transition-colors block">Headless Commerce Architecture</span>
          </Link>
          <Link href="/insights/engineering-high-performance-apis" className="border border-white/10 p-8 hover:border-accent transition-colors group">
            <span className="text-[9px] text-muted uppercase tracking-[0.4em] font-bold block mb-4">Platform Engineering</span>
            <span className="text-xl font-black uppercase tracking-tighter group-hover:text-accent transition-colors block">Engineering High-Performance APIs</span>
          </Link>
          <Link href="/insights/ai-agent-orchestration-production" className="border border-white/10 p-8 hover:border-accent transition-colors group">
            <span className="text-[9px] text-muted uppercase tracking-[0.4em] font-bold block mb-4">AI Agent Systems</span>
            <span className="text-xl font-black uppercase tracking-tighter group-hover:text-accent transition-colors block">AI Agent Orchestration in Production</span>
          </Link>
          <Link href="/insights/nextjs-static-generation-enterprise" className="border border-white/10 p-8 hover:border-accent transition-colors group">
            <span className="text-[9px] text-muted uppercase tracking-[0.4em] font-bold block mb-4">Application Development</span>
            <span className="text-xl font-black uppercase tracking-tighter group-hover:text-accent transition-colors block">Next.js Static Generation for Enterprise</span>
          </Link>
        </div>
      </section>
    </div>
  );
}