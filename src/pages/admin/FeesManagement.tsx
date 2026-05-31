import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { 
  CreditCard, 
  PlusCircle, 
  CheckCircle2, 
  Building2, 
  Sliders,
  DollarSign,
  X
} from 'lucide-react';

export const FeesManagement: React.FC = () => {
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  // Modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Payment states
  const [paymentInputs, setPaymentInputs] = useState<{ [key: string]: number }>({});
  const [paymentStatusMsg, setPaymentStatusMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    studentId: 'stu_1',
    feeType: 'Maintenance Fine',
    amount: 2500,
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    billingPeriod: 'Spring Semester 2026'
  });

  const loadFees = async () => {
    setLoading(true);
    try {
      const res = await apiService.getFees();
      let list = res.data.fees || [];
      if (statusFilter) {
        list = list.filter((f: any) => f.status === statusFilter);
      }
      setFees(list);
    } catch (err) {
      console.error('Failed to load accounting ledgers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFees();
  }, [statusFilter]);

  const handleCreateFee = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiService.createFee(formData);
      setIsModalOpen(false);
      setFormData({
        studentId: 'stu_1',
        feeType: 'Maintenance Fine',
        amount: 2500,
        dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
        billingPeriod: 'Spring Semester 2026'
      });
      loadFees();
    } catch (err) {
      console.error('Fee assignment failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleProcessPayment = async (id: string, _totalAmount: number, _currentPaid: number) => {
    const payVal = paymentInputs[id];
    if (!payVal || payVal <= 0) return;

    setPaymentStatusMsg(null);
    try {
      await apiService.processPayment(id, payVal);
      setPaymentStatusMsg('Remittance reconciled! Ledger entry cleared.');
      
      // Clear input
      setPaymentInputs({ ...paymentInputs, [id]: 0 });
      loadFees();

      setTimeout(() => setPaymentStatusMsg(null), 3000);
    } catch (err) {
      console.error('Remittance processing failed', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Partially Paid': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Overdue': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Financial Ledger & Reconciliations
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Financial ledger itemizing rent charges, mess subscriptions, operational fines, and successful receipt reconciliations.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-xs"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Apply Ledger Item</span>
        </button>
      </div>

      {paymentStatusMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg text-xs font-mono">
          {paymentStatusMsg}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Sliders className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-xs font-bold text-slate-700">Payment Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg text-xs px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Partially Paid">Partially Paid</option>
          </select>
        </div>

        <div className="text-[11px] text-slate-500 font-mono">
          Listed Charges: <strong className="text-slate-900">{fees.length}</strong>
        </div>
      </div>

      {/* Ledger Table Array */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                <th className="py-3 px-4">Ledger Type</th>
                <th className="py-3 px-4">Accountable Individual</th>
                <th className="py-3 px-4">Financial Outstandings</th>
                <th className="py-3 px-4">Billing Timeline</th>
                <th className="py-3 px-4">Reconcile Remittance</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                    Retrieving ledger items...
                  </td>
                </tr>
              ) : fees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No financial ledger outstandings match your criteria.
                  </td>
                </tr>
              ) : (
                fees.map((fee) => (
                  <tr key={fee._id} className="hover:bg-slate-50/50 transition-colors">
                    
                    <td className="py-3 px-4 space-y-0.5">
                      <div className="font-bold text-slate-900">{fee.feeType}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {fee.billingPeriod}
                      </div>
                    </td>

                    <td className="py-3 px-4 space-y-0.5">
                      <div className="font-bold text-indigo-700">
                        {fee.student?.user?.firstName || 'Assigned'} {fee.student?.user?.lastName || 'Resident'}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono flex items-center space-x-1">
                        <Building2 className="h-2.5 w-2.5" />
                        <span>Room {fee.student?.currentRoom?.roomNumber || '101A'}</span>
                        <span className="text-[9px]">({fee.student?.enrollmentNumber})</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 space-y-0.5">
                      <div className="text-sm font-extrabold text-slate-900 font-mono">
                        ₹{fee.amount?.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Paid: <strong className="text-emerald-600">₹{(fee.paidAmount || 0).toLocaleString()}</strong>
                      </div>
                    </td>

                    <td className="py-3 px-4 space-y-1">
                      <div className="text-[11px] text-slate-700">
                        Due: <strong>{new Date(fee.dueDate).toLocaleDateString()}</strong>
                      </div>
                      <div>
                        <span className={`text-[9px] px-2 py-0.2 rounded font-mono uppercase font-bold border ${getStatusColor(fee.status)}`}>
                          {fee.status}
                        </span>
                      </div>

                      {fee.transactionId && (
                        <div className="text-[9px] text-slate-400 font-mono truncate max-w-xs">
                          TXN: {fee.transactionId}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {fee.status === 'Paid' ? (
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100 inline-flex items-center space-x-1">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Remittance Cleared</span>
                        </span>
                      ) : (
                        <div className="flex items-center space-x-1.5">
                          <div className="relative w-24">
                            <div className="absolute inset-y-0 left-0 pl-1.5 flex items-center text-slate-400">
                              <DollarSign className="h-3 w-3 text-slate-400" />
                            </div>
                            <input
                              type="number"
                              min="1"
                              max={fee.amount - (fee.paidAmount || 0)}
                              value={paymentInputs[fee._id] || ''}
                              onChange={(e) => setPaymentInputs({ ...paymentInputs, [fee._id]: Number(e.target.value) })}
                              placeholder="Amount"
                              className="w-full pl-5 pr-1 py-1 bg-white border border-slate-200 rounded text-[11px] font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>

                          <button
                            onClick={() => handleProcessPayment(fee._id, fee.amount, fee.paidAmount || 0)}
                            disabled={!paymentInputs[fee._id]}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-2.5 py-1 rounded text-[10px] font-bold transition-all shrink-0"
                          >
                            Pay
                          </button>
                        </div>
                      )}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full flex flex-col overflow-hidden">
            
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-indigo-400" />
                <span className="text-xs font-bold uppercase tracking-wider font-mono">
                  Apply Accounting Line Item
                </span>
              </div>

              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFee} className="p-6 space-y-4">
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 block">Target Student ID *</label>
                <input
                  type="text"
                  required
                  value={formData.studentId}
                  onChange={e => setFormData({...formData, studentId: e.target.value})}
                  placeholder="e.g. stu_1"
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 block">Fee Bucket Type *</label>
                  <select
                    value={formData.feeType}
                    onChange={e => setFormData({...formData, feeType: e.target.value})}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="Room Rent">Room Rent</option>
                    <option value="Mess Fee">Mess Fee</option>
                    <option value="Maintenance Fine">Maintenance Fine</option>
                    <option value="Late Fine">Late Fine</option>
                    <option value="Security Deposit">Security Deposit</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 block">Amount (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: Number(e.target.value)})}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 block">Clearing Due Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={e => setFormData({...formData, dueDate: e.target.value})}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 block">Billing Period *</label>
                  <input
                    type="text"
                    required
                    value={formData.billingPeriod}
                    onChange={e => setFormData({...formData, billingPeriod: e.target.value})}
                    placeholder="Spring Semester 2026"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
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
                  {submitting ? 'Applying...' : 'Apply Ledger Fine'}
                </button>
              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};
