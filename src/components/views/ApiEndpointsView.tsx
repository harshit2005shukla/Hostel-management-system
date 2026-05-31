import React, { useState, useMemo } from 'react';
import { 
  Terminal, 
  Send, 
  Lock, 
  CheckCircle2 
} from 'lucide-react';
import { Role } from '../../types/architecture';
import { API_ENDPOINTS } from '../../data/architectureData';

interface ApiEndpointsProps {
  activeRole: Role;
  searchTerm: string;
}

export const ApiEndpointsView: React.FC<ApiEndpointsProps> = ({ activeRole, searchTerm }) => {
  const [selectedModule, setSelectedModule] = useState<string>('All');
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>(API_ENDPOINTS[0].id);

  const modules = ['All', 'Auth', 'Students', 'Rooms', 'Allocations', 'Complaints', 'Visitors', 'Fees', 'Analytics'];

  // Filter endpoints
  const filteredEndpoints = useMemo(() => {
    return API_ENDPOINTS.filter(ep => {
      // Role match
      const roleMatch = activeRole === 'All' || ep.roles.includes('All') || ep.roles.includes(activeRole);
      
      // Module match
      const moduleMatch = selectedModule === 'All' || ep.module === selectedModule;

      // Search match
      const searchMatch = !searchTerm || 
        ep.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ep.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ep.module.toLowerCase().includes(searchTerm.toLowerCase());

      return roleMatch && moduleMatch && searchMatch;
    });
  }, [activeRole, selectedModule, searchTerm]);

  // Sync current selection
  const currentEndpoint = filteredEndpoints.find(ep => ep.id === selectedEndpointId) || filteredEndpoints[0] || API_ENDPOINTS[0];

  // Helper colors for HTTP methods
  const getMethodBadge = (method: string) => {
    switch(method) {
      case 'GET': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'POST': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PUT':
      case 'PATCH': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'DELETE': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Overview Block */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">API Endpoint Planning & Sandbox</h2>
          <p className="text-sm text-slate-600 mt-1">
            Complete production backend routes list. Protected securely via role-based claims verification layers.
          </p>
        </div>

        {/* RBAC State Reminder */}
        <div className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 text-xs flex items-center space-x-2 shrink-0">
          <Lock className="h-3.5 w-3.5 text-indigo-500" />
          <span>Active Role Filter: <strong>{activeRole}</strong></span>
        </div>
      </div>

      {/* Module Filter Tabs */}
      <div className="flex flex-wrap gap-1.5">
        {modules.map((mod) => {
          const isActive = selectedModule === mod;
          return (
            <button
              key={mod}
              onClick={() => setSelectedModule(mod)}
              className={`
                px-3 py-1 rounded-lg text-xs font-medium transition-all
                ${isActive 
                  ? 'bg-slate-900 text-white font-bold shadow-sm' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }
              `}
            >
              {mod}
            </button>
          );
        })}
      </div>

      {/* Layout Grid: List vs Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Endpoints Selection List */}
        <div className="lg:col-span-5 space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Available API Routes ({filteredEndpoints.length})
          </div>

          <div className="space-y-1.5 max-h-[560px] overflow-y-auto pr-1">
            {filteredEndpoints.map((ep) => {
              const isSelected = currentEndpoint.id === ep.id;
              
              return (
                <button
                  key={ep.id}
                  onClick={() => setSelectedEndpointId(ep.id)}
                  className={`
                    w-full p-3 rounded-xl border text-left transition-all flex flex-col space-y-2
                    ${isSelected 
                      ? 'bg-white border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm' 
                      : 'bg-white/60 border-slate-200/80 hover:bg-white hover:border-slate-300'
                    }
                  `}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border ${getMethodBadge(ep.method)}`}>
                      {ep.method}
                    </span>

                    <span className="text-[10px] text-slate-400 font-mono">
                      {ep.module}
                    </span>
                  </div>

                  <div className="font-mono text-xs font-bold text-slate-800 break-all">
                    {ep.path}
                  </div>

                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {ep.roles.map((r, ri) => (
                      <span key={ri} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-sans">
                        🔒 {r}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}

            {filteredEndpoints.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
                No endpoints match active Module or Role parameters.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Interactive Sandbox Details */}
        <div className="lg:col-span-7">
          {currentEndpoint ? (
            <div className="bg-slate-900 text-white rounded-xl border border-slate-800 shadow-md overflow-hidden h-full flex flex-col justify-between">
              
              {/* Header Info */}
              <div>
                <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Terminal className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs font-mono text-slate-400">Endpoint Sandbox</span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-slate-400 font-mono">Simulated Response Live</span>
                  </div>
                </div>

                {/* Path & Request specs */}
                <div className="p-4 space-y-4">
                  
                  <div className="space-y-1">
                    <div className="text-[10px] text-slate-400 font-mono uppercase">HTTP Method & Path</div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded font-mono text-xs font-bold border ${getMethodBadge(currentEndpoint.method)}`}>
                        {currentEndpoint.method}
                      </span>
                      <span className="text-sm font-mono font-bold text-indigo-300 break-all">
                        {currentEndpoint.path}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] text-slate-400 font-mono uppercase">Route Responsibility</div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {currentEndpoint.description}
                    </p>
                  </div>

                  {/* Query Parameters */}
                  {currentEndpoint.queryParams && (
                    <div className="space-y-1">
                      <div className="text-[10px] text-slate-400 font-mono uppercase">Allowed Query Parameters</div>
                      <div className="bg-slate-800/80 p-2 rounded border border-slate-700/80 font-mono text-xs text-amber-300">
                        {currentEndpoint.queryParams}
                      </div>
                    </div>
                  )}

                  {/* Request Body Payload */}
                  {currentEndpoint.requestBody && (
                    <div className="space-y-1">
                      <div className="text-[10px] text-slate-400 font-mono uppercase">Inbound Request Body (JSON)</div>
                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto">
                        <pre>{currentEndpoint.requestBody}</pre>
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* Simulated Response Output */}
              <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] text-emerald-400 font-mono uppercase flex items-center space-x-1">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>200 OK — Expected Response Shape</span>
                  </div>

                  <button 
                    onClick={() => alert("Simulated request success! Response payload loaded correctly.")}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1 rounded text-[11px] font-medium flex items-center space-x-1 transition-all"
                  >
                    <Send className="h-2.5 w-2.5" />
                    <span>Send Mock Request</span>
                  </button>
                </div>

                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto max-h-48">
                  <pre>{currentEndpoint.responseShape}</pre>
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs">
              Select an endpoint to inspect specs.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
