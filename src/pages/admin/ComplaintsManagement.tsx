import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { 
  MessageSquareWarning, 
  Sliders, 
  Send,
  UserCheck,
  Building2,
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ComplaintsManagement: React.FC = () => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Comment Form States
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const { user } = useAuth();

  const loadComplaints = async () => {
    setLoading(true);
    try {
      const res = await apiService.getComplaints(statusFilter);
      setComplaints(res.data.complaints || []);
    } catch (err) {
      console.error('Failed to retrieve service tickets', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, [statusFilter]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await apiService.updateComplaintStatus(id, newStatus);
      loadComplaints();
    } catch (err) {
      console.error('Failed to change status', err);
    }
  };

  const handleAddComment = async (id: string) => {
    const text = commentInputs[id];
    if (!text?.trim()) return;

    try {
      const author = user ? `${user.firstName} ${user.lastName}` : 'Staff Administrator';
      await apiService.addComplaintComment(id, text, author);
      
      // Clear input
      setCommentInputs({ ...commentInputs, [id]: '' });
      loadComplaints();
    } catch (err) {
      console.error('Failed to append thread dialogue', err);
    }
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'Critical': return 'bg-rose-600 text-white';
      case 'High': return 'bg-rose-100 text-rose-800';
      case 'Medium': return 'bg-amber-100 text-amber-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'Resolved': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'In-Progress': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Facility & Discipline Ticketing Engine
        </h1>
        <p className="text-xs text-slate-600 mt-0.5">
          Role-based ticketing framework auto-routing facility and discipline defects directly to accountable staff with explicit resolution SLAs.
        </p>
      </div>

      {/* Filter Options */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Sliders className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-xs font-bold text-slate-700">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg text-xs px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In-Progress">In-Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <div className="text-[11px] text-slate-500 font-mono">
          Active Tickets: <strong className="text-slate-900">{complaints.length}</strong>
        </div>
      </div>

      {/* Primary List Array */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-slate-400 italic text-xs">
            Loading service tickets...
          </div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
            No service request tickets match your selected filters.
          </div>
        ) : (
          complaints.map((comp) => (
            <div 
              key={comp._id} 
              className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden space-y-3"
            >
              
              {/* Ticket Header */}
              <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2.5">
                  <div className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg">
                    <MessageSquareWarning className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-900">
                        {comp.title}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase font-bold ${getPriorityBadge(comp.priority)}`}>
                        {comp.priority}
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-400 font-mono flex items-center space-x-2 mt-0.5">
                      <span>Cat: <strong>{comp.category}</strong></span>
                      <span>•</span>
                      <span className="flex items-center space-x-0.5">
                        <Clock className="h-2.5 w-2.5" />
                        <span>{new Date(comp.createdAt).toLocaleDateString()}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono border font-bold ${getStatusBadge(comp.status)}`}>
                    {comp.status}
                  </span>

                  {/* Operational Status Select Action directly in view */}
                  <select
                    value={comp.status}
                    onChange={(e) => handleStatusChange(comp._id, e.target.value)}
                    className="bg-white border border-slate-200 rounded text-[10px] font-bold px-1.5 py-0.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Pending">Mark Pending</option>
                    <option value="In-Progress">Mark In-Progress</option>
                    <option value="Resolved">Mark Resolved</option>
                  </select>
                </div>
              </div>

              {/* Ticket Description */}
              <div className="px-4 text-xs text-slate-700 leading-relaxed">
                {comp.description}
              </div>

              {/* Originator / Mapping Sub-Bar */}
              <div className="px-4 py-1.5 bg-slate-50 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center space-x-2">
                  <UserCheck className="h-3 w-3 text-slate-400" />
                  <span>Originator: <strong>{comp.student?.user?.firstName} {comp.student?.user?.lastName}</strong></span>
                  <span className="text-slate-400 font-mono">({comp.student?.enrollmentNumber})</span>
                </div>

                <div className="flex items-center space-x-1 font-mono text-indigo-700">
                  <Building2 className="h-3 w-3" />
                  <span>Room {comp.room?.roomNumber}</span>
                  <span className="text-[10px] text-slate-400 font-sans">
                    ({comp.room?.hostelBlock})
                  </span>
                </div>
              </div>

              {/* Thread Dialogue Forum */}
              <div className="p-4 bg-slate-50/30 border-t border-slate-100 space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Dialogue Thread ({comp.comments?.length || 0})
                </span>

                <div className="space-y-2">
                  {(comp.comments || []).map((cm: any, ci: number) => (
                    <div key={ci} className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <strong className="text-indigo-700">{cm.postedBy}</strong>
                        <span className="font-mono">{new Date(cm.postedAt).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{cm.message}</p>
                    </div>
                  ))}

                  {(comp.comments || []).length === 0 && (
                    <div className="text-[11px] text-slate-400 italic py-1">
                      No dialogue logs added yet. Type below to initiate communication.
                    </div>
                  )}
                </div>

                {/* Comment Input */}
                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="text"
                    value={commentInputs[comp._id] || ''}
                    onChange={(e) => setCommentInputs({ ...commentInputs, [comp._id]: e.target.value })}
                    placeholder="Append transparent feedback dialogue..."
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                  />
                  
                  <button
                    onClick={() => handleAddComment(comp._id)}
                    disabled={!commentInputs[comp._id]?.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center space-x-1"
                  >
                    <Send className="h-3 w-3" />
                    <span className="hidden sm:inline">Post</span>
                  </button>
                </div>

              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
