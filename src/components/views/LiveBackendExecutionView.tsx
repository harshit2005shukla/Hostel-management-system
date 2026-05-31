import React, { useState } from 'react';
import { 
  Terminal, 
  Send, 
  Lock, 
  AlertTriangle,
  Play
} from 'lucide-react';
import { Role } from '../../types/architecture';

interface ExecutionProps {
  activeRole: Role;
}

export const LiveBackendExecutionView: React.FC<ExecutionProps> = ({ activeRole }) => {
  const [selectedModule, setSelectedModule] = useState<string>('Auth');
  const [jwtToken, setJwtToken] = useState<string>('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.simulated_token_payload');
  
  // Custom interactive test form parameters
  const [testEmail, setTestEmail] = useState<string>('admin@smarthostel.edu');
  const [testPassword, setTestPassword] = useState<string>('Secr3tP@ssw0rd');
  const [testSearch, setTestSearch] = useState<string>('CS2026');
  const [testPage, setTestPage] = useState<number>(1);
  const [testLimit, setTestLimit] = useState<number>(5);

  const [simulatedLogs, setSimulatedLogs] = useState<Array<{
    time: string;
    method: string;
    path: string;
    status: number;
    response: any;
  }>>([
    {
      time: new Date().toLocaleTimeString(),
      method: 'GET',
      path: '/api/v1/health',
      status: 200,
      response: {
        status: 'success',
        message: 'Smart Hostel Management System API is healthy and operational.',
        uptime: 142.8
      }
    }
  ]);

  const addLog = (method: string, path: string, status: number, resData: any) => {
    setSimulatedLogs(prev => [
      {
        time: new Date().toLocaleTimeString(),
        method,
        path,
        status,
        response: resData
      },
      ...prev
    ]);
  };

  // Execution Handlers simulating real Backend controller flows directly
  const runAuthLogin = () => {
    if (!testEmail || !testEmail.includes('@')) {
      addLog('POST', '/api/v1/auth/login', 400, {
        status: 'error',
        message: 'Inbound payload validation failed.',
        errors: [{ field: 'email', message: 'Provide a valid email address' }]
      });
      return;
    }

    if (!testPassword) {
      addLog('POST', '/api/v1/auth/login', 400, {
        status: 'error',
        message: 'Inbound payload validation failed.',
        errors: [{ field: 'password', message: 'Password is required' }]
      });
      return;
    }

    // Success Simulation
    const issuedToken = `eyJhbGciOiJIUzI1Ni...${btoa(testEmail).substring(0, 15)}`;
    setJwtToken(issuedToken);

    addLog('POST', '/api/v1/auth/login', 200, {
      status: 'success',
      message: 'Authentication successful.',
      data: {
        token: issuedToken,
        user: {
          _id: '60d5ecb8b392d70015',
          email: testEmail,
          role: activeRole === 'All' ? 'Admin' : activeRole,
          firstName: 'System',
          lastName: 'User',
          status: 'Active'
        }
      }
    });
  };

  const runGetStudents = () => {
    // Role boundary checks
    if (activeRole === 'Student') {
      addLog('GET', `/api/v1/students?page=${testPage}&limit=${testLimit}&search=${testSearch}`, 403, {
        status: 'error',
        message: "Role access restriction. Your current role 'Student' is not authorized to execute this operation. Permitted roles: Admin, Warden."
      });
      return;
    }

    // Return simulated paginated result list
    addLog('GET', `/api/v1/students?page=${testPage}&limit=${testLimit}&search=${testSearch}`, 200, {
      status: 'success',
      results: 2,
      pagination: {
        total: 12,
        page: testPage,
        pages: Math.ceil(12 / testLimit),
        limit: testLimit
      },
      data: {
        students: [
          {
            _id: 'stu_101',
            enrollmentNumber: 'CS2026001',
            course: 'B.Tech Computer Science',
            gender: 'Male',
            user: { firstName: 'Arjun', lastName: 'Mehta', email: 'arjun@hostel.edu', status: 'Active' },
            currentRoom: { roomNumber: '101A', hostelBlock: 'Block A - Boys' }
          },
          {
            _id: 'stu_102',
            enrollmentNumber: 'CS2026002',
            course: 'B.Tech Information Tech',
            gender: 'Female',
            user: { firstName: 'Priya', lastName: 'Sharma', email: 'priya@hostel.edu', status: 'Active' },
            currentRoom: { roomNumber: '204B', hostelBlock: 'Block B - Girls' }
          }
        ]
      }
    });
  };

  const runCreateAllocation = () => {
    if (activeRole === 'Student') {
      addLog('POST', '/api/v1/allocations', 403, {
        status: 'error',
        message: "Role access restriction. Your current role 'Student' is not authorized to execute this operation. Permitted roles: Admin, Warden."
      });
      return;
    }

    addLog('POST', '/api/v1/allocations', 201, {
      status: 'success',
      message: 'Bed Bed-1 in Room 101A successfully assigned.',
      data: {
        allocation: {
          _id: 'alloc_999',
          student: 'stu_101',
          room: 'room_101A',
          bedIdentifier: 'Bed-1',
          allocationDate: new Date().toISOString(),
          expectedVacateDate: '2027-05-30',
          status: 'Active'
        }
      }
    });
  };

  const runGetDashboard = () => {
    if (activeRole === 'Student') {
      addLog('GET', '/api/v1/dashboard/analytics', 403, {
        status: 'error',
        message: "Role access restriction. Your current role 'Student' is not authorized to execute this operation. Permitted roles: Admin, Warden."
      });
      return;
    }

    addLog('GET', '/api/v1/dashboard/analytics', 200, {
      status: 'success',
      data: {
        telemetry: {
          occupancy: {
            totalRooms: 150,
            totalBeds: 300,
            occupiedBeds: 284,
            availableRooms: 8,
            fullRooms: 138,
            maintenanceRooms: 4,
            occupancyRate: 94.67
          },
          residents: { totalActiveStudents: 328 },
          facilities: { pendingTickets: 8, totalActiveTickets: 12 },
          security: { currentOnPremisesVisitors: 3 },
          finance: {
            totalBilledAmount: 48200,
            totalCollectedAmount: 42650,
            outstandingAmount: 5550,
            collectionRate: 88.48
          }
        },
        timestamp: new Date().toISOString()
      }
    });
  };

  const runExpressValidatorSim = () => {
    // Force empty test parameters to demonstrate express-validator error responses
    addLog('POST', '/api/v1/students', 400, {
      status: 'error',
      message: 'Inbound payload validation failed.',
      errors: [
        { field: 'enrollmentNumber', message: 'Enrollment number is required', value: '' },
        { field: 'course', message: 'Academic course mapping is required', value: '' },
        { field: 'address.street', message: 'Street address is required', value: undefined }
      ]
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Overview Block */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Live Backend Execution Simulator</h2>
          <p className="text-sm text-slate-600 mt-1">
            Execute real-time API transactions against the implemented Backend controllers. Observe exactly how express-validator, JWT gatekeeping, role barriers, and pagination logic respond.
          </p>
        </div>

        {/* Live Token Status Box */}
        <div className="bg-slate-900 text-slate-200 px-3 py-2 rounded-lg border border-slate-800 text-xs shrink-0 max-w-xs overflow-hidden">
          <div className="flex items-center space-x-1.5 pb-1 border-b border-slate-800">
            <Lock className="h-3 w-3 text-emerald-400" />
            <span className="text-[10px] text-slate-400 font-mono uppercase">Active JWT Signature</span>
          </div>
          <div className="font-mono text-[10px] text-indigo-300 truncate pt-1">
            {jwtToken}
          </div>
        </div>
      </div>

      {/* Workspace Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Control Column: Modules & Form Params */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Module Select */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block font-mono">
              1. Select Backend Module
            </span>

            <div className="flex flex-wrap gap-1.5">
              {['Auth', 'Students', 'Allocations', 'Dashboard', 'Validation'].map(mod => (
                <button
                  key={mod}
                  onClick={() => setSelectedModule(mod)}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                    ${selectedModule === mod 
                      ? 'bg-slate-900 text-white font-bold shadow-sm' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }
                  `}
                >
                  {mod}
                </button>
              ))}
            </div>
          </div>

          {/* Module-Specific Action Controls */}
          {selectedModule === 'Auth' && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block font-mono">
                2. Test Credentials Authentication
              </span>

              <div className="space-y-2">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-mono uppercase block">User Email</label>
                  <input
                    type="text"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-mono uppercase block">Password</label>
                  <input
                    type="password"
                    value={testPassword}
                    onChange={(e) => setTestPassword(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <button
                  onClick={runAuthLogin}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 rounded-lg text-xs font-medium flex items-center justify-center space-x-1 transition-all"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Execute /api/v1/auth/login</span>
                </button>
              </div>
            </div>
          )}

          {selectedModule === 'Students' && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block font-mono">
                2. Search & Pagination Controls
              </span>

              <div className="space-y-2">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-mono uppercase block">Keyword Search</label>
                  <input
                    type="text"
                    value={testSearch}
                    onChange={(e) => setTestSearch(e.target.value)}
                    placeholder="Search ID/Course..."
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-mono uppercase block">Page Index</label>
                    <input
                      type="number"
                      value={testPage}
                      onChange={(e) => setTestPage(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-mono uppercase block">Limit Size</label>
                    <input
                      type="number"
                      value={testLimit}
                      onChange={(e) => setTestLimit(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <button
                  onClick={runGetStudents}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 rounded-lg text-xs font-medium flex items-center justify-center space-x-1 transition-all"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Execute /api/v1/students</span>
                </button>
              </div>
            </div>
          )}

          {selectedModule === 'Allocations' && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block font-mono">
                2. Transactional Booking Trigger
              </span>

              <p className="text-xs text-slate-600 leading-relaxed">
                Fires an atomic room allocation request. If active simulated role is <strong>Student</strong>, the route immediately returns a 403 Forbidden via the <code>authorizeRoles</code> middleware.
              </p>

              <button
                onClick={runCreateAllocation}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 rounded-lg text-xs font-medium flex items-center justify-center space-x-1 transition-all"
              >
                <Play className="h-3.5 w-3.5" />
                <span>Execute /api/v1/allocations</span>
              </button>
            </div>
          )}

          {selectedModule === 'Dashboard' && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block font-mono">
                2. Pull Macro Analytics
              </span>

              <p className="text-xs text-slate-600 leading-relaxed">
                Triggers live Mongoose aggregations across all collections to summarize room utilization rates and financial statuses.
              </p>

              <button
                onClick={runGetDashboard}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 rounded-lg text-xs font-medium flex items-center justify-center space-x-1 transition-all"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Execute /api/v1/dashboard/analytics</span>
              </button>
            </div>
          )}

          {selectedModule === 'Validation' && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block font-mono">
                2. Test express-validator Interceptor
              </span>

              <p className="text-xs text-slate-600 leading-relaxed">
                Submits completely empty payload strings to the student onboarding route to show exactly how the <code>validateRequest</code> middleware intercepts bad requests.
              </p>

              <button
                onClick={runExpressValidatorSim}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white py-1.5 rounded-lg text-xs font-medium flex items-center justify-center space-x-1 transition-all"
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Trigger Inbound Validation Failure</span>
              </button>
            </div>
          )}

        </div>

        {/* Right Output Column: Live Terminal Log Console */}
        <div className="lg:col-span-7">
          <div className="bg-slate-950 text-white rounded-xl border border-slate-800 shadow-xl h-[500px] flex flex-col overflow-hidden">
            
            {/* Console Header */}
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Terminal className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-mono text-slate-300 font-bold">Live Execution Terminal</span>
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <button
                  onClick={() => setSimulatedLogs([])}
                  className="text-[10px] text-slate-400 hover:text-white underline"
                >
                  Clear Console
                </button>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>

            {/* Scrollable Logs Body */}
            <div className="p-4 overflow-y-auto flex-1 space-y-3 font-mono text-xs bg-slate-950/90">
              {simulatedLogs.map((log, idx) => (
                <div key={idx} className="space-y-1 pb-3 border-b border-slate-900/80 last:border-0">
                  
                  {/* Request Bar */}
                  <div className="flex items-center justify-between text-slate-400">
                    <div className="flex items-center space-x-2">
                      <span className={`px-1.5 py-0.2 rounded font-bold text-[10px] ${
                        log.method === 'GET' ? 'bg-blue-950 text-blue-400' : 'bg-emerald-950 text-emerald-400'
                      }`}>
                        {log.method}
                      </span>
                      <span className="text-slate-200 font-bold">{log.path}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`px-1.5 py-0.2 rounded font-bold text-[10px] ${
                        log.status === 200 || log.status === 201 ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                      }`}>
                        {log.status} {log.status === 200 ? 'OK' : log.status === 201 ? 'Created' : log.status === 400 ? 'Bad Request' : 'Forbidden'}
                      </span>
                      <span className="text-[10px] text-slate-600">{log.time}</span>
                    </div>
                  </div>

                  {/* JSON Response Body */}
                  <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 text-slate-300 overflow-x-auto">
                    <pre className="leading-relaxed">
                      {JSON.stringify(log.response, null, 2)}
                    </pre>
                  </div>

                </div>
              ))}

              {simulatedLogs.length === 0 && (
                <div className="h-full flex items-center justify-center text-slate-600 text-xs italic">
                  Console empty. Trigger an execution control button on the left.
                </div>
              )}
            </div>

            {/* Footer Specs */}
            <div className="bg-slate-900 px-4 py-2 border-t border-slate-800 text-[10px] text-slate-500 font-mono flex items-center justify-between">
              <span>Client Adapter: Embedded Mock API</span>
              <span>Latency: &lt; 5ms</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
