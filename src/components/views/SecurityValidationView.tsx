import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle, 
  Lock, 
  Server, 
  FileCode, 
  Globe 
} from 'lucide-react';
import { 
  SECURITY_ARCHITECTURE, 
  VALIDATION_STRATEGY 
} from '../../data/architectureData';

export const SecurityValidationView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'security' | 'validation'>('security');

  const getSecurityIcon = (iconName: string) => {
    switch(iconName) {
      case 'ShieldCheck': return ShieldCheck;
      case 'Lock': return Lock;
      case 'Server': return Server;
      case 'FileCode': return FileCode;
      case 'Globe': return Globe;
      default: return ShieldCheck;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Overview Block */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Security & Validation Strategy</h2>
          <p className="text-sm text-slate-600 mt-1">
            Implements comprehensive zero-trust network boundaries and end-to-end data type checking to guarantee robust enterprise reliability.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="bg-slate-100 p-1 rounded-lg border border-slate-200 flex items-center space-x-1 shrink-0">
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center space-x-1.5 ${
              activeTab === 'security' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>11. Security Architecture</span>
          </button>

          <button
            onClick={() => setActiveTab('validation')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center space-x-1.5 ${
              activeTab === 'validation' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle className="h-3.5 w-3.5" />
            <span>12. Validation Pipeline</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Security Architecture */}
      {activeTab === 'security' && (
        <div className="space-y-4">
          <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 text-xs text-indigo-900">
            <strong>Zero-Trust Design Principles:</strong> The backend completely assumes all public payloads are potentially hostile. Stateless access JWTs are deliberately scoped to short operational life spans to limit blast radiuses, while transport interception completely stops automated brute-force scripts.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SECURITY_ARCHITECTURE.map((sec, idx) => {
              const Icon = getSecurityIcon(sec.icon);
              return (
                <div key={idx} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-indigo-600 font-mono font-bold uppercase bg-indigo-50 px-2 py-0.5 rounded">
                        {sec.category}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                      <Icon className="h-4 w-4 text-slate-700 shrink-0" />
                      <h3 className="font-bold text-slate-900 text-sm">{sec.title}</h3>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{sec.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Implementation Code Reference</span>
                    <code className="text-[11px] bg-slate-900 text-emerald-400 px-2 py-1 rounded block font-mono overflow-x-auto">
                      {sec.implementation}
                    </code>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Validation Strategy */}
      {activeTab === 'validation' && (
        <div className="space-y-6">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600">
            <strong>End-to-End TypeScript Validation:</strong> By using Zod throughout the monorepo, both the frontend form interfaces and backend middleware interceptors share the exact same runtime schema checking code directly.
          </div>

          <div className="space-y-6">
            {VALIDATION_STRATEGY.map((val, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-900 p-3 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-indigo-300">{val.layer}</span>
                  </div>

                  <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                    Tool: {val.tool}
                  </span>
                </div>

                <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-5 space-y-1">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">Validation Execution Purpose</span>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {val.strategy}
                    </p>
                  </div>

                  <div className="md:col-span-7">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block mb-1">Shared Implementation Blueprint</span>
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto">
                      <pre>{val.exampleSnippet}</pre>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
