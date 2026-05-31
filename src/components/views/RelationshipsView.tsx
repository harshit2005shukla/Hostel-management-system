import React from 'react';
import { GitCommit, Layers, RefreshCw } from 'lucide-react';
import { COLLECTION_RELATIONSHIPS } from '../../data/architectureData';

export const RelationshipsView: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Overview Block */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Collection Relationships & Join Logic</h2>
        <p className="text-sm text-slate-600 mt-1">
          The Smart Hostel Management System enforces deep data integrity using strict foreign key bindings while utilizing MongoDB aggregation pipelines to achieve multi-collection queries efficiently.
        </p>
      </div>

      {/* Strategies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {COLLECTION_RELATIONSHIPS.strategies.map((strat, idx) => (
          <div key={idx} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center space-x-2 text-indigo-600">
              {idx === 0 ? <RefreshCw className="h-4 w-4" /> : <Layers className="h-4 w-4" />}
              <h3 className="text-sm font-bold text-slate-900">{strat.title}</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {strat.description}
            </p>
          </div>
        ))}
      </div>

      {/* Raw Text View */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <GitCommit className="h-4 w-4 text-indigo-400" />
          <span>Complete Relational Blueprint (Text Format)</span>
        </div>

        <div className="bg-slate-950 text-indigo-300 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner">
          <pre className="leading-relaxed whitespace-pre font-mono">
            {COLLECTION_RELATIONSHIPS.text}
          </pre>
        </div>
      </div>

    </div>
  );
};
