import React, { useState } from 'react';
import { 
  Network, 
  Server, 
  ShieldCheck, 
  Database, 
  ArrowRight, 
  Layers 
} from 'lucide-react';
import { SYSTEM_ARCHITECTURE_TEXT } from '../../data/architectureData';

export const SystemArchitectureView: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<number>(0);

  const layers = [
    {
      title: "1. Edge / Reverse Proxy",
      icon: Network,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      description: "Terminates public SSL/TLS connections, filters known bad actor IPs via Cloudflare/AWS WAF, and distributes clean payloads to healthy Express Node clusters."
    },
    {
      title: "2. Security & Rate Limiting",
      icon: ShieldCheck,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200",
      description: "Express rate limiters backed by Redis track connection counts per minute. Blocks automated token-guessing attacks instantly before processing body payloads."
    },
    {
      title: "3. Auth & RBAC Interceptors",
      icon: Server,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      description: "Verifies cryptographically signed JWT access tokens. Compares decoded identity claims against target endpoint permissions (Admin, Warden, Student)."
    },
    {
      title: "4. Zod Input Sanitization",
      icon: Layers,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      description: "Parses inbound JSON. Strips out malicious NoSQL injection parameters, validates type constraints, and provides precise errors directly back to the requester."
    },
    {
      title: "5. Mongoose Persistence",
      icon: Database,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      description: "Executes pure database updates. Critical multi-document transactions run inside MongoDB client sessions to ensure absolute Rollback on failure."
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Overview Block */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">System Architecture Diagram</h2>
        <p className="text-sm text-slate-600 mt-1">
          The comprehensive multi-tier network and application blueprint. Designed with clean transport separation to ensure maximum throughput and extreme fault tolerance.
        </p>
      </div>

      {/* Interactive Request Trace */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 space-y-4">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Interactive Request Pipeline Trace
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Click on any processing stage to view its architectural purpose and implementation strategy.
          </p>
        </div>

        {/* Visual Pipeline Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 relative">
          {layers.map((layer, idx) => {
            const Icon = layer.icon;
            const isActive = activeLayer === idx;

            return (
              <button
                key={idx}
                onClick={() => setActiveLayer(idx)}
                className={`
                  p-3 rounded-lg border text-left transition-all relative flex flex-col justify-between
                  ${isActive 
                    ? `${layer.bgColor} ${layer.borderColor} ring-2 ring-indigo-500 shadow-sm` 
                    : 'bg-slate-50/50 border-slate-200/80 hover:bg-slate-50'
                  }
                `}
              >
                <div className="flex items-center justify-between w-full">
                  <div className={`w-7 h-7 rounded flex items-center justify-center ${isActive ? 'bg-white shadow-xs' : 'bg-slate-100'} ${layer.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  
                  {idx < layers.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-slate-300 hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 z-10" />
                  )}
                </div>

                <div className="mt-3">
                  <span className="text-[10px] text-slate-400 font-mono block">STAGE {idx + 1}</span>
                  <span className="text-xs font-bold text-slate-800 line-clamp-1">{layer.title}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Layer Detail */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-900">{layers[activeLayer].title}</span>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                Active Tier
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {layers[activeLayer].description}
            </p>
          </div>

          <div className="shrink-0">
            <span className="text-[11px] font-mono bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-md border border-indigo-100 font-semibold">
              SLA: &lt; 15ms overhead
            </span>
          </div>
        </div>

      </div>

      {/* Raw Text Architecture Diagram */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Production Architecture Blueprint (Text Format)
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">Preserved for raw CLI review</span>
        </div>

        <div className="bg-slate-950 text-emerald-400 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner">
          <pre className="leading-relaxed whitespace-pre font-mono">
            {SYSTEM_ARCHITECTURE_TEXT}
          </pre>
        </div>
      </div>

    </div>
  );
};
