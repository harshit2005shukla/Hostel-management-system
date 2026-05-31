import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { 
  UserCheck, 
  PlusCircle, 
  LogOut, 
  Clock, 
  Building2,
  Phone,
  FileText,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const VisitorsManagement: React.FC = () => {
  const [visitors, setVisitors] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    visitorName: '',
    phone: '',
    idProofType: 'National ID',
    idProofNumber: '',
    relationToStudent: 'Father',
    studentToVisit: 'stu_1'
  });

  const { user } = useAuth();

  const loadVisitors = async () => {
    setLoading(true);
    try {
      const res = await apiService.getVisitors();
      setVisitors(res.data.visitors || []);
    } catch (err) {
      console.error('Failed to retrieve security log', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVisitors();
  }, []);

  const handleCreateVisitor = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiService.createVisitor(formData);
      setIsModalOpen(false);
      setFormData({
        visitorName: '', phone: '', idProofType: 'National ID',
        idProofNumber: '', relationToStudent: 'Father', studentToVisit: 'stu_1'
      });
      loadVisitors();
    } catch (err) {
      console.error('Registration failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckout = async (id: string) => {
    try {
      await apiService.checkoutVisitor(id);
      loadVisitors();
    } catch (err) {
      console.error('Checkout failed', err);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Security Gate Registries
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Security monitoring registry tracking outsider entry, government documentation, and departure checkout audits.
          </p>
        </div>

        {user?.role !== 'Student' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-xs"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Log Guest Entry</span>
          </button>
        )}
      </div>

      {/* Visitor Logs Array */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
            Active & Historical Log Entries
          </span>

          <span className="text-[11px] text-slate-500 font-mono">
            Total Audits: <strong className="text-slate-900">{visitors.length}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                <th className="py-3 px-4">Visitor Identity</th>
                <th className="py-3 px-4">Host Resident Binding</th>
                <th className="py-3 px-4">Government Documentation</th>
                <th className="py-3 px-4">Entry / Exit Instant</th>
                <th className="py-3 px-4">Gate Validation</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                    Retrieving gate audit entries...
                  </td>
                </tr>
              ) : visitors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No visitor logs recorded.
                  </td>
                </tr>
              ) : (
                visitors.map((vis) => (
                  <tr key={vis._id} className="hover:bg-slate-50/50 transition-colors">
                    
                    <td className="py-3 px-4 space-y-0.5">
                      <div className="font-bold text-slate-900">{vis.visitorName}</div>
                      <div className="text-[10px] text-slate-500 flex items-center space-x-1">
                        <Phone className="h-2.5 w-2.5" />
                        <span>{vis.phone}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 space-y-0.5">
                      <div className="font-bold text-indigo-700">
                        {vis.studentToVisit?.user?.firstName || 'Assigned'} {vis.studentToVisit?.user?.lastName || 'Student'}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono flex items-center space-x-1">
                        <Building2 className="h-2.5 w-2.5" />
                        <span>Room {vis.studentToVisit?.currentRoom?.roomNumber || '101A'}</span>
                        <span className="text-[9px]">({vis.relationToStudent})</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 space-y-0.5 font-mono">
                      <div className="text-slate-800 font-bold">{vis.idProofType}</div>
                      <div className="text-[10px] text-slate-400 flex items-center space-x-1">
                        <FileText className="h-2.5 w-2.5" />
                        <span>{vis.idProofNumber}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 space-y-1">
                      <div className="text-[11px] text-slate-700 flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-emerald-600 shrink-0" />
                        <span>In: {new Date(vis.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      {vis.checkOutTime ? (
                        <div className="text-[11px] text-slate-500 flex items-center space-x-1">
                          <LogOut className="h-3 w-3 text-slate-400 shrink-0" />
                          <span>Out: {new Date(vis.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      ) : (
                        <span className="text-[9px] bg-amber-50 text-amber-700 px-1.5 py-0.2 rounded border border-amber-100 block w-max font-bold">
                          On Premises
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 space-y-1">
                      <div>
                        <span className={`text-[9px] px-2 py-0.5 rounded font-mono uppercase font-bold border ${
                          vis.status === 'Checked-In' ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {vis.status}
                        </span>
                      </div>

                      {/* Checkout Action directly accessible for active guests */}
                      {vis.status === 'Checked-In' && user?.role !== 'Student' && (
                        <button
                          onClick={() => handleCheckout(vis._id)}
                          className="text-[10px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-bold transition-colors block"
                        >
                          Stamp Checkout
                        </button>
                      )}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full flex flex-col overflow-hidden">
            
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <UserCheck className="h-4 w-4 text-indigo-400" />
                <span className="text-xs font-bold uppercase tracking-wider font-mono">
                  Register Arriving Guest
                </span>
              </div>

              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateVisitor} className="p-6 space-y-4">
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 block">Visitor Legal Name *</label>
                <input
                  type="text"
                  required
                  value={formData.visitorName}
                  onChange={e => setFormData({...formData, visitorName: e.target.value})}
                  placeholder="e.g. Rajesh Mehta"
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 block">Verified Phone Number *</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  placeholder="+91 98765 43211"
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 block">Government ID Type *</label>
                  <select
                    value={formData.idProofType}
                    onChange={e => setFormData({...formData, idProofType: e.target.value})}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="National ID">National ID</option>
                    <option value="Passport">Passport</option>
                    <option value="Driver License">Driver License</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 block">ID Reference String *</label>
                  <input
                    type="text"
                    required
                    value={formData.idProofNumber}
                    onChange={e => setFormData({...formData, idProofNumber: e.target.value})}
                    placeholder="UID-9876-5432"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 block">Relationship to Student</label>
                  <input
                    type="text"
                    required
                    value={formData.relationToStudent}
                    onChange={e => setFormData({...formData, relationToStudent: e.target.value})}
                    placeholder="Father / Mother"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 block">Target Student ID</label>
                  <input
                    type="text"
                    required
                    value={formData.studentToVisit}
                    onChange={e => setFormData({...formData, studentToVisit: e.target.value})}
                    placeholder="stu_1"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1 text-xs text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs"
                >
                  {submitting ? 'Logging...' : 'Grant Entry Pass'}
                </button>
              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};
