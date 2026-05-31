import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Role } from './types/architecture';

// Core Layouts
import { MainLayout } from './components/layout/MainLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Public Landing & Gateways
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';

// Admin Views
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AnalyticsDashboard } from './pages/admin/AnalyticsDashboard';
import { AuditTrailsPage } from './pages/admin/AuditTrailsPage';
import { ReportsStudioPage } from './pages/admin/ReportsStudioPage';
import { StudentManagement } from './pages/admin/StudentManagement';
import { RoomManagement } from './pages/admin/RoomManagement';
import { ComplaintsManagement } from './pages/admin/ComplaintsManagement';
import { VisitorsManagement } from './pages/admin/VisitorsManagement';
import { FeesManagement } from './pages/admin/FeesManagement';

// Warden Views
import { WardenDashboard } from './pages/warden/WardenDashboard';
import { WardenComplaints } from './pages/warden/WardenComplaints';
import { WardenVisitors } from './pages/warden/WardenVisitors';

// Student Views
import { StudentDashboard } from './pages/student/StudentDashboard';
import { MyRoom } from './pages/student/MyRoom';
import { MyComplaints } from './pages/student/MyComplaints';
import { FeeStatus } from './pages/student/FeeStatus';

// Legacy Task 1 & 2 Blueprint / Code Explorer Portals
import { Header as LegacyHeader } from './components/Header';
import { Sidebar as LegacySidebar, ActiveTab } from './components/Sidebar';
import { OverviewView } from './components/views/OverviewView';
import { FolderStructureView } from './components/views/FolderStructureView';
import { SystemArchitectureView } from './components/views/SystemArchitectureView';
import { DatabaseSchemasView } from './components/views/DatabaseSchemasView';
import { RelationshipsView } from './components/views/RelationshipsView';
import { ERDiagramView } from './components/views/ERDiagramView';
import { ApiEndpointsView } from './components/views/ApiEndpointsView';
import { FrontendArchitectureView } from './components/views/FrontendArchitectureView';
import { SecurityValidationView } from './components/views/SecurityValidationView';
import { LivePrototypesView } from './components/views/LivePrototypesView';
import { BackendSourceCodeView } from './components/views/BackendSourceCodeView';
import { LiveBackendExecutionView } from './components/views/LiveBackendExecutionView';

// Legacy Data Exporter Imports
import { 
  FOLDER_STRUCTURE, 
  SYSTEM_ARCHITECTURE_TEXT, 
  MONGODB_DESIGN_RATIONALE, 
  MONGOOSE_SCHEMAS, 
  COLLECTION_RELATIONSHIPS, 
  ER_DIAGRAM_TEXT, 
  API_ENDPOINTS, 
  FRONTEND_ROUTES, 
  COMPONENT_HIERARCHY, 
  STATE_MANAGEMENT_STRATEGY, 
  SECURITY_ARCHITECTURE, 
  VALIDATION_STRATEGY 
} from './data/architectureData';

