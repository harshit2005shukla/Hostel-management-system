import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { 
  Users, 
  Bed, 
  MessageSquareWarning, 
  CreditCard, 
  UserCheck, 
  TrendingUp,
  RefreshCw,
  PieChart
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await apiService.getDashboardStats();
      setStats(res.data.telemetry);
    } catch (err) {
      console.error('Failed to load dashboard metrics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Executive Command Center
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            System-wide telemetry, comprehensive asset saturation, and live financial ledger summaries.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to="/admin/analytics"
            className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs"
          >
            <PieChart className="h-3.5 w-3.5" />
            <span>Graphical Studio</span>
          </Link>

          <button
            onClick={loadStats}
            disabled={loading}
            className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Telemetry</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Array */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs h-28 animate-pulse flex flex-col justify-between">
              <div className="h-4 bg-slate-200 rounded w-1/2" />
              <div className="h-8 bg-slate-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Occupancy Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold font-mono uppercase tracking-wider">
                Bed Saturation
              </span>
              <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                <Bed className="h-4 w-4" />
              </div>
            </div>

            <div>
              <div className="text-2xl font-extrabold text-slate-900">
                {stats.occupancy.occupancyRate}%
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {stats.occupancy.occupiedBeds} of {stats.occupancy.totalBeds} beds booked
              </div>
            </div>

            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-600 h-full rounded-full" 
                style={{ width: `${stats.occupancy.occupancyRate}%` }}
              />
            </div>
          </div>

          {/* Active Residents Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold font-mono uppercase tracking-wider">
                Active Residents
              </span>
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <Users className="h-4 w-4" />
              </div>
            </div>

            <div>
              <div className="text-2xl font-extrabold text-slate-900">
                {stats.residents.totalActiveStudents}
              </div>
              <div className="text-[11px] text-emerald-600 font-bold mt-0.5 flex items-center space-x-0.5">
                <TrendingUp className="h-3 w-3" />
                <span>100% Enrollment mapped</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-400">
              Across {stats.occupancy.totalRooms} configured room assets
            </div>
          </div>

          {/* Pending Tickets Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold font-mono uppercase tracking-wider">
                Facility Backlog
              </span>
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <MessageSquareWarning className="h-4 w-4" />
              </div>
            </div>

            <div>
              <div className="text-2xl font-extrabold text-amber-600">
                {stats.facilities.pendingTickets}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {stats.facilities.totalActiveTickets} total active filings
              </div>
            </div>

            <div className="text-[10px] text-amber-700 font-medium">
              Requires immediate SLA review
            </div>
          </div>

          {/* Finance Collection Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold font-mono uppercase tracking-wider">
                Fee Realization
              </span>
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <CreditCard className="h-4 w-4" />
              </div>
            </div>

            <div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                ₹{(stats.finance.totalCollectedAmount || 0).toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {stats.finance.collectionRate}% of ledger cleared
              </div>
            </div>

            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full" 
                style={{ width: `${stats.finance.collectionRate}%` }}
              />
            </div>
          </div>

        </div>
      ) : null}

      {/* Workspace Management Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Task Launcher */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Quick Actions
          </h3>

          <div className="space-y-2">
            <Link
              to="/admin/students"
              className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-100 text-xs font-bold transition-all text-slate-800 hover:text-indigo-700"
            >
              <div className="flex items-center space-x-2.5">
                <Users className="h-4 w-4 text-indigo-600" />
                <span>Onboard New Student</span>
              </div>
              <span className="text-slate-400">→</span>
            </Link>

            <Link
              to="/admin/rooms"
              className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-100 text-xs font-bold transition-all text-slate-800 hover:text-indigo-700"
            >
              <div className="flex items-center space-x-2.5">
                <Bed className="h-4 w-4 text-indigo-600" />
                <span>Provision Room Asset</span>
              </div>
              <span className="text-slate-400">→</span>
            </Link>

            <Link
              to="/admin/fees"
              className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-100 text-xs font-bold transition-all text-slate-800 hover:text-indigo-700"
            >
              <div className="flex items-center space-x-2.5">
                <CreditCard className="h-4 w-4 text-indigo-600" />
                <span>Apply Ledger Fine</span>
              </div>
              <span className="text-slate-400">→</span>
            </Link>
          </div>
        </div>

        {/* Real-time Status Breakdown */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Gate Security & Inventory Health
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
                <UserCheck className="h-4 w-4 text-indigo-600" />
                <span>Gate Concurrency</span>
              </div>

              <div className="text-sm text-slate-700">
                Currently <strong className="text-slate-900">{stats?.security?.currentOnPremisesVisitors || 0} external visitors</strong> registered with active Entry Pass stamps inside hostel premises.
              </div>

              <Link 
                to="/admin/visitors"
                className="text-xs text-indigo-600 hover:underline font-bold block"
              >
                Inspect Visitor Logs
              </Link>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
                <Bed className="h-4 w-4 text-amber-600" />
                <span>Maintenance Inventory</span>
              </div>

              <div className="text-sm text-slate-700">
                <strong className="text-amber-600">{stats?.occupancy?.maintenanceRooms || 0} room assets</strong> placed under explicit engineering holds. Prohibited from automated allocations.
              </div>

              <Link 
                to="/admin/rooms"
                className="text-xs text-indigo-600 hover:underline font-bold block"
              >
                Manage Room Inventory
              </Link>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
