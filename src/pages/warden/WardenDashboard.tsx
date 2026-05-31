import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { 
  Bed, 
  MessageSquareWarning, 
  UserCheck, 
  RefreshCw,
  Building2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const WardenDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await apiService.getDashboardStats();
      setStats(res.data.telemetry);
    } catch (err) {
      console.error('Failed to load warden metrics', err);
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
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Block Warden Telemetry
            </h1>
            <span className="text-[10px] bg-amber-50 text-amber-700 font-mono font-bold px-2 py-0.5 rounded border border-amber-200 uppercase">
              Block A Scoped
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Hostel-specific metrics, pending leave actions, and immediate maintenance support logs.
          </p>
        </div>

        <button
          onClick={loadStats}
          disabled={loading}
          className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Sync Block States</span>
        </button>
      </div>

      {/* Primary Metrics Array */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs h-28 animate-pulse flex flex-col justify-between">
              <div className="h-4 bg-slate-200 rounded w-1/2" />
              <div className="h-8 bg-slate-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Gate Logs Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold font-mono uppercase tracking-wider">
                Gate Registry
              </span>
              <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                <UserCheck className="h-4 w-4" />
              </div>
            </div>

            <div>
              <div className="text-2xl font-extrabold text-slate-900">
                {stats.security.currentOnPremisesVisitors} Active
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                External visitors registered inside premises
              </div>
            </div>

            <Link
              to="/warden/visitors"
              className="text-[11px] text-indigo-600 hover:underline font-bold block pt-1"
            >
              Stamp Departures →
            </Link>
          </div>

          {/* Block Capacity Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold font-mono uppercase tracking-wider">
                Asset Inventory
              </span>
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <Bed className="h-4 w-4" />
              </div>
            </div>

            <div>
              <div className="text-2xl font-extrabold text-slate-900">
                {stats.occupancy.availableRooms} Free Rooms
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {stats.occupancy.maintenanceRooms} held under maintenance
              </div>
            </div>

            <Link
              to="/warden/rooms"
              className="text-[11px] text-indigo-600 hover:underline font-bold block pt-1"
            >
              Inspect Floor Saturation →
            </Link>
          </div>

          {/* Service Tickets Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold font-mono uppercase tracking-wider">
                Maintenance Backlog
              </span>
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <MessageSquareWarning className="h-4 w-4" />
              </div>
            </div>

            <div>
              <div className="text-2xl font-extrabold text-amber-600">
                {stats.facilities.pendingTickets} Pending
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {stats.facilities.totalActiveTickets} total active tickets
              </div>
            </div>

            <Link
              to="/warden/complaints"
              className="text-[11px] text-indigo-600 hover:underline font-bold block pt-1"
            >
              Cycle Status Queues →
            </Link>
          </div>

        </div>
      ) : null}

      {/* Operational Directives */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
        <div className="flex items-center space-x-2">
          <Building2 className="h-4 w-4 text-indigo-600" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Block Operations & SLA Directives
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Gate Access Protocol
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              All non-resident arrivals must present verifiable Government ID proof (National ID, Passport, or Driver License) prior to receiving physical entry permissions. Departure checkout audits must be stamped upon exit.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Infrastructure Escalations
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Defects mapped to Critical priority (e.g., severe electrical faults or extensive plumbing leaks) demand immediate assignment and engineering response. Update status queues to maintain full resident communication transparency.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