// Wrapper for Legacy Blueprint Portal enabling direct cross-navigation
const LegacyArchitecturePortal: React.FC<{ initialTab?: ActiveTab }> = ({ initialTab = 'overview' }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>(initialTab);
  const [activeRole, setActiveRole] = useState<Role>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleExport = (format: 'json' | 'markdown') => {
    if (format === 'json') {
      const exportData = {
        meta: {
          project: "Smart Hostel Management System",
          version: "1.0.0-PRODUCTION",
          stack: "MERN Stack + TypeScript"
        },
        folderStructure: FOLDER_STRUCTURE,
        systemArchitecture: SYSTEM_ARCHITECTURE_TEXT,
        mongoDesignRationale: MONGODB_DESIGN_RATIONALE,
        mongooseSchemas: MONGOOSE_SCHEMAS,
        relationships: COLLECTION_RELATIONSHIPS,
        erDiagram: ER_DIAGRAM_TEXT,
        apiEndpoints: API_ENDPOINTS,
        frontendRoutes: FRONTEND_ROUTES,
        componentHierarchy: COMPONENT_HIERARCHY,
        stateManagement: STATE_MANAGEMENT_STRATEGY,
        securityArchitecture: SECURITY_ARCHITECTURE,
        validationStrategy: VALIDATION_STRATEGY
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "smart_hostel_architecture_blueprint.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast("Architecture Blueprint exported as JSON file successfully!");
    } else {
      let md = `# PRODUCTION SMART HOSTEL MANAGEMENT SYSTEM — SYSTEM ARCHITECTURE BLUEPRINT\n\n`;
      md += `> **Tech Stack:** MERN (MongoDB, Express.js, React 19, Node.js) with TypeScript\n\n`;
      md += `## 1. COMPLETE FOLDER STRUCTURE\n\`\`\`\n`;
      const printTree = (nodes: any[], depth = 0) => {
        let str = '';
        nodes.forEach(n => {
          str += '  '.repeat(depth) + (n.type === 'folder' ? '📁 ' : '📄 ') + n.name + ' — ' + n.description + '\n';
          if (n.children) str += printTree(n.children, depth + 1);
        });
        return str;
      };
      md += printTree(FOLDER_STRUCTURE);
      md += `\`\`\`\n\n`;

      md += `## 2. SYSTEM ARCHITECTURE DIAGRAM\n\`\`\`\n${SYSTEM_ARCHITECTURE_TEXT}\n\`\`\`\n\n`;
      
      const dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(md);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "smart_hostel_architecture_blueprint.md");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast("Architecture Blueprint exported as formatted Markdown file successfully!");
    }
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview': return <OverviewView />;
      case 'folder-structure': return <FolderStructureView />;
      case 'system-architecture': return <SystemArchitectureView />;
      case 'mongodb-design': return <DatabaseSchemasView searchTerm={searchTerm} />;
      case 'mongoose-schemas': return <DatabaseSchemasView searchTerm={searchTerm} />;
      case 'relationships': return <RelationshipsView />;
      case 'er-diagram': return <ERDiagramView />;
      case 'api-endpoints': return <ApiEndpointsView activeRole={activeRole} searchTerm={searchTerm} />;
      case 'frontend-pages': return <FrontendArchitectureView />;
      case 'component-hierarchy': return <FrontendArchitectureView />;
      case 'state-management': return <FrontendArchitectureView />;
      case 'security': return <SecurityValidationView />;
      case 'validation': return <SecurityValidationView />;
      case 'live-prototypes': return <LivePrototypesView activeRole={activeRole} />;
      case 'backend-source': return <BackendSourceCodeView />;
      case 'live-execution': return <LiveBackendExecutionView activeRole={activeRole} />;
      default: return <OverviewView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      
      {/* Supplemental Portal Exit Bar */}
      <div className="bg-slate-950 text-slate-300 px-4 py-2 text-xs flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500" />
          <span>Viewing Legacy Architectural & Code Explorer Portal</span>
        </div>
        <Link to="/" className="text-indigo-400 hover:text-indigo-300 font-bold underline">
          ← Return to Master Gateway
        </Link>
      </div>

      <LegacyHeader 
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onExport={handleExport}
      />

      <div className="flex-1 flex flex-col md:flex-row">
        <LegacySidebar 
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setIsSidebarOpen(false);
          }}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {searchTerm && (
            <div className="mb-4 bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-xs text-indigo-900 flex items-center justify-between">
              <div>
                <span>Active Search Filter: <strong>"{searchTerm}"</strong></span>
              </div>
              <button onClick={() => setSearchTerm('')} className="text-indigo-700 underline font-medium">
                Clear Search
              </button>
            </div>
          )}

          {renderActiveView()}
        </main>
      </div>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl text-xs z-50">
          {toastMessage}
        </div>
      )}

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          
          {/* Public Top-Level Landing */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth Hub */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Legacy Blueprint & Backend Code Explorer Hubs */}
          <Route path="/architecture" element={<LegacyArchitecturePortal initialTab="overview" />} />
          <Route path="/backend-code" element={<LegacyArchitecturePortal initialTab="backend-source" />} />
          <Route path="/live-execution" element={<LegacyArchitecturePortal initialTab="live-execution" />} />

          {/* Authenticated Workspace Frame */}
          <Route element={<MainLayout />}>
            
            {/* Admin Routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/analytics" 
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AnalyticsDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/reports" 
              element={
                <ProtectedRoute allowedRoles={['Admin', 'Warden']}>
                  <ReportsStudioPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/audit-trails" 
              element={
                <ProtectedRoute allowedRoles={['Admin', 'Warden']}>
                  <AuditTrailsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/students" 
              element={
                <ProtectedRoute allowedRoles={['Admin', 'Warden']}>
                  <StudentManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/rooms" 
              element={
                <ProtectedRoute allowedRoles={['Admin', 'Warden']}>
                  <RoomManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/complaints" 
              element={
                <ProtectedRoute allowedRoles={['Admin', 'Warden']}>
                  <ComplaintsManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/visitors" 
              element={
                <ProtectedRoute allowedRoles={['Admin', 'Warden']}>
                  <VisitorsManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/fees" 
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <FeesManagement />
                </ProtectedRoute>
              } 
            />

            {/* Warden Routes */}
            <Route 
              path="/warden/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['Warden', 'Admin']}>
                  <WardenDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/warden/reports" 
              element={
                <ProtectedRoute allowedRoles={['Warden', 'Admin']}>
                  <ReportsStudioPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/warden/audit-trails" 
              element={
                <ProtectedRoute allowedRoles={['Warden', 'Admin']}>
                  <AuditTrailsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/warden/complaints" 
              element={
                <ProtectedRoute allowedRoles={['Warden', 'Admin']}>
                  <WardenComplaints />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/warden/visitors" 
              element={
                <ProtectedRoute allowedRoles={['Warden', 'Admin']}>
                  <WardenVisitors />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/warden/rooms" 
              element={
                <ProtectedRoute allowedRoles={['Warden', 'Admin']}>
                  <RoomManagement />
                </ProtectedRoute>
              } 
            />

            {/* Student Routes */}
            <Route 
              path="/student/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['Student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/room" 
              element={
                <ProtectedRoute allowedRoles={['Student']}>
                  <MyRoom />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/complaints" 
              element={
                <ProtectedRoute allowedRoles={['Student']}>
                  <MyComplaints />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/fees" 
              element={
                <ProtectedRoute allowedRoles={['Student']}>
                  <FeeStatus />
                </ProtectedRoute>
              } 
            />

          </Route>

          {/* Catch unmatched routes cleanly */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
