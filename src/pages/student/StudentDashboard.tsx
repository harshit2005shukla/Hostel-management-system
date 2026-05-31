import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Building2, 
  Bed, 
  MessageSquareWarning, 
  CreditCard, 
  User, 
  Phone,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentDashboard: React.FC = () => {
  const { user, studentContext } = useAuth();

  // Load personal data
  const fees = JSON.parse(localStorage.getItem('mock_fees') || '[]').filter((f: any) => f.student?._id === studentContext?._id || f.student?.enrollmentNumber === studentContext?.enrollmentNumber);
  const complaints = JSON.parse(localStorage.getItem('mock_complaints') || '[]').filter((c: any) => c.student?._id === studentContext?._id || c.student?.enrollmentNumber === studentContext?.enrollmentNumber);

  const outstandingFees = fees.filter((f: any) => f.status !== 'Paid').reduce((acc: number, f: any) => acc + (f.amount - (f.paidAmount || 0)), 0);
  const activeComplaints = complaints.filter((c: any) => c.status !== 'Resolved').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Profile Shell */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xl uppercase shadow-md shadow-indigo-600/20 shrink-0">
            {user?.firstName?.[0] || 'S'}{user?.lastName?.[0] || ''}
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {user?.firstName} {user?.lastName}
              </h1>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 font-mono font-bold px-2 py-0.2 rounded border border-indigo-100">
                {studentContext?.enrollmentNumber || 'CS2026001'}
              </span>
            </div>

            <div className="text-xs text-slate-500 mt-0.5 font-medium">
              {studentContext?.course || 'B.Tech Computer Science'}
            </div>
          </div>
        </div>

        <div className="bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200/80 text-right self-stretch sm:self-auto">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">
            Assigned Room Asset
          </span>
          <div className="text-sm font-bold text-indigo-700 font-mono inline-flex items-center space-x-1">
            <Building2 className="h-3.5 w-3.5" />
            <span>{studentContext?.currentRoom?.roomNumber || '101A'}</span>
            <span className="text-[10px] font-sans font-normal text-slate-500">
              ({studentContext?.currentRoom?.hostelBlock || 'Block A - Boys'})
            </span>
          </div>
        </div>
      </div>

      {/* Primary KPI Status Array */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Room Widget */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold font-mono uppercase tracking-wider">
              Lodging Status
            </span>
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Bed className="h-4 w-4" />
            </div>
          </div>

          <div>
            <div className="text-lg font-bold text-slate-900">
              {studentContext?.currentRoom ? `Room ${studentContext.currentRoom.roomNumber}` : 'Unassigned'}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {studentContext?.currentRoom ? `${studentContext.currentRoom.type} Room Type` : 'Awaiting administrative allocation'}
            </div>
          </div>

          <Link
            to="/student/room"
            className="text-[11px] text-indigo-600 hover:underline font-bold inline-flex items-center space-x-0.5 pt-1"
          >
            <span>Inspect Floor & Roommates</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Fees Widget */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold font-mono uppercase tracking-wider">
              Outstanding Bills
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CreditCard className="h-4 w-4" />
            </div>
          </div>

          <div>
            <div className={`text-xl font-extrabold font-mono ${outstandingFees > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              ₹{outstandingFees.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {outstandingFees > 0 ? 'Requires clearing before due date' : 'All billing periods settled'}
            </div>
          </div>

          <Link
            to="/student/fees"
            className="text-[11px] text-indigo-600 hover:underline font-bold inline-flex items-center space-x-0.5 pt-1"
          >
            <span>View Reconciled Receipts</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Tickets Widget */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold font-mono uppercase tracking-wider">
              Facility Filings
            </span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <MessageSquareWarning className="h-4 w-4" />
            </div>
          </div>

          <div>
            <div className="text-xl font-extrabold text-amber-600">
              {activeComplaints} Active
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {complaints.length} total historical filings
            </div>
          </div>

          <Link
            to="/student/complaints"
            className="text-[11px] text-indigo-600 hover:underline font-bold inline-flex items-center space-x-0.5 pt-1"
          >
            <span>File Service Request</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

      </div>

      {/* Emergency & Guardian References */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Registered Guardian & Medical Directives
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
              <User className="h-3.5 w-3.5 text-indigo-600" />
              <span>Primary Parent Contact</span>
            </div>

            <div className="text-xs text-slate-700 space-y-0.5">
              <div>Name: <strong className="text-slate-900">{studentContext?.guardian?.name || 'Rajesh Mehta'}</strong></div>
              <div>Relation: <span className="text-slate-600">{studentContext?.guardian?.relation || 'Father'}</span></div>
              <div className="flex items-center space-x-1 pt-0.5 text-slate-600 font-mono">
                <Phone className="h-3 w-3" />
                <span>{studentContext?.guardian?.phone || '+91 98765 43211'}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
              <span className="w-2 h-2 rounded-full bg-rose-600 inline-block" />
              <span>Emergency Health Records</span>
            </div>

            <div className="text-xs text-slate-700 space-y-1">
              <div>Blood Group: <strong className="text-rose-600 font-mono">{studentContext?.medicalInfo?.bloodGroup || 'B+'}</strong></div>
              <div>Known Allergies: <span className="text-slate-600">{studentContext?.medicalInfo?.allergies || 'None disclosed'}</span></div>
              <div className="text-[11px] text-slate-400 italic pt-0.5">
                Authorized for reference during medical emergencies.
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
