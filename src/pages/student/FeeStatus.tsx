import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  CreditCard, 
  CheckCircle2, 
  Clock,
  AlertTriangle
} from 'lucide-react';

export const FeeStatus: React.FC = () => {
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { studentContext } = useAuth();

  const loadFees = async () => {
    setLoading(true);
    try {
      const res = await apiService.getFees();
      // Client-side isolation filter
      const list = (res.data.fees || []).filter((f: any) => 
        f.student?._id === studentContext?._id || 
        f.student?.enrollmentNumber === studentContext?.enrollmentNumber
      );
      setFees(list);
    } catch (err) {
      console.error('Failed to load fee status', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFees();
  }, []);

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
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
          My Fee Status & Reconciliations
        </h1>
        <p className="text-xs text-slate-600 mt-0.5">
          Review personal billing items, real-time clearing statuses, and processed transaction receipt hashes.
        </p>
      </div>

      {/* Primary List Array */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-slate-400 italic text-xs">
            Loading personal billing ledgers...
          </div>
        ) : fees.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
            No fee outstandings found for your profile. All clearing parameters are fully optimized.
          </div>
        ) : (
          fees.map((fee) => (
            <div 
              key={fee._id} 
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4"
            >
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
                    <CreditCard className="h-5 w-5" />
                  </div>

                  <div>
                    <div className="text-sm font-bold text-slate-900">
                      {fee.feeType}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {fee.billingPeriod}
                    </div>
                  </div>
                </div>

                <div className="text-right self-stretch sm:self-auto">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase font-bold border ${getStatusColor(fee.status)}`}>
                    {fee.status}
                  </span>
                </div>
              </div>

              {/* Amounts & Timelines */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 block uppercase">Total Billed</span>
                  <span className="text-base font-extrabold text-slate-900 font-mono">
                    ₹{fee.amount?.toLocaleString()}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 block uppercase">Amount Cleared</span>
                  <span className="text-base font-extrabold text-emerald-600 font-mono">
                    ₹{(fee.paidAmount || 0).toLocaleString()}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 block uppercase">Clearing Deadline</span>
                  <span className="text-xs font-bold text-slate-800 flex items-center space-x-1 mt-1">
                    <Clock className="h-3 w-3 text-slate-400 shrink-0" />
                    <span>{new Date(fee.dueDate).toLocaleDateString()}</span>
                  </span>
                </div>

              </div>

              {/* Reconcile Trace Footer */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
                {fee.status === 'Paid' ? (
                  <>
                    <div className="flex items-center space-x-1.5 text-emerald-700 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Remittance verified and credited</span>
                    </div>

                    {fee.transactionId && (
                      <span className="font-mono text-[10px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded border">
                        TXN: {fee.transactionId}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-1.5 text-amber-700 font-medium">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>Outstanding balance: <strong>₹{(fee.amount - (fee.paidAmount || 0)).toLocaleString()}</strong></span>
                    </div>

                    <span className="text-[10px] text-slate-400">
                      Coordinate with accounting officers for receipt generation.
                    </span>
                  </>
                )}
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
