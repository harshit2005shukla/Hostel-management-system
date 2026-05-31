import React from 'react';
import { 
  FolderTree, 
  Network, 
  Database, 
  FileCode2, 
  GitCommit, 
  Share2, 
  Terminal, 
  Layout, 
  Component, 
  Cpu, 
  ShieldCheck, 
  CheckCircle, 
  Play, 
  Compass
} from 'lucide-react';

export type ActiveTab = 
  | 'overview'
  | 'folder-structure'
  | 'system-architecture'
  | 'mongodb-design'
  | 'mongoose-schemas'
  | 'relationships'
  | 'er-diagram'
  | 'api-endpoints'
  | 'frontend-pages'
  | 'component-hierarchy'
  | 'state-management'
  | 'security'
  | 'validation'
  | 'live-prototypes'
  | 'backend-source'
  | 'live-execution';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  highlight?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen
}) => {
  
  const navGroups: NavGroup[] = [
    {
      title: "Executive Scope",
      items: [
        { id: 'overview', label: 'System Overview & Features', icon: Compass },
        { id: 'folder-structure', label: '1. Complete Folder Structure', icon: FolderTree },
        { id: 'system-architecture', label: '2. System Architecture Diagram', icon: Network }
      ]
    },
    {
      title: "Database & Persistence",
      items: [
        { id: 'mongodb-design', label: '3. MongoDB Database Design', icon: Database },
        { id: 'mongoose-schemas', label: '4. Mongoose Schemas', icon: FileCode2, badge: 'Interactive' },
        { id: 'relationships', label: '5. Collection Relationships', icon: GitCommit },
        { id: 'er-diagram', label: '6. ER Diagram (Text Format)', icon: Share2 }
      ]
    },
    {
      title: "API & Client Core",
      items: [
        { id: 'api-endpoints', label: '7. API Endpoint Planning', icon: Terminal, badge: 'Sandbox' },
        { id: 'frontend-pages', label: '8. Frontend Page Structure', icon: Layout },
        { id: 'component-hierarchy', label: '9. Component Hierarchy', icon: Component },
        { id: 'state-management', label: '10. State Management Strategy', icon: Cpu }
      ]
    },
    {
      title: "Security & Guidelines",
      items: [
        { id: 'security', label: '11. Security Architecture', icon: ShieldCheck },
        { id: 'validation', label: '12. Validation Strategy', icon: CheckCircle }
      ]
    },
    {
      title: "Backend Deliverables",
      items: [
        { id: 'backend-source', label: '📁 Backend Source Code', icon: FileCode2, badge: 'Full Code' },
        { id: 'live-execution', label: '⚡ Live Backend Simulator', icon: Terminal, badge: 'Postman' }
      ]
    },
    {
      title: "Simulated Features",
      items: [
        { id: 'live-prototypes', label: '🔴 Live Feature Prototypes', icon: Play, highlight: true }
      ]
    }
  ];

  return (
    <aside className={`
      w-72 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col shrink-0
      ${isOpen ? 'block' : 'hidden'} md:block
      sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto
    `}>
      <div className="p-4 space-y-6">
        
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 pb-1">
              {group.title}
            </h3>
            
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as ActiveTab)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left
                      ${isActive 
                        ? 'bg-indigo-600/15 text-indigo-400 font-semibold border-l-4 border-indigo-500' 
                        : item.highlight
                          ? 'text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 font-medium'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-2.5 overflow-hidden">
                      <Icon className={`h-4 w-4 shrink-0 ${
                        isActive 
                          ? 'text-indigo-400' 
                          : item.highlight
                            ? 'text-rose-400 animate-pulse'
                            : 'text-slate-500'
                      }`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`
                        text-[10px] px-1.5 py-0.5 rounded font-mono uppercase tracking-tight shrink-0
                        ${isActive 
                          ? 'bg-indigo-500 text-white' 
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }
                      `}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Quick System Summary Footer */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-800 text-xs space-y-1.5">
            <div className="flex justify-between text-slate-400">
              <span>Stack:</span>
              <span className="text-slate-200 font-mono">MERN + TS</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Auth:</span>
              <span className="text-slate-200 font-mono">JWT + Cookies</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>RBAC Roles:</span>
              <span className="text-slate-200 font-mono">3 Defined</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>DB Engines:</span>
              <span className="text-slate-200 font-mono">Mongo + Redis</span>
            </div>
          </div>
        </div>

      </div>
    </aside>
  );
};
