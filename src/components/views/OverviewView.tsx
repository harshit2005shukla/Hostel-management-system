import React from 'react';
import { 
  Layers, 
  CheckCircle2, 
  Users, 
  Bed, 
  Key, 
  MessageSquareWarning, 
  UserPlus, 
  CreditCard, 
  LineChart 
} from 'lucide-react';

export const OverviewView: React.FC = () => {
  const features = [
    {
      title: "1. Student Management",
      icon: Users,
      description: "Centralized digital registry linking universal system logins to academic profiles, guardian details, emergency medical flags, and direct room placement keys."
    },
    {
      title: "2. Room Management",
      icon: Bed,
      description: "Asset control inventory detailing floor maps, block identifiers, bed slots, and active maintenance flags to ensure real-time capacity enforcement."
    },
    {
      title: "3. Room Allocation",
      icon: Key,
      description: "Transactional booking logic preventing race conditions. Handles smart automated bed matching, check-ins, check-outs, and historical occupancy tracking."
    },
    {
      title: "4. Complaint Management",
      icon: MessageSquareWarning,
      description: "Role-based ticketing framework auto-routing facility and discipline defects directly to accountable hostel wardens with explicit resolution SLAs."
    },
    {
      title: "5. Visitor Management",
      icon: UserPlus,
      description: "Security logging engine tracking outside arrivals, ID documentation references, relation proofs, and strict warden authorization sign-offs."
    },
    {
      title: "6. Fee Management",
      icon: CreditCard,
      description: "Financial ledger managing automatic room rents, itemized mess bills, late fines, waivers, and integration parameters for online payments."
    },
    {
      title: "7. Dashboard Analytics",
      icon: LineChart,
      description: "Macro-level command views displaying real-time occupancy rates, outstanding maintenance alerts, visitor concurrency, and financial health metrics."
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-900 rounded-2xl p-8 border border-indigo-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-mono border border-indigo-500/30">
            <Layers className="h-3.5 w-3.5" />
            <span>MERN PRODUCTION BLUEPRINT</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Smart Hostel Management System
          </h1>

          <p className="text-slate-300 text-base leading-relaxed">
            A highly available, horizontally scalable enterprise web application engineered to orchestrate multi-block student lodging, facilities ticketing, high-security gate logs, and accounting reconciliations.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <div className="flex items-center space-x-1.5 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>JWT + HTTP-Only Cookies</span>
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <CheckCircle2 className="h-4 w-4 text-indigo-400" />
              <span>Strict 3-Tier RBAC</span>
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <CheckCircle2 className="h-4 w-4 text-amber-400" />
              <span>ACID Multi-Doc Transactions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Core Architectural Pillars */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">System Functional Matrix</h2>
          <p className="text-sm text-slate-600">The 7 core enterprise modules fully designed and spec'd in this repository.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx}
                className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{feat.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{feat.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Status: Configured</span>
                  <span className="text-indigo-600 font-semibold">Production Ready</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tech Stack Breakdown */}
      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Enterprise Technology Stack
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-3 rounded-lg border border-slate-200 text-center space-y-1">
            <div className="text-xs font-bold text-slate-400 font-mono">DATABASE</div>
            <div className="font-bold text-slate-800 text-sm">MongoDB Enterprise</div>
            <div className="text-[10px] text-slate-500">Mongoose ODM + Replica Sets</div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-slate-200 text-center space-y-1">
            <div className="text-xs font-bold text-slate-400 font-mono">BACKEND</div>
            <div className="font-bold text-slate-800 text-sm">Node.js + Express</div>
            <div className="text-[10px] text-slate-500">TypeScript + Zod + Helmet</div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-slate-200 text-center space-y-1">
            <div className="text-xs font-bold text-slate-400 font-mono">FRONTEND</div>
            <div className="font-bold text-slate-800 text-sm">React 19 + Vite</div>
            <div className="text-[10px] text-slate-500">Tailwind CSS + Lucide Icons</div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-slate-200 text-center space-y-1">
            <div className="text-xs font-bold text-slate-400 font-mono">STATE & CACHE</div>
            <div className="font-bold text-slate-800 text-sm">TanStack Query</div>
            <div className="text-[10px] text-slate-500">Redux Toolkit + Redis</div>
          </div>
        </div>
      </div>

    </div>
  );
};
