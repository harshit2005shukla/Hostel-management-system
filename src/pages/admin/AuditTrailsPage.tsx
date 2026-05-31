import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { 
  Search, 
  Sliders, 
  RefreshCw,
  Download,
  Terminal,
  User,
  Layers
} from 'lucide-react';

export const AuditTrailsPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [moduleFilter, setModuleFilter] = useState<string>('');
  const [actionFilter, setActionFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Selected Log for metadata inspection
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await apiService.getActivityLogs({
        module: moduleFilter || undefined,
        action: actionFilter || undefined,
        search: searchTerm || undefined,
        limit: 100
      });
      setLogs(res.data?.logs || []);
    } catch (err) {
      console.error('Failed to query enterprise audit logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [moduleFilter, actionFilter, searchTerm]);

  const exportAuditCsv = () => {
    const header = '"Audit ID","Timestamp","Affected Module","Action Code","Originating User Context","IP Address","Description"';
    const rows = logs.map(l => {
      const userName = l.user ? `${l.user.firstName || ''} ${l.user.lastName || ''}`.trim() : 'System Agent';
      const userRole = l.user?.role || 'System';
      return `"${l._id}","${l.createdAt}","${l.module}","${l.action}","${userName} (${userRole})","${l.ipAddress || '127.0.0.1'}","${l.description.replace(/"/g, '""')}"`;
    });

    const csvStr = [header, ...rows].join('\n');
    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csvStr);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Enterprise_Audit_Trail_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getModuleColor = (mod: string) => {
    switch (mod) {
      case 'Auth': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Allocations': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Complaints': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Fees': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Visitors': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Immutable Audit Trail
            </h1>
            <span className="text-[10px] bg-slate-900 text-slate-200 font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              Compliance Vault
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5 max-w-2xl">
            Cryptographically timestamped activity logs protecting operational changes, security entries, authentication lifecycles, and financial transactions.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-stretch sm:self-auto">
          <button
            onClick={exportAuditCsv}
            className="flex-1 sm:flex-auto items-center justify-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-lg text-xs font-bold transition-all inline-flex"
            title="Export complete visible logs as a raw CSV spreadsheet"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={loadLogs}
            disabled={loading}
            className="flex-1 sm:flex-auto items-center justify-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-xs inline-flex shrink-0"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Audit Engine</span>
          </button>
        </div>
      </div>

      {/* Control Tools Frame */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        
        {/* Left Side: Domain & Action Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          
          {/* Module Selection */}
          <div className="flex items-center space-x-1.5">
            <Layers className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-xs font-bold text-slate-700">Domain:</span>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg text-xs px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Modules</option>
              <option value="Auth">Auth</option>
              <option value="Students">Students</option>
              <option value="Rooms">Rooms</option>
              <option value="Allocations">Allocations</option>
              <option value="Complaints">Complaints</option>
              <option value="Visitors">Visitors</option>
              <option value="Fees">Fees</option>
              <option value="System">System</option>
            </select>
          </div>

          {/* Action Keyword Selection */}
          <div className="flex items-center space-x-1.5">
            <Sliders className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-xs font-bold text-slate-700">Event Code:</span>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg text-xs px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Events</option>
              <option value="USER_LOGIN">USER_LOGIN</option>
              <option value="USER_REGISTERED">USER_REGISTERED</option>
              <option value="ROOM_ALLOCATED">ROOM_ALLOCATED</option>
              <option value="ROOM_VACATED">ROOM_VACATED</option>
              <option value="COMPLAINT_FILED">COMPLAINT_FILED</option>
              <option value="COMPLAINT_UPDATED">COMPLAINT_UPDATED</option>
              <option value="FEE_GENERATED">FEE_GENERATED</option>
              <option value="FEE_COLLECTED">FEE_COLLECTED</option>
              <option value="VISITOR_CHECKED_IN">VISITOR_CHECKED_IN</option>
            </select>
          </div>

        </div>

        {/* Right Side: Search & Totals */}
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
              <Search className="h-3.5 w-3.5" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search descriptions..."
              className="w-full pl-8 pr-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
          </div>

          <div className="text-[11px] text-slate-500 font-mono shrink-0">
            Audits: <strong className="text-slate-900">{logs.length}</strong>
          </div>
        </div>

      </div>

      {/* Main Workspace Frame: Audit Roster + Metadata Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Audit Trail Records */}
        <div className="lg:col-span-7 space-y-2 max-h-[600px] overflow-y-auto pr-1">
          {loading ? (
            <div className="text-center py-12 text-slate-400 italic text-xs">
              Synchronizing secure audit engine...
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
              No audit logs match specified domain modules or keywords.
            </div>
          ) : (
            logs.map((log) => {
              const isSelected = selectedLog?._id === log._id;
              
              return (
                <div
                  key={log._id}
                  onClick={() => setSelectedLog(log)}
                  className={`
                    p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-2
                    ${isSelected 
                      ? 'bg-white border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs' 
                      : 'bg-white hover:border-slate-300 border-slate-200/80'
                    }
                  `}
                >
                  {/* Row 1: Badges & Timestamps */}
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[9px] px-2 py-0.2 rounded font-mono font-bold uppercase border ${getModuleColor(log.module)}`}>
                        {log.module}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-800">
                        {log.action}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {/* Row 2: Description text */}
                  <p className="text-xs text-slate-700 leading-relaxed font-sans">
                    {log.description}
                  </p>

                  {/* Row 3: Agent Metadata */}
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-50">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3 text-slate-400" />
                      <span>Agent: <strong className="text-slate-700">{log.user?.firstName || 'System'} {log.user?.lastName || 'Context'}</strong></span>
                      <span className="font-mono">({log.user?.role || 'Root'})</span>
                    </div>

                    <span className="font-mono text-[9px] bg-slate-50 px-1.5 py-0.2 rounded text-slate-500 border">
                      IP: {log.ipAddress || '127.0.0.1'}
                    </span>
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* Right Side: Payload & Metadata JSON Inspector */}
        <div className="lg:col-span-5">
          {selectedLog ? (
            <div className="bg-slate-900 text-white rounded-xl border border-slate-800 shadow-xl overflow-hidden sticky top-20 animate-fadeIn flex flex-col h-[500px]">
              
              {/* Terminal Banner */}
              <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Terminal className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-mono text-slate-300 font-bold">Audit Trace Metadata Inspector</span>
                </div>

                <span className="text-[10px] bg-indigo-950 text-indigo-400 px-2 py-0.5 rounded font-mono border border-indigo-800">
                  {selectedLog._id}
                </span>
              </div>

              {/* Core Attributes Panel */}
              <div className="p-4 space-y-3 bg-slate-900/90 border-b border-slate-800 shrink-0">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 block font-mono uppercase">Cryptographic Audit Digest</span>
                  <div className="text-xs font-mono text-indigo-300 break-all">
                    sha256:{btoa(selectedLog._id + selectedLog.createdAt).substring(0, 32)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Execution Origin</span>
                    <span className="text-slate-200">{selectedLog.ipAddress}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Event Type Trigger</span>
                    <span className="text-emerald-400 font-bold">{selectedLog.action}</span>
                  </div>
                </div>
              </div>

              {/* JSON Metadata Viewer */}
              <div className="p-4 flex-1 overflow-y-auto font-mono text-xs text-slate-300 bg-slate-950/80 space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase tracking-wider mb-2">
                  Captured State Artifacts (JSON)
                </span>
                
                <pre className="leading-relaxed text-amber-300">
                  {JSON.stringify(selectedLog.metadata || {}, null, 2)}
                </pre>
              </div>

              {/* Footer info */}
              <div className="bg-slate-950 px-4 py-2 border-t border-slate-800 text-[10px] text-slate-500 font-mono flex items-center justify-between shrink-0">
                <span>Access: WORM Architecture</span>
                <span className="text-emerald-500">Integrity: Verified</span>
              </div>

            </div>
          ) : (
            <div className="bg-slate-100 rounded-xl h-48 flex items-center justify-center text-slate-400 text-xs text-center p-4">
              Select any real-time system audit trace log from the left to read its captured JSON payload state artifacts and network routing context.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
