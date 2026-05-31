import React, { useState } from 'react';
import { 
  Bed, 
  MessageSquareWarning, 
  PlusCircle, 
  TrendingUp
} from 'lucide-react';
import { Role } from '../../types/architecture';

interface LivePrototypesProps {
  activeRole: Role;
}

interface SimRoom {
  id: string;
  roomNumber: string;
  type: string;
  capacity: number;
  occupancy: number;
  status: 'Available' | 'Full' | 'Maintenance';
  residents: string[];
}

interface SimComplaint {
  id: string;
  student: string;
  room: string;
  category: string;
  title: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Pending' | 'In-Progress' | 'Resolved';
  date: string;
}

export const LivePrototypesView: React.FC<LivePrototypesProps> = ({ activeRole }) => {
  const [activeProtoTab, setActiveProtoTab] = useState<'rooms' | 'dashboard' | 'complaints'>('rooms');
  
  // Simulated State for Room Allocations
  const [rooms, setRooms] = useState<SimRoom[]>([
    { id: 'r1', roomNumber: '101A', type: 'Double', capacity: 2, occupancy: 2, status: 'Full', residents: ['Arjun Mehta', 'Rahul Sharma'] },
    { id: 'r2', roomNumber: '102A', type: 'Double', capacity: 2, occupancy: 1, status: 'Available', residents: ['Vikram Singh'] },
    { id: 'r3', roomNumber: '103A', type: 'Single', capacity: 1, occupancy: 0, status: 'Available', residents: [] },
    { id: 'r4', roomNumber: '104A', type: 'Triple', capacity: 3, occupancy: 2, status: 'Available', residents: ['Amit Patel', 'Deepak Verma'] },
    { id: 'r5', roomNumber: '105A', type: 'Double', capacity: 2, occupancy: 0, status: 'Maintenance', residents: [] },
    { id: 'r6', roomNumber: '106A', type: 'Triple', capacity: 3, occupancy: 3, status: 'Full', residents: ['Suresh Rao', 'Manoj Kumar', 'Nitin Das'] },
  ]);

  const [selectedRoom, setSelectedRoom] = useState<SimRoom | null>(null);
  const [newResidentName, setNewResidentName] = useState<string>('');

  // Simulated State for Complaints
  const [complaints, setComplaints] = useState<SimComplaint[]>([
    { id: 'c1', student: 'Arjun Mehta', room: '101A', category: 'Electrical', title: 'Ceiling Fan Regulator Defective', priority: 'High', status: 'Pending', date: '2026-03-10' },
    { id: 'c2', student: 'Vikram Singh', room: '102A', category: 'Plumbing', title: 'Washbasin Tap Leaking Continuous', priority: 'Medium', status: 'In-Progress', date: '2026-03-09' },
    { id: 'c3', student: 'Amit Patel', room: '104A', category: 'Internet', title: 'Wi-Fi Router Signal Extremely Weak', priority: 'Low', status: 'Resolved', date: '2026-03-05' },
  ]);

  const [newComplaintTitle, setNewComplaintTitle] = useState<string>('');
  const [newComplaintCat, setNewComplaintCat] = useState<string>('Electrical');
  const [newComplaintPrio, setNewComplaintPrio] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');

  // Handle Bed Allocation
  const handleAllocate = (roomId: string) => {
    if (!newResidentName.trim()) return;
    
    setRooms(prev => prev.map(r => {
      if (r.id === roomId && r.occupancy < r.capacity) {
        const updatedOccupancy = r.occupancy + 1;
        return {
          ...r,
          occupancy: updatedOccupancy,
          status: updatedOccupancy === r.capacity ? 'Full' : 'Available',
          residents: [...r.residents, newResidentName.trim()]
        };
      }
      return r;
    }));

    setNewResidentName('');
    setSelectedRoom(null);
  };

  // Handle Vacate
  const handleVacate = (roomId: string, residentIdx: number) => {
    setRooms(prev => prev.map(r => {
      if (r.id === roomId) {
        const updatedResidents = r.residents.filter((_, idx) => idx !== residentIdx);
        const updatedOccupancy = updatedResidents.length;
        return {
          ...r,
          occupancy: updatedOccupancy,
          status: 'Available',
          residents: updatedResidents
        };
      }
      return r;
    }));
    
    // Refresh selected room if open
    setSelectedRoom(prev => {
      if (prev && prev.id === roomId) {
        const updatedResidents = prev.residents.filter((_, idx) => idx !== residentIdx);
        return { ...prev, occupancy: updatedResidents.length, status: 'Available', residents: updatedResidents };
      }
      return prev;
    });
  };

  // Handle File Complaint
  const handleFileComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComplaintTitle.trim()) return;

    const newComp: SimComplaint = {
      id: `c${Date.now()}`,
      student: 'Simulated Student',
      room: '103A',
      category: newComplaintCat,
      title: newComplaintTitle.trim(),
      priority: newComplaintPrio,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };

    setComplaints(prev => [newComp, ...prev]);
    setNewComplaintTitle('');
  };

  // Handle Update Complaint Status
  const handleUpdateStatus = (compId: string, newStatus: 'Pending' | 'In-Progress' | 'Resolved') => {
    setComplaints(prev => prev.map(c => c.id === compId ? { ...c, status: newStatus } : c));
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Available': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Full': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Maintenance': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getPrioBadge = (prio: string) => {
    switch(prio) {
      case 'Critical': return 'bg-rose-600 text-white';
      case 'High': return 'bg-rose-100 text-rose-800';
      case 'Medium': return 'bg-amber-100 text-amber-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Overview Block */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Live Architecture Functional Prototypes</h2>
          <p className="text-sm text-slate-600 mt-1">
            Test the designed architectural database transitions and role view states live in real-time.
          </p>
        </div>

        {/* Prototyping Tabs */}
        <div className="bg-slate-100 p-1 rounded-lg border border-slate-200 flex items-center space-x-1 shrink-0">
          <button
            onClick={() => setActiveProtoTab('rooms')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center space-x-1.5 ${
              activeProtoTab === 'rooms' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bed className="h-3.5 w-3.5" />
            <span>Room Allocation Map</span>
          </button>

          <button
            onClick={() => setActiveProtoTab('dashboard')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center space-x-1.5 ${
              activeProtoTab === 'dashboard' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Role Dashboards</span>
          </button>

          <button
            onClick={() => setActiveProtoTab('complaints')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center space-x-1.5 ${
              activeProtoTab === 'complaints' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquareWarning className="h-3.5 w-3.5" />
            <span>Ticketing Hub</span>
          </button>
        </div>
      </div>

      {/* Prototype 1: Interactive Room Allocation Floor Map */}
      {activeProtoTab === 'rooms' && (
        <div className="space-y-4">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <span className="text-slate-600">
              <strong>Floor Layout Simulator:</strong> Click on any room to assign simulated students directly. The capacity tracking logic immediately shifts states if the room bed cap is saturated.
            </span>

            <div className="flex items-center space-x-3 shrink-0 font-mono text-[11px]">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span>Available</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                <span>Full</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                <span>Maintenance</span>
              </span>
            </div>
          </div>

          {/* Grid visual array */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {rooms.map((room) => {
              const isSelected = selectedRoom?.id === room.id;
              
              return (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className={`
                    p-4 rounded-xl border text-left transition-all flex flex-col justify-between h-36 relative overflow-hidden
                    ${isSelected ? 'ring-2 ring-indigo-600 shadow-md' : 'hover:shadow-sm'}
                    ${room.status === 'Available' ? 'bg-white border-emerald-200' : room.status === 'Full' ? 'bg-rose-50/30 border-rose-200' : 'bg-amber-50/30 border-amber-200'}
                  `}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-mono font-bold text-sm text-slate-900">{room.roomNumber}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase border ${getStatusColor(room.status)}`}>
                      {room.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] text-slate-500 font-mono">{room.type} Room</div>
                    
                    {/* Visual Bed Slots */}
                    <div className="flex items-center space-x-1 pt-1">
                      {Array.from({ length: room.capacity }).map((_, bi) => (
                        <div 
                          key={bi} 
                          className={`w-3 h-4 rounded-xs ${bi < room.occupancy ? 'bg-indigo-600' : 'bg-slate-200'}`}
                          title={bi < room.occupancy ? 'Bed Occupied' : 'Bed Available'}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between w-full pt-2 border-t border-slate-100">
                    <span>Occupancy:</span>
                    <span className="font-bold text-slate-700">{room.occupancy} / {room.capacity}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Room Allocation Detail Inspector / Actions */}
          {selectedRoom ? (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Room Asset Settings</span>
                  <span className="text-sm font-bold text-indigo-600 font-mono">{selectedRoom.roomNumber}</span>
                </div>

                <button 
                  onClick={() => setSelectedRoom(null)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Close Settings
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Active Residents List */}
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Assigned Residents ({selectedRoom.residents.length})</span>
                  
                  <div className="space-y-1.5">
                    {selectedRoom.residents.map((res, ri) => (
                      <div key={ri} className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs">
                        <span className="font-medium text-slate-800">{res}</span>
                        
                        <button
                          onClick={() => handleVacate(selectedRoom.id, ri)}
                          className="text-[10px] text-rose-600 hover:text-rose-800 font-medium bg-rose-50 px-2 py-0.5 rounded border border-rose-100"
                        >
                          Vacate Bed
                        </button>
                      </div>
                    ))}

                    {selectedRoom.residents.length === 0 && (
                      <div className="text-xs text-slate-400 italic py-3 text-center bg-slate-50 rounded-lg border border-slate-200/60">
                        No residents currently allocated to this room.
                      </div>
                    )}
                  </div>
                </div>

                {/* Allocate New Resident Form */}
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Atomic Allocation Transaction</span>

                  {selectedRoom.status === 'Maintenance' ? (
                    <div className="text-xs text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
                      Room status is currently locked to <strong>Maintenance</strong>. Automatic bed assignments are completely prohibited by system validation rules.
                    </div>
                  ) : selectedRoom.occupancy >= selectedRoom.capacity ? (
                    <div className="text-xs text-rose-700 bg-rose-50 p-3 rounded-lg border border-rose-200">
                      Room capacity is completely **Saturated**. Vacate an active resident bed slot before processing new admissions.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <input
                        type="text"
                        value={newResidentName}
                        onChange={(e) => setNewResidentName(e.target.value)}
                        placeholder="Enter Student Candidate Name..."
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />

                      <button
                        onClick={() => handleAllocate(selectedRoom.id)}
                        disabled={!newResidentName.trim()}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center space-x-1"
                      >
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span>Confirm Bed Booking</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-xs text-slate-400">
              Click on any floor plan room asset above to inspect its resident configurations and trigger allocation mutations.
            </div>
          )}

        </div>
      )}

      {/* Prototype 2: Role Dashboards */}
      {activeProtoTab === 'dashboard' && (
        <div className="space-y-4">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600">
            <strong>Role-Based Access Dashboard Simulation:</strong> Observe how analytical counters and interface options morph dynamically when matching the active user role session.
          </div>

          {/* If Active Role is Universal or Admin */}
          {(activeRole === 'All' || activeRole === 'Admin') && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-rose-600 inline-block" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Admin Macro Command Center</span>
                </div>
                <span className="text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded font-mono">
                  Full Access
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                  <div className="text-[10px] text-slate-400 font-mono">TOTAL ROOMS</div>
                  <div className="text-lg font-bold text-slate-900">150</div>
                  <div className="text-[9px] text-emerald-600 font-mono">94.6% Saturated</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                  <div className="text-[10px] text-slate-400 font-mono">ACTIVE STUDENTS</div>
                  <div className="text-lg font-bold text-slate-900">328</div>
                  <div className="text-[9px] text-slate-500 font-mono">Across 3 Blocks</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                  <div className="text-[10px] text-slate-400 font-mono">PENDING TICKETS</div>
                  <div className="text-lg font-bold text-amber-600">8</div>
                  <div className="text-[9px] text-amber-700 font-mono">2 High Priority</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                  <div className="text-[10px] text-slate-400 font-mono">FEE COLLECTION</div>
                  <div className="text-lg font-bold text-emerald-600">$48.2k</div>
                  <div className="text-[9px] text-emerald-700 font-mono">88.5% Cleared</div>
                </div>
              </div>
            </div>
          )}

          {/* If Active Role is Universal or Warden */}
          {(activeRole === 'All' || activeRole === 'Warden') && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-amber-600 inline-block" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Warden Operations Telemetry</span>
                </div>
                <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-mono">
                  Block A Dedicated
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                  <div className="text-[10px] text-slate-400 font-mono">GATE SECURITY LOGS</div>
                  <div className="text-base font-bold text-slate-900">3 Visitors Active</div>
                  <div className="text-[10px] text-slate-500 font-sans">Awaiting checkout stamping</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                  <div className="text-[10px] text-slate-400 font-mono">BLOCK BED CAPACITY</div>
                  <div className="text-base font-bold text-slate-900">4 Free Slots</div>
                  <div className="text-[10px] text-indigo-600 font-sans">Ready for assignments</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                  <div className="text-[10px] text-slate-400 font-mono">MAINTENANCE ESCALATIONS</div>
                  <div className="text-base font-bold text-rose-600">1 Urgent Defect</div>
                  <div className="text-[10px] text-slate-500 font-sans">Room 101A Ceiling Fan</div>
                </div>
              </div>
            </div>
          )}

          {/* If Active Role is Universal or Student */}
          {(activeRole === 'All' || activeRole === 'Student') && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Student Self-Service View</span>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-mono">
                  Personal Scoped
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                  <div className="text-[10px] text-slate-400 font-mono">MY ROOM ASSIGNMENT</div>
                  <div className="text-base font-bold text-indigo-600 font-mono">101A (Bed-1)</div>
                  <div className="text-[10px] text-slate-500 font-sans">Block A - Boys</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                  <div className="text-[10px] text-slate-400 font-mono">OUTSTANDING BILLS</div>
                  <div className="text-base font-bold text-slate-900">$0.00</div>
                  <div className="text-[10px] text-emerald-600 font-sans">All ledger periods cleared</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                  <div className="text-[10px] text-slate-400 font-mono">ACTIVE TICKETS</div>
                  <div className="text-base font-bold text-amber-600">1 Filed</div>
                  <div className="text-[10px] text-slate-500 font-sans">Status: Pending Inspection</div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Prototype 3: Ticketing Hub */}
      {activeProtoTab === 'complaints' && (
        <div className="space-y-4">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600">
            <strong>Facility & Discipline Ticketing Engine:</strong> Students can file service requests below. Switch context to the Warden role to change ticket progression states directly.
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* File Form */}
            <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block font-mono">File New Request</span>

              <form onSubmit={handleFileComplaint} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-mono uppercase block">Defect Title</label>
                  <input
                    type="text"
                    value={newComplaintTitle}
                    onChange={(e) => setNewComplaintTitle(e.target.value)}
                    placeholder="e.g. Broken Table Leg"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-mono uppercase block">Infrastructure Category</label>
                  <select
                    value={newComplaintCat}
                    onChange={(e) => setNewComplaintCat(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Carpentry">Carpentry</option>
                    <option value="Cleanliness">Cleanliness</option>
                    <option value="Internet">Internet</option>
                    <option value="Discipline">Discipline</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-mono uppercase block">SLA Priority Urgency</label>
                  <select
                    value={newComplaintPrio}
                    onChange={(e: any) => setNewComplaintPrio(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={!newComplaintTitle.trim()}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-1.5 rounded-lg text-xs font-medium transition-all"
                >
                  Submit Ticket
                </button>
              </form>
            </div>

            {/* Tickets Array */}
            <div className="lg:col-span-8 space-y-2.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block font-mono">
                Active System Service Tickets ({complaints.length})
              </span>

              <div className="space-y-2">
                {complaints.map((comp) => (
                  <div key={comp.id} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                          Room {comp.room}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{comp.title}</span>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase font-bold ${getPrioBadge(comp.priority)}`}>
                          {comp.priority}
                        </span>

                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono border ${
                          comp.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : comp.status === 'In-Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {comp.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <div>
                        <span>Filed by: <strong>{comp.student}</strong></span>
                        <span className="mx-2">•</span>
                        <span>Cat: <strong>{comp.category}</strong></span>
                      </div>

                      {/* Warden Action Buttons */}
                      <div className="flex items-center space-x-1">
                        <span className="text-[10px] text-slate-400 mr-1">Warden Actions:</span>
                        
                        {comp.status !== 'Pending' && (
                          <button
                            onClick={() => handleUpdateStatus(comp.id, 'Pending')}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-[10px]"
                          >
                            Pending
                          </button>
                        )}

                        {comp.status !== 'In-Progress' && (
                          <button
                            onClick={() => handleUpdateStatus(comp.id, 'In-Progress')}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px]"
                          >
                            In-Progress
                          </button>
                        )}

                        {comp.status !== 'Resolved' && (
                          <button
                            onClick={() => handleUpdateStatus(comp.id, 'Resolved')}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded text-[10px]"
                          >
                            Resolved
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
