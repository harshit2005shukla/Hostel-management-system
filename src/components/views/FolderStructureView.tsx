import React, { useState } from 'react';
import { 
  Folder, 
  FolderOpen, 
  FileCode, 
  Info, 
  Layers, 
  Server, 
  Layout 
} from 'lucide-react';
import { FolderNode } from '../../types/architecture';
import { FOLDER_STRUCTURE } from '../../data/architectureData';

export const FolderStructureView: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<FolderNode | null>(
    FOLDER_STRUCTURE[0]?.children?.[0] || null
  );

  // Deep recursive node rendering
  const renderTree = (nodes: FolderNode[], depth = 0) => {
    return (
      <div className="space-y-0.5" style={{ paddingLeft: depth ? `${depth * 14}px` : '0px' }}>
        {nodes.map((node, idx) => {
          const isSelected = selectedNode?.name === node.name && selectedNode?.description === node.description;
          const [isOpen, setIsOpen] = useState(depth < 3);

          return (
            <div key={idx} className="space-y-0.5">
              <button
                onClick={() => {
                  setSelectedNode(node);
                  if (node.type === 'folder') {
                    setIsOpen(!isOpen);
                  }
                }}
                className={`
                  w-full flex items-center space-x-2 px-2 py-1 rounded text-xs font-mono transition-colors text-left
                  ${isSelected 
                    ? 'bg-indigo-50 text-indigo-700 font-bold' 
                    : 'hover:bg-slate-50 text-slate-700'
                  }
                `}
              >
                {node.type === 'folder' ? (
                  isOpen ? (
                    <FolderOpen className="h-4 w-4 text-amber-500 shrink-0" />
                  ) : (
                    <Folder className="h-4 w-4 text-amber-500 shrink-0" />
                  )
                ) : (
                  <FileCode className="h-4 w-4 text-slate-400 shrink-0" />
                )}

                <span className="truncate">{node.name}</span>

                {node.type === 'folder' && node.children && (
                  <span className="text-[10px] text-slate-400 font-sans">
                    ({node.children.length})
                  </span>
                )}
              </button>

              {node.type === 'folder' && isOpen && node.children && (
                <div className="border-l border-slate-200/80 ml-2.5 mt-0.5">
                  {renderTree(node.children, depth + 1)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Overview Block */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Production Folder Structure</h2>
        <p className="text-sm text-slate-600 mt-1">
          The Smart Hostel Management System uses an enterprise monorepo layout. It explicitly enforces layer segregation between transport controllers, raw business logic services, and pure persistence schemas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Tree Browser */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-4 shadow-sm h-[580px] overflow-y-auto">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Repository Directory Explorer</span>
            <span className="text-[10px] font-normal bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              Expand / Inspect Nodes
            </span>
          </div>
          
          {renderTree(FOLDER_STRUCTURE)}
        </div>

        {/* Right Responsibility Inspector */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-md h-full flex flex-col justify-between space-y-4">
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-indigo-400 text-xs font-mono pb-3 border-b border-slate-800">
                <Info className="h-4 w-4" />
                <span>ARCHITECTURAL LAYER RESPONSIBILITY</span>
              </div>

              {selectedNode ? (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                      {selectedNode.type === 'folder' ? 'Directory Name' : 'File Name'}
                    </div>
                    <div className="text-lg font-bold font-mono text-indigo-300 break-all">
                      {selectedNode.name}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                      Role & Implementation Details
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/60 p-3 rounded-lg border border-slate-800">
                      {selectedNode.description}
                    </p>
                  </div>

                  {/* Contextual Badges */}
                  <div className="pt-2">
                    <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-2">
                      Design Enforcement
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {selectedNode.name.includes('controller') && (
                        <span className="bg-indigo-950 text-indigo-300 text-[11px] px-2.5 py-1 rounded border border-indigo-800 flex items-center space-x-1">
                          <Server className="h-3 w-3 mr-1" />
                          <span>HTTP Interceptor & DTO Adapter</span>
                        </span>
                      )}

                      {selectedNode.name.includes('service') && (
                        <span className="bg-emerald-950 text-emerald-300 text-[11px] px-2.5 py-1 rounded border border-emerald-800 flex items-center space-x-1">
                          <Layers className="h-3 w-3 mr-1" />
                          <span>Pure Transport-Agnostic Logic</span>
                        </span>
                      )}

                      {selectedNode.name.includes('model') && (
                        <span className="bg-amber-950 text-amber-300 text-[11px] px-2.5 py-1 rounded border border-amber-800 flex items-center space-x-1">
                          <FileCode className="h-3 w-3 mr-1" />
                          <span>Mongoose Schema + Constraints</span>
                        </span>
                      )}

                      {selectedNode.name.includes('components') && (
                        <span className="bg-purple-950 text-purple-300 text-[11px] px-2.5 py-1 rounded border border-purple-800 flex items-center space-x-1">
                          <Layout className="h-3 w-3 mr-1" />
                          <span>Reusable UI Atomic Design</span>
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
                  <Folder className="h-8 w-8 text-slate-600 stroke-1" />
                  <p className="text-xs">Select any file or folder from the repository directory explorer to read its design responsibility.</p>
                </div>
              )}

            </div>

            {/* Design Notes */}
            <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <span className="font-bold text-slate-300 block">Monorepo Standard</span>
              <span>Backend and Frontend exist in unified root structure to share common Zod validation DTO definitions via build packages directly.</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
