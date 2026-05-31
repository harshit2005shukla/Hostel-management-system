import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  ArrowRight, 
  Compass, 
  FileCode, 
  Layers, 
  ShieldCheck, 
  Server, 
  CheckCircle2 
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      
      {/* Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
      </div>

      {/* Top Simple Brand Header */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between w-full relative z-10">
        <div className="flex items-center space-x-2.5">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-md shadow-indigo-600/30">
            <Building2 className="h-6 w-6" />
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="font-extrabold text-lg tracking-tight">SmartHostel</span>
            <span className="bg-indigo-500/20 text-indigo-400 text-[10px] px-2 py-0.5 rounded font-mono border border-indigo-500/30">
              v1.0-PRODUCTION
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/architecture"
            className="text-xs font-bold text-slate-300 hover:text-white transition-colors hidden sm:block"
          >
            System Blueprint
          </Link>
          <Link
            to="/backend-code"
            className="text-xs font-bold text-slate-300 hover:text-white transition-colors hidden sm:block"
          >
            Backend Explorer
          </Link>
          <Link
            to="/login"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            Launch Client Hub
          </Link>
        </div>
      </header>

      {/* Primary Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative z-10 flex-1 flex flex-col justify-center">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Intro Text */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center space-x-2 bg-slate-800/80 text-slate-300 px-3 py-1.5 rounded-full text-xs font-mono border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>COMPLETE ENTERPRISE MERN SOLUTION</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-white">
              Smart Hostel <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-200 to-emerald-300">
                Management System
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
              A highly available, horizontally scalable lodging management suite built specifically to orchestrate multi-block student lodging, facility defect tracking, gate visitor registries, and financial reconciliations.
            </p>

            {/* Quick Feature Badges */}
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="flex items-center space-x-1.5 text-xs text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-800">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>3-Tier RBAC Gatekeeping</span>
              </div>

              <div className="flex items-center space-x-1.5 text-xs text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-800">
                <Server className="h-4 w-4 text-indigo-400" />
                <span>Atomic Multi-Doc Logic</span>
              </div>

              <div className="flex items-center space-x-1.5 text-xs text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-800">
                <Layers className="h-4 w-4 text-amber-400" />
                <span>Zod & Validator DTOs</span>
              </div>
            </div>

          </div>

          {/* Right Core Actions Card Matrix */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Action 1: Launch Live Frontend Web App */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-2xl border border-white/10 space-y-4 backdrop-blur-xs relative overflow-hidden group hover:border-indigo-500/50 transition-all">
              <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all" />

              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-indigo-400 font-mono text-xs font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <span>PRODUCTION PORTAL</span>
                </div>

                <h3 className="text-xl font-extrabold text-white">
                  Launch Complete Client Hub
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Test the fully built React 19 Frontend App featuring dynamic dashboards, active room allocations, fine ledgers, and secure nested navigation.
                </p>
              </div>

              <div>
                <Link
                  to="/login"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-1"
                >
                  <span>Enter Application Hub</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Action 2: Inspect Complete Architecture Blueprint */}
            <div className="bg-slate-800/40 p-5 rounded-xl border border-slate-700/80 space-y-3 hover:bg-slate-800/60 transition-all">
              <div className="flex items-center space-x-2 text-slate-200">
                <Compass className="h-4 w-4 text-indigo-400" />
                <h4 className="text-sm font-bold text-white">
                  System Architecture & DB Blueprints
                </h4>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Review the complete monorepo specifications, MongoDB hybrid schemas, collections join logic, ER diagrams, and interactive API Sandbox planners.
              </p>

              <div>
                <Link
                  to="/architecture"
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-bold inline-flex items-center space-x-1"
                >
                  <span>Explore Architecture Document</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Action 3: Browse Backend Code & Run HTTP Simulator */}
            <div className="bg-slate-800/40 p-5 rounded-xl border border-slate-700/80 space-y-3 hover:bg-slate-800/60 transition-all">
              <div className="flex items-center space-x-2 text-slate-200">
                <FileCode className="h-4 w-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">
                  Backend Source Code Explorer
                </h4>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Browse every production-ready backend file directly inside the embedded browser. Execute live controller functions and monitor token telemetry.
              </p>

              <div>
                <Link
                  to="/backend-code"
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-bold inline-flex items-center space-x-1"
                >
                  <span>Inspect Backend Code Repository</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Footer Credentials */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500 space-y-1 relative z-10">
        <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400">
          <span className="flex items-center space-x-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
            <span>MERN Stack</span>
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
            <span>JWT + Cookies</span>
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
            <span>Role-Based Access Control</span>
          </span>
        </div>

        <p>Smart Hostel Management System — Fully designed and built for enterprise evaluation.</p>
      </footer>

    </div>
  );
};
