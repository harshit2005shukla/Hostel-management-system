import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  MessageSquareWarning, 
  PlusCircle, 
  Send, 
  Sliders,
  Clock
} from 'lucide-react';

export const MyComplaints: React.FC = () => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('');

  // New Request Form
  const [showForm, setShowForm] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    category: 'Electrical',
    title: '',
    description: '',
    priority: 'Medium'
  });

  const { studentContext } = useAuth();

  const loadComplaints = async () => {
    setLoading(true);
    try {
      const res = await apiService.getComplaints(statusFilter);
      // Client-side isolation filter
      const list = (res.data.complaints || []).filter((c: any) => 
        c.student?._id === studentContext?._id || 
        c.student?.enrollmentNumber === studentContext?.enrollmentNumber
      );
      setComplaints(list);
    } catch (err) {
      console.error('Failed to pull personal filings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, [statusFilter]);

  const handleCreateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) return;

    setSubmitting(true);
    try {
      await apiService.createComplaint(formData, studentContext);
      setShowForm(false);
      setFormData({ category: 'Electrical', title: '', description: '', priority: 'Medium' });
      loadComplaints();
    } catch (err) {
      console.error('Filing failed', err);
    } finally {
      setSubmitting(false);
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            My Service Tickets
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            File facilities defect tickets and monitor administrative resolution updates directly.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-xs"
        >
          <PlusCircle className="h-4 w-4" />
          <span>{showForm ? 'Close Form' : 'File New Request'}</span>
        </button>
      </div>

      {/* Creation Form Frame */}
      {showForm && (
        <form 
          onSubmit={handleCreateComplaint}
          className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 animate-fadeIn"
        >
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block font-mono border-b pb-2">
            Originate Service Ticket
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-700 block">Defect Category *</label>
              <select
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              >
                <option value="Electrical">Electrical</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Carpentry">Carpentry</option>
                <option value="Cleanliness">Cleanliness</option>
                <option value="Internet">Internet</option>
                <option value="Discipline">Discipline</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-700 block">Summary Heading *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. Wi-Fi router no signal"
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-700 block">SLA Priority Urgency</label>
              <select
                value={formData.priority}
                onChange={e => setFormData({...formData, priority: e.target.value})}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-700 block">Detailed Failure Summary *</label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Provide specific details regarding the infrastructure failure..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center space-x-1"
            >
              <Send className="h-3 w-3" />
              <span>{submitting ? 'Submitting ticket...' : 'Submit Request'}</span>
            </button>
          </div>

        </form>
      )}

      {/* Filter Toggles */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Sliders className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-xs font-bold text-slate-700">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg text-xs px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Filings</option>
            <option value="Pending">Pending</option>
            <option value="In-Progress">In-Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <div className="text-[11px] text-slate-500 font-mono">
          My Tickets: <strong className="text-slate-900">{complaints.length}</strong>
        </div>
      </div>

      {/* List Array */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-slate-400 italic text-xs">
            Loading personal service tickets...
          </div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
            You do not have any active service requests.
          </div>
        ) : (
          complaints.map((comp) => (
            <div 
              key={comp._id} 
              className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden space-y-3"
            >
              
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

                <span className={`text-[10px] px-2 py-0.5 rounded font-mono border font-bold ${getStatusBadge(comp.status)}`}>
                  {comp.status}
                </span>
              </div>

              <div className="px-4 text-xs text-slate-700 leading-relaxed">
                {comp.description}
              </div>

              {/* Dialogue Threads */}
              {(comp.comments || []).length > 0 && (
                <div className="p-4 bg-slate-50/30 border-t border-slate-100 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Administrative Thread Updates
                  </span>

                  <div className="space-y-2">
                    {comp.comments.map((cm: any, ci: number) => (
                      <div key={ci} className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <strong className="text-indigo-700">{cm.postedBy}</strong>
                          <span className="font-mono">{new Date(cm.postedAt).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{cm.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ))
        )}
      </div>

    </div>
  );
};
