import axios from 'axios';
import { Role } from '../types/architecture';

// Configure Axios client
export const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('smart_hostel_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fallback Mock State Storage for 100% preview reliability
export interface MockUser {
  _id: string;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
  phone: string;
  status: string;
}

// Initialize baseline localStorage mock data if empty
const initializeMockStorage = () => {
  if (!localStorage.getItem('mock_students')) {
    localStorage.setItem('mock_students', JSON.stringify([
      {
        _id: 'stu_1',
        enrollmentNumber: 'CS2026001',
        course: 'B.Tech Computer Science',
        gender: 'Male',
        dateOfBirth: '2006-05-14',
        user: { _id: 'u_1', firstName: 'Arjun', lastName: 'Mehta', email: 'arjun@hostel.edu', phone: '+919876543210', status: 'Active', role: 'Student' },
        address: { street: '42 Tech Park Road', city: 'Bangalore', state: 'Karnataka', zipCode: '560001' },
        guardian: { name: 'Rajesh Mehta', relation: 'Father', phone: '+919876543211' },
        currentRoom: { _id: 'rm_1', roomNumber: '101A', hostelBlock: 'Block A - Boys', floorNumber: 1, type: 'Double', status: 'Full' }
      },
      {
        _id: 'stu_2',
        enrollmentNumber: 'CS2026002',
        course: 'B.Tech Information Tech',
        gender: 'Female',
        dateOfBirth: '2006-08-20',
        user: { _id: 'u_2', firstName: 'Priya', lastName: 'Sharma', email: 'priya@hostel.edu', phone: '+919876543220', status: 'Active', role: 'Student' },
        address: { street: '12 Rose Gardens', city: 'Mumbai', state: 'Maharashtra', zipCode: '400001' },
        guardian: { name: 'Sunita Sharma', relation: 'Mother', phone: '+919876543221' },
        currentRoom: { _id: 'rm_2', roomNumber: '204B', hostelBlock: 'Block B - Girls', floorNumber: 2, type: 'Double', status: 'Available' }
      }
    ]));
  }

  if (!localStorage.getItem('mock_rooms')) {
    localStorage.setItem('mock_rooms', JSON.stringify([
      { _id: 'rm_1', roomNumber: '101A', hostelBlock: 'Block A - Boys', floorNumber: 1, capacity: 2, currentOccupancy: 2, type: 'Double', facilities: ['Attached Bath', 'Balcony'], status: 'Full' },
      { _id: 'rm_2', roomNumber: '204B', hostelBlock: 'Block B - Girls', floorNumber: 2, capacity: 2, currentOccupancy: 1, type: 'Double', facilities: ['AC', 'Geyser'], status: 'Available' },
      { _id: 'rm_3', roomNumber: '103A', hostelBlock: 'Block A - Boys', floorNumber: 1, capacity: 1, currentOccupancy: 0, type: 'Single', facilities: ['High-Speed Wi-Fi'], status: 'Available' },
      { _id: 'rm_4', roomNumber: '301C', hostelBlock: 'Block C - Dorm', floorNumber: 3, capacity: 4, currentOccupancy: 3, type: 'Dormitory', facilities: ['Common Hall'], status: 'Available' },
      { _id: 'rm_5', roomNumber: '105A', hostelBlock: 'Block A - Boys', floorNumber: 1, capacity: 2, currentOccupancy: 0, type: 'Double', facilities: [], status: 'Maintenance' }
    ]));
  }

  if (!localStorage.getItem('mock_complaints')) {
    localStorage.setItem('mock_complaints', JSON.stringify([
      {
        _id: 'cmp_1',
        student: { _id: 'stu_1', enrollmentNumber: 'CS2026001', user: { firstName: 'Arjun', lastName: 'Mehta', phone: '+919876543210' } },
        room: { _id: 'rm_1', roomNumber: '101A', hostelBlock: 'Block A - Boys' },
        category: 'Electrical',
        title: 'Ceiling Fan Regulator Defective',
        description: 'Fan spins only at maximum speed. Sparks observed when switching on.',
        priority: 'High',
        status: 'Pending',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        comments: []
      },
      {
        _id: 'cmp_2',
        student: { _id: 'stu_2', enrollmentNumber: 'CS2026002', user: { firstName: 'Priya', lastName: 'Sharma', phone: '+919876543220' } },
        room: { _id: 'rm_2', roomNumber: '204B', hostelBlock: 'Block B - Girls' },
        category: 'Plumbing',
        title: 'Washbasin Tap Leaking',
        description: 'Continuous dripping causing wastage and noise.',
        priority: 'Medium',
        status: 'In-Progress',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        assignedWarden: { firstName: 'Warden', lastName: 'Block B' },
        comments: [{ postedBy: 'Warden', message: 'Plumber notified. Inspecting today.', postedAt: new Date().toISOString() }]
      }
    ]));
  }

  if (!localStorage.getItem('mock_visitors')) {
    localStorage.setItem('mock_visitors', JSON.stringify([
      {
        _id: 'vis_1',
        visitorName: 'Rajesh Mehta',
        phone: '+919876543211',
        idProofType: 'National ID',
        idProofNumber: 'UID-9876-5432',
        relationToStudent: 'Father',
        studentToVisit: { _id: 'stu_1', enrollmentNumber: 'CS2026001', currentRoom: { roomNumber: '101A' }, user: { firstName: 'Arjun', lastName: 'Mehta', phone: '+919876543210' } },
        checkInTime: new Date(Date.now() - 7200000).toISOString(),
        checkOutTime: null,
        status: 'Checked-In',
        approvedBy: { firstName: 'Gate', lastName: 'Warden' }
      }
    ]));
  }

  if (!localStorage.getItem('mock_fees')) {
    localStorage.setItem('mock_fees', JSON.stringify([
      {
        _id: 'fee_1',
        student: { _id: 'stu_1', enrollmentNumber: 'CS2026001', currentRoom: { roomNumber: '101A' }, user: { firstName: 'Arjun', lastName: 'Mehta', email: 'arjun@hostel.edu', phone: '+919876543210' } },
        feeType: 'Room Rent',
        amount: 15000,
        dueDate: new Date(Date.now() + 86400000 * 15).toISOString(),
        status: 'Pending',
        paidAmount: 0,
        billingPeriod: 'Spring Semester 2026'
      },
      {
        _id: 'fee_2',
        student: { _id: 'stu_1', enrollmentNumber: 'CS2026001', currentRoom: { roomNumber: '101A' }, user: { firstName: 'Arjun', lastName: 'Mehta', email: 'arjun@hostel.edu', phone: '+919876543210' } },
        feeType: 'Mess Fee',
        amount: 12000,
        dueDate: new Date(Date.now() - 86400000 * 5).toISOString(),
        status: 'Paid',
        paidAmount: 12000,
        paymentDate: new Date(Date.now() - 86400000 * 10).toISOString(),
        transactionId: 'TXN987654321',
        billingPeriod: 'Spring Semester 2026'
      },
      {
        _id: 'fee_3',
        student: { _id: 'stu_2', enrollmentNumber: 'CS2026002', currentRoom: { roomNumber: '204B' }, user: { firstName: 'Priya', lastName: 'Sharma', email: 'priya@hostel.edu', phone: '+919876543220' } },
        feeType: 'Room Rent',
        amount: 15000,
        dueDate: new Date(Date.now() + 86400000 * 15).toISOString(),
        status: 'Pending',
        paidAmount: 0,
        billingPeriod: 'Spring Semester 2026'
      }
    ]));
  }
};

initializeMockStorage();

// Helper to safely execute calls with graceful live fallback
export const fetchWithFallback = async <T>(
  axiosCall: () => Promise<{ data: T }>,
  fallbackDataRetriever: () => T
): Promise<T> => {
  try {
    // Attempt real live server connection
    const response = await axiosCall();
    return response.data;
  } catch (error) {
    // Graceful fallback to client persistence
    console.warn('Backend server unreachable. Serving robust fallback state from local client storage.');
    return fallbackDataRetriever();
  }
};

// API Services Export Object
export const apiService = {
  
  // Dashboard Analytics
  getDashboardStats: () => {
    return fetchWithFallback(
      () => api.get('/dashboard/analytics'),
      () => {
        const rooms = JSON.parse(localStorage.getItem('mock_rooms') || '[]');
        const students = JSON.parse(localStorage.getItem('mock_students') || '[]');
        const complaints = JSON.parse(localStorage.getItem('mock_complaints') || '[]');
        const visitors = JSON.parse(localStorage.getItem('mock_visitors') || '[]');
        const fees = JSON.parse(localStorage.getItem('mock_fees') || '[]');

        const totalRooms = rooms.length;
        const totalBeds = rooms.reduce((acc: number, r: any) => acc + (r.capacity || 2), 0);
        const occupiedBeds = rooms.reduce((acc: number, r: any) => acc + (r.currentOccupancy || 0), 0);
        const availableRooms = rooms.filter((r: any) => r.status === 'Available').length;
        const fullRooms = rooms.filter((r: any) => r.status === 'Full').length;
        const maintenanceRooms = rooms.filter((r: any) => r.status === 'Maintenance').length;

        const totalBilled = fees.reduce((acc: number, f: any) => acc + f.amount, 0);
        const totalCollected = fees.reduce((acc: number, f: any) => acc + f.paidAmount, 0);

        return {
          status: 'success',
          data: {
            telemetry: {
              occupancy: {
                totalRooms,
                totalBeds,
                occupiedBeds,
                availableRooms,
                fullRooms,
                maintenanceRooms,
                occupancyRate: totalBeds ? Number(((occupiedBeds / totalBeds) * 100).toFixed(1)) : 0
              },
              residents: { totalActiveStudents: students.length },
              facilities: {
                pendingTickets: complaints.filter((c: any) => c.status === 'Pending').length,
                totalActiveTickets: complaints.filter((c: any) => c.status !== 'Resolved').length
              },
              security: {
                currentOnPremisesVisitors: visitors.filter((v: any) => v.status === 'Checked-In').length
              },
              finance: {
                totalBilledAmount: totalBilled,
                totalCollectedAmount: totalCollected,
                outstandingAmount: totalBilled - totalCollected,
                collectionRate: totalBilled ? Number(((totalCollected / totalBilled) * 100).toFixed(1)) : 0
              }
            },
            timestamp: new Date().toISOString()
          }
        };
      }
    );
  },

  // Students
  getStudents: (search?: string) => {
    return fetchWithFallback(
      () => api.get(`/students`, { params: { search } }),
      () => {
        let list = JSON.parse(localStorage.getItem('mock_students') || '[]');
        if (search) {
          const s = search.toLowerCase();
          list = list.filter((st: any) => 
            st.enrollmentNumber?.toLowerCase().includes(s) ||
            st.user?.firstName?.toLowerCase().includes(s) ||
            st.user?.lastName?.toLowerCase().includes(s) ||
            st.course?.toLowerCase().includes(s)
          );
        }
        return {
          status: 'success',
          results: list.length,
          data: { students: list }
        };
      }
    );
  },

  createStudent: (data: any) => {
    return fetchWithFallback(
      () => api.post('/students', data),
      () => {
        const list = JSON.parse(localStorage.getItem('mock_students') || '[]');
        const newStu = {
          _id: `stu_${Date.now()}`,
          enrollmentNumber: data.enrollmentNumber,
          course: data.course,
          gender: data.gender,
          dateOfBirth: data.dateOfBirth,
          user: {
            _id: `u_${Date.now()}`,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            status: 'Active',
            role: 'Student'
          },
          address: data.address,
          guardian: data.guardian,
          currentRoom: null
        };
        list.push(newStu);
        localStorage.setItem('mock_students', JSON.stringify(list));
        return { status: 'success', data: { student: newStu } };
      }
    );
  },

  deleteStudent: (id: string) => {
    return fetchWithFallback(
      () => api.delete(`/students/${id}`),
      () => {
        const list = JSON.parse(localStorage.getItem('mock_students') || '[]');
        const updated = list.filter((s: any) => s._id !== id);
        localStorage.setItem('mock_students', JSON.stringify(updated));
        return { status: 'success', message: 'Student profile removed successfully.' };
      }
    );
  },

  // Rooms
  getRooms: (hostelBlock?: string, status?: string) => {
    return fetchWithFallback(
      () => api.get('/rooms', { params: { hostelBlock, status } }),
      () => {
        let list = JSON.parse(localStorage.getItem('mock_rooms') || '[]');
        if (hostelBlock) {
          list = list.filter((r: any) => r.hostelBlock?.toLowerCase().includes(hostelBlock.toLowerCase()));
        }
        if (status) {
          list = list.filter((r: any) => r.status === status);
        }
        return { status: 'success', results: list.length, data: { rooms: list } };
      }
    );
  },

  createRoom: (data: any) => {
    return fetchWithFallback(
      () => api.post('/rooms', data),
      () => {
        const list = JSON.parse(localStorage.getItem('mock_rooms') || '[]');
        const newRm = {
          _id: `rm_${Date.now()}`,
          roomNumber: data.roomNumber,
          hostelBlock: data.hostelBlock,
          floorNumber: Number(data.floorNumber),
          capacity: Number(data.capacity || 2),
          currentOccupancy: 0,
          type: data.type,
          facilities: data.facilities || [],
          status: 'Available'
        };
        list.push(newRm);
        localStorage.setItem('mock_rooms', JSON.stringify(list));
        return { status: 'success', data: { room: newRm } };
      }
    );
  },

  updateRoomStatus: (id: string, status: string) => {
    return fetchWithFallback(
      () => api.patch(`/rooms/${id}`, { status }),
      () => {
        const list = JSON.parse(localStorage.getItem('mock_rooms') || '[]');
        const updated = list.map((r: any) => r._id === id ? { ...r, status } : r);
        localStorage.setItem('mock_rooms', JSON.stringify(updated));
        return { status: 'success', data: { room: updated.find((r: any) => r._id === id) } };
      }
    );
  },

  // Allocations
  allocateRoom: (data: { studentId: string; roomId: string; bedIdentifier: string; expectedVacateDate: string }) => {
    return fetchWithFallback(
      () => api.post('/allocations', data),
      () => {
        // Update Room occupancy
        const rooms = JSON.parse(localStorage.getItem('mock_rooms') || '[]');
        const updatedRooms = rooms.map((r: any) => {
          if (r._id === data.roomId) {
            const occ = (r.currentOccupancy || 0) + 1;
            return { ...r, currentOccupancy: occ, status: occ >= r.capacity ? 'Full' : 'Available' };
          }
          return r;
        });
        localStorage.setItem('mock_rooms', JSON.stringify(updatedRooms));

        // Update Student currentRoom
        const targetRoom = updatedRooms.find((r: any) => r._id === data.roomId);
        const students = JSON.parse(localStorage.getItem('mock_students') || '[]');
        const updatedStudents = students.map((s: any) => {
          if (s._id === data.studentId) {
            return { ...s, currentRoom: targetRoom };
          }
          return s;
        });
        localStorage.setItem('mock_students', JSON.stringify(updatedStudents));

        return { status: 'success', message: 'Room allocated successfully.' };
      }
    );
  },

  // Complaints
  getComplaints: (status?: string) => {
    return fetchWithFallback(
      () => api.get('/complaints', { params: { status } }),
      () => {
        let list = JSON.parse(localStorage.getItem('mock_complaints') || '[]');
        if (status) {
          list = list.filter((c: any) => c.status === status);
        }
        return { status: 'success', results: list.length, data: { complaints: list } };
      }
    );
  },

  createComplaint: (data: { category: string; title: string; description: string; priority: string }, studentContext: any) => {
    return fetchWithFallback(
      () => api.post('/complaints', data),
      () => {
        const list = JSON.parse(localStorage.getItem('mock_complaints') || '[]');
        const newCmp = {
          _id: `cmp_${Date.now()}`,
          student: {
            _id: studentContext?._id || 'stu_1',
            enrollmentNumber: studentContext?.enrollmentNumber || 'CS2026001',
            user: { firstName: studentContext?.user?.firstName || 'Arjun', lastName: studentContext?.user?.lastName || 'Mehta' }
          },
          room: studentContext?.currentRoom || { _id: 'rm_1', roomNumber: '101A', hostelBlock: 'Block A - Boys' },
          category: data.category,
          title: data.title,
          description: data.description,
          priority: data.priority,
          status: 'Pending',
          createdAt: new Date().toISOString(),
          comments: []
        };
        list.unshift(newCmp);
        localStorage.setItem('mock_complaints', JSON.stringify(list));
        return { status: 'success', data: { complaint: newCmp } };
      }
    );
  },

  updateComplaintStatus: (id: string, status: string) => {
    return fetchWithFallback(
      () => api.patch(`/complaints/${id}`, { status }),
      () => {
        const list = JSON.parse(localStorage.getItem('mock_complaints') || '[]');
        const updated = list.map((c: any) => c._id === id ? { ...c, status } : c);
        localStorage.setItem('mock_complaints', JSON.stringify(updated));
        return { status: 'success', data: { complaint: updated.find((c: any) => c._id === id) } };
      }
    );
  },

  addComplaintComment: (id: string, message: string, authorName: string) => {
    return fetchWithFallback(
      () => api.post(`/complaints/${id}/comments`, { message }),
      () => {
        const list = JSON.parse(localStorage.getItem('mock_complaints') || '[]');
        const updated = list.map((c: any) => {
          if (c._id === id) {
            const comments = [...(c.comments || [])];
            comments.push({
              postedBy: authorName,
              message,
              postedAt: new Date().toISOString()
            });
            return { ...c, comments };
          }
          return c;
        });
        localStorage.setItem('mock_complaints', JSON.stringify(updated));
        return { status: 'success', data: { complaint: updated.find((c: any) => c._id === id) } };
      }
    );
  },

  // Visitors
  getVisitors: () => {
    return fetchWithFallback(
      () => api.get('/visitors'),
      () => {
        const list = JSON.parse(localStorage.getItem('mock_visitors') || '[]');
        return { status: 'success', results: list.length, data: { visitors: list } };
      }
    );
  },

  createVisitor: (data: any) => {
    return fetchWithFallback(
      () => api.post('/visitors', data),
      () => {
        const list = JSON.parse(localStorage.getItem('mock_visitors') || '[]');
        // Find target student
        const students = JSON.parse(localStorage.getItem('mock_students') || '[]');
        const targetStu = students.find((s: any) => s._id === data.studentToVisit);

        const newVis = {
          _id: `vis_${Date.now()}`,
          visitorName: data.visitorName,
          phone: data.phone,
          idProofType: data.idProofType,
          idProofNumber: data.idProofNumber,
          relationToStudent: data.relationToStudent,
          studentToVisit: targetStu || { _id: data.studentToVisit, enrollmentNumber: 'Target Student', currentRoom: { roomNumber: 'Gate' }, user: { firstName: 'Resident', lastName: '' } },
          checkInTime: new Date().toISOString(),
          checkOutTime: null,
          status: 'Checked-In',
          approvedBy: { firstName: 'Active', lastName: 'Warden' }
        };
        list.unshift(newVis);
        localStorage.setItem('mock_visitors', JSON.stringify(list));
        return { status: 'success', data: { visitor: newVis } };
      }
    );
  },

  checkoutVisitor: (id: string) => {
    return fetchWithFallback(
      () => api.post(`/visitors/${id}/checkout`),
      () => {
        const list = JSON.parse(localStorage.getItem('mock_visitors') || '[]');
        const updated = list.map((v: any) => v._id === id ? { ...v, status: 'Checked-Out', checkOutTime: new Date().toISOString() } : v);
        localStorage.setItem('mock_visitors', JSON.stringify(updated));
        return { status: 'success', data: { visitor: updated.find((v: any) => v._id === id) } };
      }
    );
  },

  // Fees
  getFees: () => {
    return fetchWithFallback(
      () => api.get('/fees'),
      () => {
        const list = JSON.parse(localStorage.getItem('mock_fees') || '[]');
        return { status: 'success', results: list.length, data: { fees: list } };
      }
    );
  },

  createFee: (data: any) => {
    return fetchWithFallback(
      () => api.post('/fees', data),
      () => {
        const list = JSON.parse(localStorage.getItem('mock_fees') || '[]');
        const students = JSON.parse(localStorage.getItem('mock_students') || '[]');
        const targetStu = students.find((s: any) => s._id === data.studentId);

        const newFee = {
          _id: `fee_${Date.now()}`,
          student: targetStu || { _id: data.studentId, enrollmentNumber: 'Assigned Student', user: { firstName: 'Resident', lastName: '' } },
          feeType: data.feeType,
          amount: Number(data.amount),
          dueDate: data.dueDate,
          status: 'Pending',
          paidAmount: 0,
          billingPeriod: data.billingPeriod
        };
        list.push(newFee);
        localStorage.setItem('mock_fees', JSON.stringify(list));
        return { status: 'success', data: { fee: newFee } };
      }
    );
  },

  processPayment: (id: string, paidAmount: number) => {
    return fetchWithFallback(
      () => api.post(`/fees/${id}/pay`, { paidAmount }),
      () => {
        const list = JSON.parse(localStorage.getItem('mock_fees') || '[]');
        const updated = list.map((f: any) => {
          if (f._id === id) {
            const currentPaid = (f.paidAmount || 0) + Number(paidAmount);
            const status = currentPaid >= f.amount ? 'Paid' : 'Partially Paid';
            return {
              ...f,
              paidAmount: currentPaid,
              status,
              paymentDate: status === 'Paid' ? new Date().toISOString() : f.paymentDate,
              transactionId: `TXN${Date.now()}`
            };
          }
          return f;
        });
        localStorage.setItem('mock_fees', JSON.stringify(updated));
        return { status: 'success', data: { fee: updated.find((f: any) => f._id === id) } };
      }
    );
  },

  // Auth Recovery
  forgotPassword: (email: string) => {
    return fetchWithFallback(
      () => api.post('/auth/forgot-password', { email }),
      () => {
        console.log(`[Mock Fallback] Password reset recovery requested for: ${email}`);
        return { status: 'success', message: 'If the email exists in our records, a password reset link has been dispatched.' };
      }
    );
  },

  resetPassword: (data: { id: string; token: string; newPassword: string }) => {
    return fetchWithFallback(
      () => api.post('/auth/reset-password', data),
      () => {
        console.log(`[Mock Fallback] Password modified successfully for user ID: ${data.id}`);
        return { status: 'success', message: 'Password has been reset successfully. You can now log in.' };
      }
    );
  },

  // Activity Logs & Audit Trail
  getActivityLogs: (params?: { module?: string; action?: string; search?: string; page?: number; limit?: number }) => {
    return fetchWithFallback(
      () => api.get('/audit-logs', { params }),
      () => {
        // Build mock audit logs dynamically
        const logs = [
          { _id: 'aud_1', user: { firstName: 'System', lastName: 'Admin', role: 'Admin' }, action: 'ROOM_ALLOCATED', module: 'Allocations', description: 'Assigned resident CS2026001 to Room 101A (Bed-1)', createdAt: new Date().toISOString() },
          { _id: 'aud_2', user: { firstName: 'Active', lastName: 'Warden', role: 'Warden' }, action: 'COMPLAINT_UPDATED', module: 'Complaints', description: 'Cycled ticket state to In-Progress', createdAt: new Date(Date.now() - 3600000).toISOString() },
          { _id: 'aud_3', user: { firstName: 'System', lastName: 'Admin', role: 'Admin' }, action: 'FEE_COLLECTED', module: 'Fees', description: 'Collected remittance of ₹12000 for Mess Fee', createdAt: new Date(Date.now() - 7200000).toISOString() },
          { _id: 'aud_4', user: { firstName: 'Active', lastName: 'Warden', role: 'Warden' }, action: 'VISITOR_CHECKED_IN', module: 'Visitors', description: 'Logged gate entry for visitor Rajesh Mehta', createdAt: new Date(Date.now() - 14400000).toISOString() },
          { _id: 'aud_5', user: { firstName: 'System', lastName: 'Admin', role: 'Admin' }, action: 'USER_REGISTERED', module: 'Auth', description: 'New user provisioned with role Student', createdAt: new Date(Date.now() - 86400000).toISOString() }
        ];

        let filtered = [...logs];
        if (params?.module) {
          filtered = filtered.filter(l => l.module === params.module);
        }
        if (params?.action) {
          filtered = filtered.filter(l => l.action === params.action);
        }
        if (params?.search) {
          const s = params.search.toLowerCase();
          filtered = filtered.filter(l => l.description.toLowerCase().includes(s));
        }

        return {
          status: 'success',
          results: filtered.length,
          pagination: { total: filtered.length, page: params?.page || 1, pages: 1, limit: params?.limit || 50 },
          data: { logs: filtered }
        };
      }
    );
  },

  // Reports
  exportCsvReport: async (type: 'occupancy' | 'complaints' | 'fees', filters?: any) => {
    try {
      const response = await api.get(`/reports/${type}/csv`, { params: filters, responseType: 'text' });
      return response.data;
    } catch (error) {
      console.warn(`[Mock Fallback] Generating client-side native CSV for report type: ${type}`);
      
      if (type === 'occupancy') {
        const rooms = JSON.parse(localStorage.getItem('mock_rooms') || '[]');
        const header = '"Hostel Block","Room Number","Floor Level","Room Type","Total Capacity","Current Occupancy","Operational Status"';
        const rows = rooms.map((r: any) => `"${r.hostelBlock}","${r.roomNumber}","${r.floorNumber}","${r.type}","${r.capacity}","${r.currentOccupancy}","${r.status}"`);
        return [header, ...rows].join('\n');
      } 
      else if (type === 'complaints') {
        const complaints = JSON.parse(localStorage.getItem('mock_complaints') || '[]');
        const header = '"Ticket ID","Originator Enrollment","Room Number","Defect Category","Incident Heading","Priority Urgency","Current Status"';
        const rows = complaints.map((c: any) => `"${c._id}","${c.student?.enrollmentNumber}","${c.room?.roomNumber}","${c.category}","${c.title}","${c.priority}","${c.status}"`);
        return [header, ...rows].join('\n');
      }
      else {
        const fees = JSON.parse(localStorage.getItem('mock_fees') || '[]');
        const header = '"Ledger ID","Student Enrollment","Fee Category","Billing Period","Total Billed Amount","Amount Cleared","Payment Status"';
        const rows = fees.map((f: any) => `"${f._id}","${f.student?.enrollmentNumber}","${f.feeType}","${f.billingPeriod}","${f.amount}","${f.paidAmount}","${f.status}"`);
        return [header, ...rows].join('\n');
      }
    }
  }
};
