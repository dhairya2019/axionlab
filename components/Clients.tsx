
import React from 'react';

const CLIENTS = [
  "SpaceX", "Tesla", "Google", "DeepMind", "Stripe", "Airbnb", "Nvidia", "Adobe", "Shopify"
];

export const Clients: React.FC = () => {
  return (
    <div className="py-12 bg-black/20 border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <p className="text-center text-xs font-bold tracking-[0.3em] uppercase text-indigo-400 opacity-60">
          Trusted by industry pioneers
        </p>
      </div>
      <div className="flex relative">
        <div className="flex animate-[marquee_30s_linear_infinite] whitespace-nowrap gap-16 items-center">
          {[...CLIENTS, ...CLIENTS].map((client, idx) => (
            <span key={idx} className="text-2xl md:text-4xl font-display font-bold text-gray-600 hover:text-indigo-400 transition-colors cursor-default select-none">
              {client}
            </span>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};
