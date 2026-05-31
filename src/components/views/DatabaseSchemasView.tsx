import React, { useState, useMemo } from 'react';
import { 
  Database, 
  Key, 
  ExternalLink 
} from 'lucide-react';
import { MONGOOSE_SCHEMAS, MONGODB_DESIGN_RATIONALE } from '../../data/architectureData';

interface DatabaseSchemasProps {
  searchTerm: string;
}

export const DatabaseSchemasView: React.FC<DatabaseSchemasProps> = ({ searchTerm }) => {
  const [activeSchemaIdx, setActiveSchemaIdx] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'fields' | 'code' | 'indexes'>('fields');

  // Filter schemas if searchTerm is active
  const filteredSchemas = useMemo(() => {
    if (!searchTerm) return MONGOOSE_SCHEMAS;
    const term = searchTerm.toLowerCase();
    
    return MONGOOSE_SCHEMAS.filter(schema => {
      const matchName = schema.modelName.toLowerCase().includes(term) || schema.collectionName.toLowerCase().includes(term);
      const matchDesc = schema.description.toLowerCase().includes(term);
      const matchField = schema.fields.some(f => 
        f.name.toLowerCase().includes(term) || 
        f.type.toLowerCase().includes(term) ||
        f.description.toLowerCase().includes(term)
      );
      return matchName || matchDesc || matchField;
    });
  }, [searchTerm]);

  // Sync active schema if filtered out
  const currentSchema = filteredSchemas[activeSchemaIdx] || filteredSchemas[0] || MONGOOSE_SCHEMAS[0];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Overview Block */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">MongoDB Database Design & Schemas</h2>
        <p className="text-sm text-slate-600 mt-1">
          {MONGODB_DESIGN_RATIONALE.overview}
        </p>
      </div>

      {/* Rationale Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MONGODB_DESIGN_RATIONALE.principles.map((principle, idx) => (
          <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-1.5">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 inline-block mr-1.5" />
              <span>{principle.title}</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {principle.description}
            </p>
          </div>
        ))}
      </div>

      {/* Main Interactive Schema Builder/Inspector */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Collection Selector Header */}
        <div className="bg-slate-900 p-4 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4 text-indigo-400" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Select Schema Collection
              </span>
            </div>
            
            {/* Horizontal Tabs */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {filteredSchemas.map((sch, idx) => {
                const isActive = currentSchema.collectionName === sch.collectionName;
                return (
                  <button
                    key={sch.collectionName}
                    onClick={() => setActiveSchemaIdx(idx)}
                    className={`
                      px-3 py-1.5 rounded-lg text-xs font-mono transition-all
                      ${isActive 
                        ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                      }
                    `}
                  >
                    {sch.modelName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Collection Specs */}
          <div className="bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700/80 text-right shrink-0">
            <span className="text-[10px] text-slate-400 font-mono block uppercase">Collection Binding</span>
            <span className="text-xs font-bold text-indigo-300 font-mono">{currentSchema.collectionName}</span>
          </div>
        </div>

        {/* Collection Description & Inner Tabs */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-slate-600 max-w-2xl">
            <strong className="text-slate-900">{currentSchema.modelName} Schema:</strong> {currentSchema.description}
          </p>

          <div className="flex items-center space-x-1 bg-white p-1 rounded-lg border border-slate-200 text-xs shrink-0">
            <button
              onClick={() => setActiveTab('fields')}
              className={`px-3 py-1 rounded font-medium transition-all ${activeTab === 'fields' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Fields & Metadata
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1 rounded font-medium transition-all ${activeTab === 'code' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Mongoose Code
            </button>
            <button
              onClick={() => setActiveTab('indexes')}
              className={`px-3 py-1 rounded font-medium transition-all ${activeTab === 'indexes' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Indexes ({currentSchema.indexes.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Fields & Metadata */}
        {activeTab === 'fields' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/75 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Field Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Attributes</th>
                  <th className="py-3 px-4">Default</th>
                  <th className="py-3 px-4">Description & Validation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {currentSchema.fields.map((field) => (
                  <tr key={field.name} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      <div className="flex items-center space-x-1.5">
                        {field.name === '_id' && <Key className="h-3 w-3 text-amber-500 shrink-0" />}
                        <span>{field.name}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-indigo-600">
                      {field.type}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {field.required ? (
                          <span className="bg-rose-50 text-rose-700 text-[10px] px-1.5 py-0.5 rounded border border-rose-100 font-semibold">
                            Required
                          </span>
                        ) : (
                          <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded border border-slate-200">
                            Optional
                          </span>
                        )}

                        {field.unique && (
                          <span className="bg-amber-50 text-amber-700 text-[10px] px-1.5 py-0.5 rounded border border-amber-100 font-semibold">
                            Unique
                          </span>
                        )}

                        {field.ref && (
                          <span className="bg-purple-50 text-purple-700 text-[10px] px-1.5 py-0.5 rounded border border-purple-100 font-mono inline-flex items-center space-x-0.5">
                            <span>Ref: {field.ref}</span>
                            <ExternalLink className="h-2.5 w-2.5 ml-0.5" />
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-500">
                      {field.default ? field.default : <span className="text-slate-300">-</span>}
                    </td>

                    <td className="py-3 px-4 space-y-1">
                      <p className="text-slate-700">{field.description}</p>
                      {field.validation && (
                        <p className="text-[11px] text-amber-700 bg-amber-50/50 px-2 py-0.5 rounded font-mono inline-block">
                          {field.validation}
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Code Snippet */}
        {activeTab === 'code' && (
          <div className="p-4 bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto">
            <pre className="leading-relaxed whitespace-pre">
              {currentSchema.codeSnippet}
            </pre>
          </div>
        )}

        {/* Tab 3: Indexes */}
        {activeTab === 'indexes' && (
          <div className="p-6 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Configured Production Database Indexes
            </h4>
            
            <div className="space-y-2">
              {currentSchema.indexes.map((idxStr, i) => (
                <div key={i} className="flex items-center space-x-2 bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-xs">
                  <div className="w-5 h-5 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-[10px]">
                    {i + 1}
                  </div>
                  <span className="text-slate-800 font-bold">{idxStr}</span>
                </div>
              ))}
            </div>

            <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100 text-xs text-indigo-900 mt-4">
              <strong>Query Optimization Rationale:</strong> These explicit index definitions prevent full-collection table scans, preserving sub-10 millisecond lookups when resolving RBAC user states or searching for unassigned rooms.
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
