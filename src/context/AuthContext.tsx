import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role } from '../types/architecture';
import { MockUser } from '../services/api';

interface AuthContextType {
  user: MockUser | null;
  studentContext: any | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string, simulatedRole?: Role) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MockUser | null>(() => {
    const saved = localStorage.getItem('smart_hostel_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('smart_hostel_token');
  });

  const [studentContext, setStudentContext] = useState<any | null>(() => {
    const saved = localStorage.getItem('smart_hostel_student_context');
    return saved ? JSON.parse(saved) : null;
  });

  // Sync state to LocalStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('smart_hostel_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('smart_hostel_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('smart_hostel_token', token);
    } else {
      localStorage.removeItem('smart_hostel_token');
    }
  }, [token]);

  useEffect(() => {
    if (studentContext) {
      localStorage.setItem('smart_hostel_student_context', JSON.stringify(studentContext));
    } else {
      localStorage.removeItem('smart_hostel_student_context');
    }
  }, [studentContext]);

  const login = async (email: string, _password?: string, simulatedRole?: Role) => {
    // Determine active role mapping
    let resolvedRole: Role = simulatedRole || 'Student';
    if (email.includes('admin')) resolvedRole = 'Admin';
    else if (email.includes('warden')) resolvedRole = 'Warden';

    const mockToken = `eyJhbGciOiJIUzI1Ni...${btoa(email).substring(0, 20)}`;

    const mockUser: MockUser = {
      _id: resolvedRole === 'Admin' ? 'admin_root' : resolvedRole === 'Warden' ? 'warden_block_a' : 'u_1',
      email,
      role: resolvedRole,
      firstName: resolvedRole === 'Admin' ? 'System' : resolvedRole === 'Warden' ? 'Active' : 'Arjun',
      lastName: resolvedRole === 'Admin' ? 'Administrator' : resolvedRole === 'Warden' ? 'Warden' : 'Mehta',
      phone: '+919876543210',
      status: 'Active'
    };

    setToken(mockToken);
    setUser(mockUser);

    // If Student, automatically populate active profile and room linkage
    if (resolvedRole === 'Student') {
      const students = JSON.parse(localStorage.getItem('mock_students') || '[]');
      // Default to the first student for seamless viewing
      const activeStu = students[0] || {
        _id: 'stu_1',
        enrollmentNumber: 'CS2026001',
        course: 'B.Tech Computer Science',
        gender: 'Male',
        user: mockUser,
        currentRoom: { roomNumber: '101A', hostelBlock: 'Block A - Boys', type: 'Double' }
      };
      setStudentContext(activeStu);
    } else {
      setStudentContext(null);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setStudentContext(null);
    localStorage.removeItem('smart_hostel_user');
    localStorage.removeItem('smart_hostel_token');
    localStorage.removeItem('smart_hostel_student_context');
  };

  return (
    <AuthContext.Provider value={{
      user,
      studentContext,
      token,
      isAuthenticated: !!user && !!token,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
