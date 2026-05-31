import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { 
  Bed, 
  PlusCircle, 
  Layers, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle,
  X,
  Users
} from 'lucide-react';

export const RoomManagement: React.FC = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [hostelBlock, setHostelBlock] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Creation Modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  
  // Selected Room for Atomic Allocation / Status Edit
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);
  const [allocationStudentId, setAllocationStudentId] = useState<string>('');
  const [allocationBedId, setAllocationBedId] = useState<string>('Bed-1');
  const [allocationStatusMsg, setAllocationStatusMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    roomNumber: '',
    hostelBlock: 'Block A - Boys',
    floorNumber: 1,
    capacity: 2,
    type: 'Double',
    facilities: 'Attached Bath, AC'
  });

  const loadRooms = async () => {
    setLoading(true);
    try {
      const res = await apiService.getRooms(hostelBlock, statusFilter);
      setRooms(res.data.rooms || []);
    } catch (err) {
      console.error('Failed to pull room inventory', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, [hostelBlock, statusFilter]);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const facilitiesArr = formData.facilities.split(',').map(f => f.trim()).filter(Boolean);
      await apiService.createRoom({
        ...formData,
        facilities: facilitiesArr
      });
      setIsModalOpen(false);
      setFormData({
        roomNumber: '', hostelBlock: 'Block A - Boys', floorNumber: 1,
        capacity: 2, type: 'Double', facilities: 'Attached Bath, AC'
      });
      loadRooms();
    } catch (err) {
      console.error('Provisioning failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (roomId: string, newStatus: string) => {
    try {
      await apiService.updateRoomStatus(roomId, newStatus);
      loadRooms();
      if (selectedRoom && selectedRoom._id === roomId) {
        setSelectedRoom({ ...selectedRoom, status: newStatus });
      }
    } catch (err) {
      console.error('Status patch failed', err);
    }
  };

  const handleAllocate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom || !allocationStudentId) return;

    setAllocationStatusMsg(null);
    try {
      await apiService.allocateRoom({
        studentId: allocationStudentId,
        roomId: selectedRoom._id,
        bedIdentifier: allocationBedId,
        expectedVacateDate: new Date(Date.now() + 86400000 * 365).toISOString().split('T')[0]
      });
      setAllocationStatusMsg('Atomic allocation transaction committed safely!');
      loadRooms();
      
      // Update local view count
      const updatedOcc = (selectedRoom.currentOccupancy || 0) + 1;
      setSelectedRoom({
        ...selectedRoom,
        currentOccupancy: updatedOcc,
        status: updatedOcc >= selectedRoom.capacity ? 'Full' : 'Available'
      });
      
      setTimeout(() => setAllocationStatusMsg(null), 3000);
    } catch (err: any) {
      setAllocationStatusMsg('Allocation failed: ' + (err.message || 'Capacity overflow'));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Full': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Maintenance': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Room Inventory Control
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Physical room inventory defining block locations, live bed saturation, and real-time operational status gating.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-xs"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Provision Room Asset</span>
        </button>
      </div>

      {/* Filter Options */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          
          <div className="flex items-center space-x-1.5">
            <Layers className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-xs font-bold text-slate-700">Block:</span>
            <select
              value={hostelBlock}
              onChange={(e) => setHostelBlock(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg text-xs px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Blocks</option>
              <option value="Block A">Block A - Boys</option>
              <option value="Block B">Block B - Girls</option>
              <option value="Block C">Block C - Dorm</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5">
            <Sliders className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-xs font-bold text-slate-700">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg text-xs px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Full">Full</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>

        </div>

        <div className="text-[11px] text-slate-500 font-mono">
          Inventory Matches: <strong className="text-slate-900">{rooms.length}</strong>
        </div>
      </div>

      {/* Primary Workspace Grid: Rooms + Active Settings Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Dynamic Floor Grid */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {loading ? (
              <div className="col-span-full text-center py-12 text-slate-400 italic text-xs">
                Querying room telemetry...
              </div>
            ) : rooms.length === 0 ? (
              <div className="col-span-full text-center py-12 text-slate-400 text-xs">
                No room assets match specified filters.
              </div>
            ) : (
              rooms.map((room) => {
                const isSelected = selectedRoom?._id === room._id;
                
                return (
                  <button
                    key={room._id}
                    onClick={() => {
                      setSelectedRoom(room);
                      setAllocationStatusMsg(null);
                    }}
                    className={`
                      p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between h-32 relative overflow-hidden
                      ${isSelected ? 'ring-2 ring-indigo-600 shadow-sm bg-white' : 'hover:shadow-xs bg-white'}
                      ${room.status === 'Available' ? 'border-emerald-200' : room.status === 'Full' ? 'bg-rose-50/20 border-rose-200' : 'bg-amber-50/20 border-amber-200'}
                    `}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-mono font-bold text-sm text-slate-900">
                        {room.roomNumber}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase font-bold border ${getStatusColor(room.status)}`}>
                        {room.status}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[10px] text-slate-500 font-mono">
                        {room.type} ({room.hostelBlock})
                      </div>

                      {/* Micro Bed Visualizer */}
                      <div className="flex items-center space-x-1 pt-0.5">
                        {Array.from({ length: room.capacity || 2 }).map((_, bi) => {
                          const isOccupied = bi < (room.currentOccupancy || 0);
                          return (
                            <div
                              key={bi}
                              className={`w-2.5 h-3.5 rounded-xs ${
                                isOccupied ? 'bg-indigo-600' : 'bg-slate-200'
                              }`}
                              title={isOccupied ? 'Bed Booked' : 'Bed Available'}
                            />
                          );
                        })}
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-400 flex items-center justify-between w-full pt-1.5 border-t border-slate-100">
                      <span>Occupancy:</span>
                      <strong className="text-slate-800">
                        {room.currentOccupancy || 0} / {room.capacity || 2}
                      </strong>
                    </div>

                  </button>
                );
              })
            )}
          </div>

        </div>

        {/* Right Side: Active Asset settings and Atomic Allocation interface */}
        <div className="lg:col-span-5">
          {selectedRoom ? (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4 sticky top-20 animate-fadeIn">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Bed className="h-4 w-4 text-indigo-600" />
                  <span className="text-xs font-bold uppercase tracking-wider font-mono">
                    Room {selectedRoom.roomNumber} Configurations
                  </span>
                </div>

                <button 
                  onClick={() => setSelectedRoom(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Status Toggles */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Operational Lock State
                </span>

                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => handleUpdateStatus(selectedRoom._id, 'Available')}
                    className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                      selectedRoom.status === 'Available' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Available
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(selectedRoom._id, 'Full')}
                    className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                      selectedRoom.status === 'Full' ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Full
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(selectedRoom._id, 'Maintenance')}
                    className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                      selectedRoom.status === 'Maintenance' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Maintenance
                  </button>
                </div>
              </div>

              {/* Asset Metrics Info */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Hostel Block:</span>
                  <strong className="text-slate-900">{selectedRoom.hostelBlock}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Floor Level:</span>
                  <strong className="text-slate-900 font-mono">{selectedRoom.floorNumber}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Asset Type:</span>
                  <strong className="text-slate-900 font-mono">{selectedRoom.type}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Facilities tags:</span>
                  <span className="text-slate-700 truncate max-w-xs">
                    {(selectedRoom.facilities || []).join(', ') || 'None configured'}
                  </span>
                </div>
              </div>

              {/* Atomic Allocation Controller */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center space-x-1.5">
                  <Users className="h-3.5 w-3.5 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Atomic Room Allocation Form
                  </span>
                </div>

                {allocationStatusMsg && (
                  <div className={`p-2 rounded text-[11px] font-mono ${
                    allocationStatusMsg.includes('safely') ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                  }`}>
                    {allocationStatusMsg}
                  </div>
                )}

                {selectedRoom.status === 'Maintenance' ? (
                  <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs text-amber-800 flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      Room status is locked under <strong>Maintenance</strong>. System validation rules prohibit automated bed mappings.
                    </span>
                  </div>
                ) : (selectedRoom.currentOccupancy || 0) >= selectedRoom.capacity ? (
                  <div className="bg-rose-50 p-3 rounded-lg border border-rose-200 text-xs text-rose-800 flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>
                      Room capacity is completely <strong>Saturated</strong>. Vacate an active resident prior to booking new slots.
                    </span>
                  </div>
                ) : (
                  <form onSubmit={handleAllocate} className="space-y-2.5">
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-700 block">
                        Candidate Student ID *
                      </label>
                      <input
                        type="text"
                        required
                        value={allocationStudentId}
                        onChange={(e) => setAllocationStudentId(e.target.value)}
                        placeholder="e.g. stu_1"
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                      <span className="text-[9px] text-slate-400">
                        Enter target student identifier to map directly to this bed asset.
                      </span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-700 block">
                        Target Bed Designator
                      </label>
                      <select
                        value={allocationBedId}
                        onChange={(e) => setAllocationBedId(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      >
                        {Array.from({ length: selectedRoom.capacity || 2 }).map((_, bi) => (
                          <option key={bi} value={`Bed-${bi + 1}`}>
                            Bed-{bi + 1} Slot
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-1"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Confirm Bed Booking</span>
                    </button>

                  </form>
                )}

              </div>

            </div>
          ) : (
            <div className="bg-slate-100 rounded-xl h-48 flex items-center justify-center text-slate-400 text-xs text-center p-4">
              Select any floor plan room asset from the left to read its capacity specifications and trigger allocation mutations.
            </div>
          )}
        </div>

      </div>

      {/* Room Provisioning Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full flex flex-col overflow-hidden">
            
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bed className="h-4 w-4 text-indigo-400" />
                <span className="text-xs font-bold uppercase tracking-wider font-mono">
                  Provision New Room Asset
                </span>
              </div>

              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="p-6 space-y-4">
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 block">Room Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.roomNumber}
                    onChange={e => setFormData({...formData, roomNumber: e.target.value})}
                    placeholder="e.g. 108A"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 block">Hostel Block *</label>
                  <select
                    value={formData.hostelBlock}
                    onChange={e => setFormData({...formData, hostelBlock: e.target.value})}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="Block A - Boys">Block A - Boys</option>
                    <option value="Block B - Girls">Block B - Girls</option>
                    <option value="Block C - Dorm">Block C - Dorm</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 block">Floor Index</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.floorNumber}
                    onChange={e => setFormData({...formData, floorNumber: Number(e.target.value)})}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 block">Capacity</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={formData.capacity}
                    onChange={e => setFormData({...formData, capacity: Number(e.target.value)})}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 block">Asset Type</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Triple">Triple</option>
                    <option value="Dormitory">Dormitory</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 block">Facilities Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.facilities}
                  onChange={e => setFormData({...formData, facilities: e.target.value})}
                  placeholder="Attached Bath, Geyser, Balcony"
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
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
                  {submitting ? 'Creating...' : 'Provision Asset'}
                </button>
              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};
