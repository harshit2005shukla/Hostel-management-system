import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Building2, 
  Bed, 
  Users, 
  CheckCircle2, 
  Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyRoom: React.FC = () => {
  const { studentContext } = useAuth();

  const room = studentContext?.currentRoom;

  // Find all students assigned to this same room to map roommate companions
  const allStudents = JSON.parse(localStorage.getItem('mock_students') || '[]');
  const roommates = room 
    ? allStudents.filter((s: any) => s.currentRoom?.roomNumber === room.roomNumber && s._id !== studentContext?._id)
    : [];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Assigned Lodging Asset
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Physical room inventory defining block locations, live bed saturation, and companion allocations.
          </p>
        </div>

        {room && (
          <span className="bg-emerald-50 text-emerald-700 text-xs font-bold font-mono px-3 py-1 rounded-lg border border-emerald-200 flex items-center space-x-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Active Binding</span>
          </span>
        )}
      </div>

      {room ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Asset View */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-xl">
                  <Bed className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-extrabold text-slate-900 font-mono">
                      {room.roomNumber}
                    </span>
                    <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold font-mono">
                      {room.type} Room
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 font-medium mt-0.5 flex items-center space-x-1">
                    <Building2 className="h-3.5 w-3.5 text-indigo-600" />
                    <span>{room.hostelBlock || 'Block A - Boys'}</span>
                  </div>
                </div>
              </div>

              <div className="text-right font-mono">
                <span className="text-[10px] text-slate-400 block uppercase">Floor Index</span>
                <span className="text-lg font-bold text-slate-800">{room.floorNumber || 1}</span>
              </div>
            </div>

            {/* Asset Capabilities */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Physical Inventory Tags
              </span>

              <div className="flex flex-wrap gap-2">
                {(room.facilities || ['Attached Bath', 'Balcony', 'High-Speed Wi-Fi', 'Study Table']).map((f: string, i: number) => (
                  <span 
                    key={i} 
                    className="bg-slate-50 text-slate-700 text-xs px-3 py-1.5 rounded-lg border border-slate-200/80 font-medium flex items-center space-x-1"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                    <span>{f}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Capacity Telemetry */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <Layers className="h-4 w-4 text-slate-400" />
                <span className="text-slate-600">Total Asset Beds:</span>
                <strong className="text-slate-900 font-mono">{room.capacity || 2} Slots</strong>
              </div>

              <div className="text-slate-600 font-mono">
                Status: <strong className="text-indigo-700">{room.status || 'Full'}</strong>
              </div>
            </div>

          </div>

          {/* Roommate Companions Panel */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-indigo-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Roommate Companions
              </h3>
            </div>

            <div className="space-y-3">
              {roommates.map((rm: any) => (
                <div key={rm._id} className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                    {rm.user?.firstName?.[0] || 'R'}{rm.user?.lastName?.[0] || ''}
                  </div>

                  <div className="text-xs">
                    <div className="font-bold text-slate-900">
                      {rm.user?.firstName} {rm.user?.lastName}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {rm.enrollmentNumber}
                    </div>
                  </div>
                </div>
              ))}

              {roommates.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-xs italic bg-slate-50 rounded-lg border border-slate-100">
                  No other companions currently registered inside this lodging asset.
                </div>
              )}
            </div>

            <div className="pt-2 border-t text-[11px] text-slate-400 leading-relaxed">
              Room changes or mutual swapping must be processed directly through the administrative Block Warden.
            </div>
          </div>

        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 text-center space-y-4 border border-slate-200">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Bed className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">No Room Allocated</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Your profile currently does not have an active lodging asset binding. Please coordinate with your admissions officer.
            </p>
          </div>
          <div>
            <Link 
              to="/student/complaints"
              className="text-xs bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors inline-block"
            >
              File Administrative Inquiry
            </Link>
          </div>
        </div>
      )}

    </div>
  );
};
