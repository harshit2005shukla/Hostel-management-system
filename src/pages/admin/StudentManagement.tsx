import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { 
  Users, 
  Search, 
  PlusCircle, 
  UserCheck, 
  Building2,
  Phone,
  Mail,
  X,
  Trash2
} from 'lucide-react';

export const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    enrollmentNumber: '',
    course: '',
    gender: 'Male',
    dateOfBirth: '',
    address: { street: '', city: '', state: '', zipCode: '' },
    guardian: { name: '', relation: '', phone: '' }
  });

  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await apiService.getStudents(searchTerm);
      setStudents(res.data.students || []);
    } catch (err) {
      console.error('Failed to query students', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [searchTerm]);

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate
    if (!formData.enrollmentNumber || !formData.firstName || !formData.email) {
      setError('Enrollment Number, First Name, and Email are mandatory.');
      return;
    }

    setSubmitting(true);
    try {
      await apiService.createStudent(formData);
      setIsModalOpen(false);
      // Reset
      setFormData({
        firstName: '', lastName: '', email: '', phone: '', password: '',
        enrollmentNumber: '', course: '', gender: 'Male', dateOfBirth: '',
        address: { street: '', city: '', state: '', zipCode: '' },
        guardian: { name: '', relation: '', phone: '' }
      });
      loadStudents();
    } catch (err: any) {
      setError(err.message || 'Onboarding failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteStudent = async (id: string, name: string) => {
    if (!window.confirm(`Are you absolutely certain you want to completely remove the profile for ${name}? This will vacate active room bindings instantly.`)) {
      return;
    }

    try {
      await apiService.deleteStudent(id);
      loadStudents();
    } catch (err: any) {
      alert('Deletion failed: ' + (err.message || 'Server error'));
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Student Management
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Centralized directory linking system credentials directly to academic profiles and guardianship arrays.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-xs"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Onboard Student</span>
        </button>
      </div>

      {/* Search & Results Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden space-y-4">
        
        {/* Search Header */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Enrollment ID, Name, Course..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="text-[11px] text-slate-500 font-mono self-end sm:self-auto">
            Showing <strong className="text-slate-900">{students.length}</strong> profiles
          </div>
        </div>

        {/* Dynamic Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Resident Profile</th>
                <th className="py-3 px-4">Academic Mapping</th>
                <th className="py-3 px-4">Room Allocation</th>
                <th className="py-3 px-4">Guardianship Info</th>
                <th className="py-3 px-4">System Access</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                    Loading student registries...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No student profiles match your search filters.
                  </td>
                </tr>
              ) : (
                students.map((stu) => (
                  <tr key={stu._id} className="hover:bg-slate-50/50 transition-colors">
                    
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                          {stu.user?.firstName?.[0] || 'S'}{stu.user?.lastName?.[0] || ''}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">
                            {stu.user?.firstName} {stu.user?.lastName}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            ID: {stu.enrollmentNumber}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 space-y-0.5">
                      <div className="font-bold text-slate-800">{stu.course}</div>
                      <div className="text-[10px] text-slate-500">Gender: {stu.gender}</div>
                    </td>

                    <td className="py-3 px-4">
                      {stu.currentRoom ? (
                        <div className="inline-flex items-center space-x-1 font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                          <Building2 className="h-3 w-3" />
                          <span>{stu.currentRoom.roomNumber}</span>
                          <span className="text-[9px] font-sans font-normal text-slate-500">
                            ({stu.currentRoom.hostelBlock})
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                          Unassigned
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 space-y-0.5">
                      <div className="font-medium text-slate-800">
                        {stu.guardian?.name} <span className="text-[10px] text-slate-400">({stu.guardian?.relation})</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono flex items-center space-x-1">
                        <Phone className="h-2.5 w-2.5" />
                        <span>{stu.guardian?.phone}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center justify-between space-x-2">
                        <div className="space-y-0.5">
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.2 rounded border border-emerald-100 inline-flex items-center space-x-1">
                            <UserCheck className="h-2.5 w-2.5" />
                            <span>{stu.user?.status || 'Active'}</span>
                          </span>
                          <div className="text-[9px] text-slate-400 font-mono">
                            {stu.user?.email}
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteStudent(stu._id, `${stu.user?.firstName || ''} ${stu.user?.lastName || ''}`.trim())}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors shrink-0"
                          title="Delete Student Profile"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Onboarding Dialog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-indigo-400" />
                <span className="text-xs font-bold uppercase tracking-wider font-mono">
                  Provision New Resident Profile
                </span>
              </div>

              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleCreateStudent} className="p-6 overflow-y-auto space-y-4 flex-1">
              
              {error && (
                <div className="bg-rose-50 border-l-4 border-rose-500 p-3 rounded text-xs text-rose-700">
                  {error}
                </div>
              )}

              {/* 1. Core Profile Details */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block border-b pb-1">
                  1. Academic Identification
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-700 block">Enrollment ID *</label>
                    <input
                      type="text"
                      required
                      value={formData.enrollmentNumber}
                      onChange={e => setFormData({...formData, enrollmentNumber: e.target.value})}
                      placeholder="CS2026005"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-700 block">Enrolled Course *</label>
                    <input
                      type="text"
                      required
                      value={formData.course}
                      onChange={e => setFormData({...formData, course: e.target.value})}
                      placeholder="B.Tech Computer Science"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-700 block">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={e => setFormData({...formData, gender: e.target.value})}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-700 block">Date of Birth</label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={e => setFormData({...formData, dateOfBirth: e.target.value})}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* 2. User Accounts */}
              <div className="space-y-3 pt-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block border-b pb-1">
                  2. Central Identity Login
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-700 block">First Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={e => setFormData({...formData, firstName: e.target.value})}
                      placeholder="First Name"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-700 block">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={e => setFormData({...formData, lastName: e.target.value})}
                      placeholder="Last Name"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-700 block">Email Address *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2 flex items-center text-slate-400">
                        <Mail className="h-3 w-3" />
                      </div>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        placeholder="student@smarthostel.edu"
                        className="w-full pl-6 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-700 block">Initial Password</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                      placeholder="••••••••"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 block">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center text-slate-400">
                      <Phone className="h-3 w-3" />
                    </div>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      placeholder="+91 98765 43210"
                      className="w-full pl-6 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

              </div>

              {/* 3. Address & Guardianship */}
              <div className="space-y-3 pt-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block border-b pb-1">
                  3. Permanent Address & Parent Guardianship
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-700 block">Guardian Legal Name</label>
                    <input
                      type="text"
                      value={formData.guardian.name}
                      onChange={e => setFormData({...formData, guardian: {...formData.guardian, name: e.target.value}})}
                      placeholder="Parent Name"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-700 block">Relationship</label>
                    <input
                      type="text"
                      value={formData.guardian.relation}
                      onChange={e => setFormData({...formData, guardian: {...formData.guardian, relation: e.target.value}})}
                      placeholder="Father / Mother"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 block">Guardian Phone</label>
                  <input
                    type="text"
                    value={formData.guardian.phone}
                    onChange={e => setFormData({...formData, guardian: {...formData.guardian, phone: e.target.value}})}
                    placeholder="+91 98765 43211"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 block">Street / City / State</label>
                  <input
                    type="text"
                    value={formData.address.street}
                    onChange={e => setFormData({...formData, address: {...formData.address, street: e.target.value, city: 'Metro', state: 'State', zipCode: '000000'}})}
                    placeholder="Complete Street Address"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs"
                >
                  {submitting ? 'Saving mapping...' : 'Confirm Student Onboarding'}
                </button>
              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};
