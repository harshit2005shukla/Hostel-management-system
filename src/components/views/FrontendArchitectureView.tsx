import React, { useState } from 'react';
import { 
  Layout, 
  Component, 
  Cpu, 
  Lock, 
  ChevronRight, 
  ChevronDown 
} from 'lucide-react';
import { ComponentNode } from '../../types/architecture';
import { 
  FRONTEND_ROUTES, 
  COMPONENT_HIERARCHY, 
  STATE_MANAGEMENT_STRATEGY 
} from '../../data/architectureData';

export const FrontendArchitectureView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'routes' | 'hierarchy' | 'state'>('routes');

  // Deep recursive component hierarchy rendering
  const renderComponentNode = (node: ComponentNode, depth = 0) => {
    const [isOpen, setIsOpen] = useState(depth < 4);

    const getTypeColor = (type: string) => {
      switch(type) {
        case 'Layout': return 'bg-purple-50 text-purple-700 border-purple-200';
        case 'Page': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
        case 'Context': return 'bg-amber-50 text-amber-700 border-amber-200';
        default: return 'bg-slate-50 text-slate-700 border-slate-200';
      }
    };

    return (
      <div className="space-y-1" style={{ paddingLeft: depth ? `${depth * 16}px` : '0px' }}>
        <div className="flex items-start space-x-2 py-1.5 px-2 rounded hover:bg-slate-50 transition-colors">
          
          {node.children && node.children.length > 0 ? (
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="mt-0.5 text-slate-400 hover:text-slate-600 shrink-0"
            >
              {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            </button>
          ) : (
            <span className="w-3.5 h-3.5 inline-block shrink-0" />
          )}

          <div className="space-y-0.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-xs font-mono text-slate-900">{node.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono border ${getTypeColor(node.type)}`}>
                {node.type}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {node.description}
            </p>
          </div>

        </div>

        {node.children && isOpen && (
          <div className="border-l border-slate-200/80 ml-2 mt-1 space-y-1">
            {node.children.map((child, idx) => (
              <React.Fragment key={idx}>
                {renderComponentNode(child, depth + 1)}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Overview Block */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Frontend SPA Architecture</h2>
          <p className="text-sm text-slate-600 mt-1">
            Production React SPA structured with feature-based routing, atomic visual components, and highly decoupled server cache sync layers.
          </p>
        </div>

        {/* Sub-Tabs */}
        <div className="bg-slate-100 p-1 rounded-lg border border-slate-200 flex items-center space-x-1 shrink-0">
          <button
            onClick={() => setActiveSubTab('routes')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'routes' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layout className="h-3.5 w-3.5" />
            <span>8. Routes & Pages</span>
          </button>

          <button
            onClick={() => setActiveSubTab('hierarchy')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'hierarchy' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Component className="h-3.5 w-3.5" />
            <span>9. Component Hierarchy</span>
          </button>

          <button
            onClick={() => setActiveSubTab('state')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'state' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>10. State Strategy</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab 1: Routes & Pages */}
      {activeSubTab === 'routes' && (
        <div className="space-y-4">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600">
            <strong>Client-Side Routing Design:</strong> React Router configuration enforces strict path encapsulation. The <code>RequireAuth</code> higher-order wrapper intercepts routing changes to guarantee valid JWT expiration claims before loading private layouts.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FRONTEND_ROUTES.map((route, idx) => (
              <div key={idx} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {route.path}
                    </span>

                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                      {route.layout}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">{route.component}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{route.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1 items-center">
                  <Lock className="h-3 w-3 text-slate-400 mr-1" />
                  {route.roles.map((r, ri) => (
                    <span key={ri} className="text-[10px] bg-slate-50 text-slate-700 px-1.5 py-0.2 rounded border border-slate-200">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Component Hierarchy */}
      {activeSubTab === 'hierarchy' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Interactive Component Architecture Tree
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Expands all visual Atoms, Molecules, and Shell Organisms instantiated inside the web application root.
            </p>
          </div>

          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            {renderComponentNode(COMPONENT_HIERARCHY)}
          </div>
        </div>
      )}

      {/* Sub-Tab 3: State Management Strategy */}
      {activeSubTab === 'state' && (
        <div className="space-y-6">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <p className="text-xs text-slate-700 leading-relaxed">
              {STATE_MANAGEMENT_STRATEGY.overview}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {STATE_MANAGEMENT_STRATEGY.pillars.map((pillar, idx) => (
              <div key={idx} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-2.5">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{pillar.title}</h3>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>

          {/* Core Code State Example */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Implementation: Optimistic Cache Mutation Interceptor
            </h4>
            
            <div className="bg-slate-950 p-4 rounded-xl font-mono text-xs text-emerald-300 overflow-x-auto border border-slate-800">
              <pre className="leading-relaxed">
{`// TanStack Query optimistic updates for Room Allocations
const useAllocateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newAllocation) => axios.post('/api/v1/allocations', newAllocation),
    
    onMutate: async (newAllocation) => {
      // Cancel outstanding refetches to prevent race conditions
      await queryClient.cancelQueries({ queryKey: ['rooms'] });

      // Snapshot the previous state for fallback rollback
      const previousRooms = queryClient.getQueryData(['rooms']);

      // Optimistically modify the specific room's occupancy status
      queryClient.setQueryData(['rooms'], (old: any) => {
        return old.map((room: any) => 
          room._id === newAllocation.roomId 
            ? { ...room, currentOccupancy: room.currentOccupancy + 1 }
            : room
        );
      });

      return { previousRooms };
    },
    
    onError: (err, newAllocation, context) => {
      // Complete atomic rollback if database transaction fails
      queryClient.setQueryData(['rooms'], context?.previousRooms);
    },
    
    onSettled: () => {
      // Always sync to real backend truths
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    }
  });
};`}
              </pre>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
