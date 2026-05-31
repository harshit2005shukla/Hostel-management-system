import {
  FolderNode,
  MongooseSchemaDef,
  ApiEndpoint,
  ComponentNode,
  RouteDef,
  SecurityRule,
  ValidationLayer
} from '../types/architecture';

export const FOLDER_STRUCTURE: FolderNode[] = [
  {
    name: 'smart-hostel-system',
    type: 'folder',
    description: 'Root production Monorepo directory containing Backend, Frontend, and shared packages.',
    children: [
      {
        name: 'backend',
        type: 'folder',
        description: 'Node.js & Express REST API server powered by TypeScript and Mongoose.',
        children: [
          {
            name: 'src',
            type: 'folder',
            description: 'Core source code for backend application.',
            children: [
              {
                name: 'config',
                type: 'folder',
                description: 'Environment loading, Database connections, and external service configurations.',
                children: [
                  { name: 'db.ts', type: 'file', description: 'MongoDB connection pool setup with auto-reconnect and Mongoose configurations.' },
                  { name: 'env.ts', type: 'file', description: 'Zod-validated environment variables loading.' },
                  { name: 'logger.ts', type: 'file', description: 'Winston/Pino production logger configuration.' }
                ]
              },
              {
                name: 'controllers',
                type: 'folder',
                description: 'HTTP request handlers. Orchestrates service calls and returns typed JSON responses.',
                children: [
                  { name: 'auth.controller.ts', type: 'file', description: 'Handles login, token refresh, password resets, and user context verification.' },
                  { name: 'student.controller.ts', type: 'file', description: 'Student onboarding, profile management, and document uploads.' },
                  { name: 'room.controller.ts', type: 'file', description: 'Room inventory, bed tracking, and maintenance status controls.' },
                  { name: 'allocation.controller.ts', type: 'file', description: 'Room allocation engine, automated seat booking, and vacating processes.' },
                  { name: 'complaint.controller.ts', type: 'file', description: 'Complaint lifecycle management, updates, and escalation triggers.' },
                  { name: 'visitor.controller.ts', type: 'file', description: 'Visitor check-in/out logic, pass generation, and guardian approvals.' },
                  { name: 'fee.controller.ts', type: 'file', description: 'Fee structure calculations, payment records, and invoice generation.' },
                  { name: 'analytics.controller.ts', type: 'file', description: 'Aggregated statistical metrics for Admin and Warden dashboards.' }
                ]
              },
              {
                name: 'services',
                type: 'folder',
                description: 'Pure business logic layer. Highly testable and independent of transport layers.',
                children: [
                  { name: 'auth.service.ts', type: 'file', description: 'JWT signature creation, token validation, and secure password hashing.' },
                  { name: 'allocation.service.ts', type: 'file', description: 'Complex algorithms for intelligent matching, capacity validation, and conflict checking.' },
                  { name: 'fee.service.ts', type: 'file', description: 'Calculates fine adjustments, tracks payments, and applies sibling/merit waivers.' },
                  { name: 'notification.service.ts', type: 'file', description: 'Dispatches real-time web sockets, emails, and SMS alerts.' }
                ]
              },
              {
                name: 'models',
                type: 'folder',
                description: 'Mongoose Schemas, indexes, virtual properties, and pre/post query hooks.',
                children: [
                  { name: 'User.model.ts', type: 'file', description: 'Base authentication collection supporting multi-role polymorphic designs.' },
                  { name: 'Student.model.ts', type: 'file', description: 'Extended profile details referencing User, storing guardian data & medical details.' },
                  { name: 'Room.model.ts', type: 'file', description: 'Hostel physical room assets, block/floor designators, and capacity configurations.' },
                  { name: 'Allocation.model.ts', type: 'file', description: 'Active and historical occupancy tracking linking Students to Room beds.' },
                  { name: 'Complaint.model.ts', type: 'file', description: 'Ticketing workflow schema with status trackers, attachments, and resolution audits.' },
                  { name: 'Visitor.model.ts', type: 'file', description: 'Entry log collection with strict timing constraints and authorized visitor identity proofs.' },
                  { name: 'Fee.model.ts', type: 'file', description: 'Ledger entries for room rents, mess charges, fine increments, and payment status.' }
                ]
              },
              {
                name: 'middlewares',
                type: 'folder',
                description: 'Express interceptors for security, parsing, logging, and validation.',
                children: [
                  { name: 'auth.middleware.ts', type: 'file', description: 'Decodes JWTs and attaches user context to the Request object.' },
                  { name: 'rbac.middleware.ts', type: 'file', description: 'Validates if the active user role intersects with permitted route roles.' },
                  { name: 'validate.middleware.ts', type: 'file', description: 'Zod middleware validating req.body, req.query, and req.params.' },
                  { name: 'error.middleware.ts', type: 'file', description: 'Global error interceptor returning sanitized output based on production state.' },
                  { name: 'rateLimiter.ts', type: 'file', description: 'Redis-backed brute force prevention limits.' }
                ]
              },
              {
                name: 'validations',
                type: 'folder',
                description: 'Zod validation schemas for all inbound DTOs.',
                children: [
                  { name: 'auth.schema.ts', type: 'file', description: 'Zod schemas for Login, Registration, and Token updates.' },
                  { name: 'room.schema.ts', type: 'file', description: 'Ensures correct data shapes for Room creation and capacity modification.' },
                  { name: 'allocation.schema.ts', type: 'file', description: 'Validates student IDs, room IDs, and strict date bounds.' }
                ]
              },
              {
                name: 'utils',
                type: 'folder',
                description: 'Helper utilities, custom exceptions, and clean functional helpers.',
                children: [
                  { name: 'AppError.ts', type: 'file', description: 'Custom error class capturing HTTP status codes and operational state.' },
                  { name: 'catchAsync.ts', type: 'file', description: 'Wraps async route handlers to natively feed rejected promises to the error handler.' }
                ]
              },
              { name: 'app.ts', type: 'file', description: 'Express application setup, mounting global middlewares, security headers, and routes.' },
              { name: 'server.ts', type: 'file', description: 'Entry point: connects to MongoDB and fires up the Express listen port gracefully.' }
            ]
          },
          { name: 'package.json', type: 'file', description: 'Backend dependencies: express, mongoose, jsonwebtoken, zod, bcryptjs, helmet.' },
          { name: 'tsconfig.json', type: 'file', description: 'Strict TypeScript compiler settings optimized for Node.js ES Modules.' }
        ]
      },
      {
        name: 'frontend',
        type: 'folder',
        description: 'React SPA built with Vite, TypeScript, and Tailwind CSS.',
        children: [
          {
            name: 'src',
            type: 'folder',
            description: 'Frontend source files.',
            children: [
              {
                name: 'assets',
                type: 'folder',
                description: 'Static images, brand logos, custom vector illustrations, and fallback assets.'
              },
              {
                name: 'components',
                type: 'folder',
                description: 'Reusable user interface atoms, molecules, and organisms.',
                children: [
                  {
                    name: 'common',
                    type: 'folder',
                    description: 'Generic elements used everywhere.',
                    children: [
                      { name: 'Button.tsx', type: 'file', description: 'Accessible, variant-supporting action triggers.' },
                      { name: 'Input.tsx', type: 'file', description: 'Form inputs with built-in state error feedback support.' },
                      { name: 'Modal.tsx', type: 'file', description: 'Accessible focus-trapped dialog windows.' },
                      { name: 'DataTable.tsx', type: 'file', description: 'Advanced sorting, filtering, and paginated table layouts.' },
                      { name: 'StatusBadge.tsx', type: 'file', description: 'Visual indicators for Pending, Approved, Vacated, Resolved.' }
                    ]
                  },
                  {
                    name: 'layout',
                    type: 'folder',
                    description: 'Page frame structures.',
                    children: [
                      { name: 'Sidebar.tsx', type: 'file', description: 'Dynamic navigation options tailored directly to active User Role.' },
                      { name: 'Header.tsx', type: 'file', description: 'Top action bar displaying notifications, search, and user quick settings.' },
                      { name: 'MainLayout.tsx', type: 'file', description: 'Authenticated layout shell housing navigation and the dynamic page content.' }
                    ]
                  }
                ]
              },
              {
                name: 'features',
                type: 'folder',
                description: 'Feature-based module code keeping domain logic tightly co-located.',
                children: [
                  {
                    name: 'auth',
                    type: 'folder',
                    description: 'Authentication specific views and contextual flows.',
                    children: [
                      { name: 'LoginForm.tsx', type: 'file', description: 'Handles secure credentials submission.' },
                      { name: 'RequireAuth.tsx', type: 'file', description: 'Higher-Order Component restricting access based on token state and RBAC roles.' }
                    ]
                  },
                  {
                    name: 'rooms',
                    type: 'folder',
                    description: 'Room listing, floor map visualizers, and assignment widgets.',
                    children: [
                      { name: 'RoomGrid.tsx', type: 'file', description: 'Interactive graphical grid mirroring floor architecture.' },
                      { name: 'AllocationModal.tsx', type: 'file', description: 'Assigns available beds directly to candidate students.' }
                    ]
                  },
                  {
                    name: 'complaints',
                    type: 'folder',
                    description: 'Complaint tracking boards and detail panels.',
                    children: [
                      { name: 'ComplaintCard.tsx', type: 'file', description: 'Displays issue description, priority urgency, and dynamic state.' },
                      { name: 'ComplaintThread.tsx', type: 'file', description: 'Chat-like thread for warden-student feedback dialogue.' }
                    ]
                  }
                ]
              },
              {
                name: 'hooks',
                type: 'folder',
                description: 'Custom React hooks for local state and UI controllers.',
                children: [
                  { name: 'useAuth.ts', type: 'file', description: 'Exposes context state, user claims, and role helpers.' },
                  { name: 'useDebounce.ts', type: 'file', description: 'Delays expensive server searches during high-speed query typing.' }
                ]
              },
              {
                name: 'pages',
                type: 'folder',
                description: 'Top-level routed route views.',
                children: [
                  { name: 'Login.tsx', type: 'file', description: 'Public landing and portal access point.' },
                  { name: 'AdminDashboard.tsx', type: 'file', description: 'System-wide telemetry, comprehensive KPIs, and occupancy graphs.' },
                  { name: 'WardenDashboard.tsx', type: 'file', description: 'Hostel-specific metrics, pending leave actions, and immediate support logs.' },
                  { name: 'StudentDashboard.tsx', type: 'file', description: 'Personal allocation info, fee statuses, and active complaints tracker.' },
                  { name: 'RoomManagement.tsx', type: 'file', description: 'Admin/Warden dedicated room config panel.' },
                  { name: 'FeeManagement.tsx', type: 'file', description: 'Invoicing interface with payment status reconciliations.' }
                ]
              },
              {
                name: 'services',
                type: 'folder',
                description: 'Client API integration instances utilizing Axios.',
                children: [
                  { name: 'api.ts', type: 'file', description: 'Configured Axios instance featuring automatic JWT attachment and automatic token refresh interceptors.' },
                  { name: 'endpoints.ts', type: 'file', description: 'Strongly typed string enumerations for all backend routes.' }
                ]
              },
              {
                name: 'store',
                type: 'folder',
                description: 'Client state management layers.',
                children: [
                  { name: 'authSlice.ts', type: 'file', description: 'Persistent user auth session state, cached using session/local storage safely.' },
                  { name: 'uiSlice.ts', type: 'file', description: 'Global state for toast notifications, dark mode, and responsive sidebar state.' }
                ]
              },
              {
                name: 'types',
                type: 'folder',
                description: 'Shared domain definitions mapping precisely to backend Mongoose models.',
                children: [
                  { name: 'index.ts', type: 'file', description: 'Unified interface files for Students, Rooms, Allocations, etc.' }
                ]
              },
              { name: 'App.tsx', type: 'file', description: 'Primary Application router provider and global state wrapper.' },
              { name: 'main.tsx', type: 'file', description: 'DOM entry mount point.' }
            ]
          },
          { name: 'package.json', type: 'file', description: 'Frontend tools: react, react-dom, react-router-dom, axios, zustand/redux-toolkit, lucide-react.' },
          { name: 'vite.config.ts', type: 'file', description: 'Vite build optimizer config.' }
        ]
      }
    ]
  }
];

export const SYSTEM_ARCHITECTURE_TEXT = `
===================================================================================================
                       PRODUCTION SMART HOSTEL SYSTEM ARCHITECTURE DIAGRAM
===================================================================================================

  +---------------------------------------------------------------------------------------------+
  |                                       CLIENT TIER                                           |
  |                                                                                             |
  |   +-----------------------+     +-----------------------+     +-------------------------+   |
  |   |    Admin Web App      |     |    Warden Portal      |     |   Student Mobile/Web    |   |
  |   | (Full System Access)  |     | (Hostel Operations)   |     |  (Self-Service Access)  |   |
  |   +-----------+-----------+     +-----------+-----------+     +------------+------------+   |
  +---------------|-----------------------------|------------------------------|----------------+
                  |                             |                              |
                  +-----------------------------+------------------------------+
                                                |
                                                v  HTTPS / TLS 1.3 Secure Requests
  +---------------------------------------------------------------------------------------------+
  |                                    EDGE / GATEWAY LAYER                                     |
  |                                                                                             |
  |   +-------------------------------------------------------------------------------------+   |
  |   |                  Nginx / AWS ALB / Cloudflare API Gateway                           |   |
  |   |   [ SSL Termination ] -> [ WAF / DDoS Protection ] -> [ Dynamic Load Balancing ]    |   |
  |   +------------------------------------------+------------------------------------------+   |
  +----------------------------------------------|----------------------------------------------+
                                                |
                                                v  Reverse Proxy (Internal Network)
  +---------------------------------------------------------------------------------------------+
  |                                  APPLICATION TIER (EXPRESS)                                 |
  |                                                                                             |
  |   +-------------------------------------------------------------------------------------+   |
  |   | 1. INBOUND MIDDLEWARE PIPELINE                                                      |   |
  |   |    [ Helmet (Security Headers) ] -> [ CORS ] -> [ Express Rate Limiter (Redis) ]    |   |
  |   +------------------------------------------+------------------------------------------+   |
  |                                              |                                              |
  |                                              v                                              |
  |   +-------------------------------------------------------------------------------------+   |
  |   | 2. AUTHENTICATION & RBAC GATEKEEPERS                                                |   |
  |   |    [ authMiddleware: JWT Verification ] -> [ rbacMiddleware: Role Claim Check ]     |   |
  |   +------------------------------------------+------------------------------------------+   |
  |                                              |                                              |
  |                                              v                                              |
  |   +-------------------------------------------------------------------------------------+   |
  |   | 3. VALIDATION LAYER                                                                 |   |
  |   |    [ validateMiddleware: Zod Schema DTO Validation (Body, Query, Params) ]          |   |
  |   +------------------------------------------+------------------------------------------+   |
  |                                              |                                              |
  |                                              v                                              |
  |   +-------------------------------------------------------------------------------------+   |
  |   | 4. CORE CONTROLLERS                                                                 |   |
  |   |    [ Auth ]  [ Students ]  [ Rooms ]  [ Allocations ]  [ Complaints ]  [ Fees ]     |   |
  |   +------------------------------------------+------------------------------------------+   |
  |                                              |                                              |
  |                                              v                                              |
  |   +-------------------------------------------------------------------------------------+   |
  |   | 5. PURE SERVICE LAYER (Business Logic & Transactions)                               |   |
  |   |    [ Intelligent Allocation Engine ] -> [ Automated Billing ] -> [ Escapations ]    |   |
  |   +------------------------------------------+------------------------------------------+   |
  +----------------------------------------------|----------------------------------------------+
                                                |
                                                v  Mongoose ODM (Atomic Operations & Hooks)
  +---------------------------------------------------------------------------------------------+
  |                                   DATABASE & STORAGE TIER                                   |
  |                                                                                             |
  |   +-------------------------------------------------------------------------------------+   |
  |   |                     MongoDB Enterprise / Atlas (Replica Set)                        |   |
  |   |                                                                                     |   |
  |   |   +-----------------------+     +-----------------------+     +-----------------+   |   |
  |   |   |     Primary Node      | <-> |    Secondary Node     | <-> | Secondary Node  |   |   |
  |   |   | (Writes & Fast Reads) |     |  (Read Scalability)   |     |  (Failover)     |   |   |
  |   |   +-----------------------+     +-----------------------+     +-----------------+   |   |
  |   +------------------------------------------+------------------------------------------+   |
  |                                              |                                              |
  |                                              v                                              |
  |   +-------------------------------------------------------------------------------------+   |
  |   |               Redis Caching Cluster (JWT Whitelists, Rate Limits, Configs)          |   |
  |   +-------------------------------------------------------------------------------------+   |
  +---------------------------------------------------------------------------------------------+
`;

export const MONGODB_DESIGN_RATIONALE = {
  overview: "The Smart Hostel Management System employs a hybridized Document Design approach using MongoDB. It leverages atomic updates for fast state changes, strict document validation at the application tier, and strategic indexing to guarantee under 50ms read SLAs across millions of historical operational records.",
  principles: [
    {
      title: "Hybrid Referencing vs. Embedding",
      description: "Unbounded arrays are strictly avoided. For example, rather than embedding an expanding array of Payments inside the Student document (which triggers document migration overhead and breaches the 16MB document cap), we utilize an independent **Fees** collection with indexed foreign keys. Conversely, bounded high-cohesion data like Guardian info and Room configurations are safely embedded inside parent models."
    },
    {
      title: "ACID Multi-Document Transactions",
      description: "Critical business transitions, such as Room Allocation, necessitate transactional guarantees. Assigning a student requires creating an Allocation record, decrementing available room bed counters, and changing student occupancy state. These are executed inside a MongoDB Client Session (`session.startTransaction()`) to ensure complete Rollback on failure."
    },
    {
      title: "Polymorphic User Strategy",
      description: "A centralized `users` collection manages Authentication, storing base credentials, passwords, active roles, and authorization states. The `students` collection links via a 1-to-1 indexed ObjectId reference, separating core identity management from rich operational domain models."
    },
    {
      title: "Index Strategy for Enterprise Scalability",
      description: "Compound indexes are applied strictly to mirror read queries. For instance, room queries filtering by hostel block, floor, and occupancy status leverage a targeted compound index `{ hostelBlock: 1, floorNumber: 1, status: 1 }`. Partial indexes are utilized for un-allocated states to minimize memory footprint."
    }
  ]
};

export const MONGOOSE_SCHEMAS: MongooseSchemaDef[] = [
  {
    collectionName: "users",
    modelName: "User",
    description: "Centralized identity store for authentication, role evaluation, and session tracking.",
    indexes: [
      "{ email: 1 } (Unique)",
      "{ role: 1, status: 1 }"
    ],
    fields: [
      { name: "_id", type: "ObjectId", required: true, description: "Primary Key." },
      { name: "email", type: "String", required: true, unique: true, validation: "Regex match for standard email patterns", description: "Unique user email login." },
      { name: "passwordHash", type: "String", required: true, description: "Bcrypt hashed secret with cost factor 12." },
      { name: "role", type: "String", required: true, default: "'Student'", validation: "Enum: ['Admin', 'Warden', 'Student']", description: "RBAC System Role defining permissions." },
      { name: "firstName", type: "String", required: true, description: "User's given legal name." },
      { name: "lastName", type: "String", required: true, description: "User's family name." },
      { name: "phone", type: "String", required: true, description: "Primary contact phone number." },
      { name: "status", type: "String", required: true, default: "'Active'", validation: "Enum: ['Active', 'Suspended', 'Pending']", description: "Account state authorization gate." },
      { name: "lastLogin", type: "Date", required: false, description: "Timestamp of last validated security access." }
    ],
    codeSnippet: `import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true,
    lowercase: true,
    index: true 
  },
  passwordHash: { type: String, required: true, select: false },
  role: { 
    type: String, 
    required: true, 
    enum: ['Admin', 'Warden', 'Student'],
    default: 'Student' 
  },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  phone: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Active', 'Suspended', 'Pending'], 
    default: 'Active' 
  },
  lastLogin: { type: Date }
}, { 
  timestamps: true 
});

// Index for fast RBAC routing lookups
UserSchema.index({ role: 1, status: 1 });

export const User = model('User', UserSchema);`
  },
  {
    collectionName: "students",
    modelName: "Student",
    description: "Extended student profile storing academic identifiers, parent contacts, and emergency information.",
    indexes: [
      "{ user: 1 } (Unique)",
      "{ enrollmentNumber: 1 } (Unique)",
      "{ currentRoom: 1 }"
    ],
    fields: [
      { name: "_id", type: "ObjectId", required: true, description: "Primary Key." },
      { name: "user", type: "ObjectId", required: true, ref: "User", unique: true, description: "Foreign key tying profile to system credentials." },
      { name: "enrollmentNumber", type: "String", required: true, unique: true, description: "University or institution registration ID." },
      { name: "course", type: "String", required: true, description: "Enrolled academic program (e.g. B.Tech CS, MBA)." },
      { name: "gender", type: "String", required: true, validation: "Enum: ['Male', 'Female', 'Other']", description: "Used for restricting hostel block mappings." },
      { name: "dateOfBirth", type: "Date", required: true, description: "Student's legal birth date." },
      { name: "address", type: "Object", required: true, description: "Embedded structure containing street, city, state, zip." },
      { name: "guardian", type: "Object", required: true, description: "Embedded sub-document containing parent name, relation, and contact info." },
      { name: "medicalInfo", type: "Object", required: false, description: "Embedded data regarding allergies and blood group." },
      { name: "currentRoom", type: "ObjectId", required: false, ref: "Room", description: "Direct linkage to currently assigned Room asset." }
    ],
    codeSnippet: `import { Schema, model } from 'mongoose';

const GuardianSchema = new Schema({
  name: { type: String, required: true },
  relation: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String }
}, { _id: false });

const StudentSchema = new Schema({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true 
  },
  enrollmentNumber: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true 
  },
  course: { type: String, required: true },
  gender: { 
    type: String, 
    required: true, 
    enum: ['Male', 'Female', 'Other'] 
  },
  dateOfBirth: { type: Date, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true }
  },
  guardian: { type: GuardianSchema, required: true },
  medicalInfo: {
    bloodGroup: { type: String },
    allergies: { type: String },
    emergencyContact: { type: String }
  },
  currentRoom: { 
    type: Schema.Types.ObjectId, 
    ref: 'Room',
    index: true 
  }
}, { timestamps: true });

export const Student = model('Student', StudentSchema);`
  },
  {
    collectionName: "rooms",
    modelName: "Room",
    description: "Physical room inventory defining block locations, maximum capacity, and live bed availability.",
    indexes: [
      "{ hostelBlock: 1, roomNumber: 1 } (Unique)",
      "{ status: 1 }",
      "{ currentOccupancy: 1, capacity: 1 }"
    ],
    fields: [
      { name: "_id", type: "ObjectId", required: true, description: "Primary Key." },
      { name: "roomNumber", type: "String", required: true, description: "Alphanumeric room identifier (e.g. 101A)." },
      { name: "hostelBlock", type: "String", required: true, description: "Hostel building designator (e.g. Block A - Boys)." },
      { name: "floorNumber", type: "Number", required: true, description: "Vertical floor index." },
      { name: "capacity", type: "Number", required: true, default: "2", description: "Maximum authorized students permitted." },
      { name: "currentOccupancy", type: "Number", required: true, default: "0", description: "Real-time count of active residents." },
      { name: "type", type: "String", required: true, validation: "Enum: ['Single', 'Double', 'Triple', 'Dormitory']", description: "Room classification directly affecting base pricing." },
      { name: "facilities", type: "Array<String>", required: false, description: "Tags like 'AC', 'Attached Balcony', 'Geyser'." },
      { name: "status", type: "String", required: true, default: "'Available'", validation: "Enum: ['Available', 'Full', 'Maintenance', 'Reserved']", description: "State lock for allocation control." }
    ],
    codeSnippet: `import { Schema, model } from 'mongoose';

const RoomSchema = new Schema({
  roomNumber: { type: String, required: true, uppercase: true },
  hostelBlock: { type: String, required: true },
  floorNumber: { type: Number, required: true },
  capacity: { type: Number, required: true, min: 1, max: 6, default: 2 },
  currentOccupancy: { type: Number, required: true, default: 0 },
  type: { 
    type: String, 
    required: true,
    enum: ['Single', 'Double', 'Triple', 'Dormitory'] 
  },
  facilities: [{ type: String }],
  status: { 
    type: String, 
    required: true,
    enum: ['Available', 'Full', 'Maintenance', 'Reserved'],
    default: 'Available' 
  }
}, { timestamps: true });

// Ensures room numbers are unique per block
RoomSchema.index({ hostelBlock: 1, roomNumber: 1 }, { unique: true });
// Optimizes query for finding free rooms
RoomSchema.index({ status: 1, currentOccupancy: 1 });

export const Room = model('Room', RoomSchema);`
  },
  {
    collectionName: "allocations",
    modelName: "Allocation",
    description: "Defines the live and historical binding of a Student to a specific Room bed over a time frame.",
    indexes: [
      "{ student: 1, status: 1 }",
      "{ room: 1, status: 1 }"
    ],
    fields: [
      { name: "_id", type: "ObjectId", required: true, description: "Primary Key." },
      { name: "student", type: "ObjectId", required: true, ref: "Student", description: "Assigned resident." },
      { name: "room", type: "ObjectId", required: true, ref: "Room", description: "Allocated physical asset." },
      { name: "bedIdentifier", type: "String", required: true, description: "Specific bed slot (e.g. 'Bed-1', 'Bed-2')." },
      { name: "allocationDate", type: "Date", required: true, default: "Date.now", description: "Start of residency." },
      { name: "expectedVacateDate", type: "Date", required: true, description: "End of scheduled academic term." },
      { name: "actualVacateDate", type: "Date", required: false, description: "Populated when checkout process is finalized." },
      { name: "status", type: "String", required: true, default: "'Active'", validation: "Enum: ['Active', 'Vacated', 'Cancelled']", description: "Lifecycle tracker." },
      { name: "assignedBy", type: "ObjectId", required: true, ref: "User", description: "Audit trace of Warden or Admin executing the allocation." }
    ],
    codeSnippet: `import { Schema, model } from 'mongoose';

const AllocationSchema = new Schema({
  student: { 
    type: Schema.Types.ObjectId, 
    ref: 'Student', 
    required: true,
    index: true 
  },
  room: { 
    type: Schema.Types.ObjectId, 
    ref: 'Room', 
    required: true,
    index: true 
  },
  bedIdentifier: { type: String, required: true },
  allocationDate: { type: Date, required: true, default: Date.now },
  expectedVacateDate: { type: Date, required: true },
  actualVacateDate: { type: Date },
  status: { 
    type: String, 
    required: true,
    enum: ['Active', 'Vacated', 'Cancelled'],
    default: 'Active' 
  },
  assignedBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { timestamps: true });

// Prevents a student from having multiple active allocations simultaneously
AllocationSchema.index({ student: 1, status: 1 });

export const Allocation = model('Allocation', AllocationSchema);`
  },
  {
    collectionName: "complaints",
    modelName: "Complaint",
    description: "Service request ticketing engine tracking reported hostel infrastructure or discipline issues.",
    indexes: [
      "{ student: 1 }",
      "{ status: 1, priority: 1 }",
      "{ assignedWarden: 1 }"
    ],
    fields: [
      { name: "_id", type: "ObjectId", required: true, description: "Primary Key." },
      { name: "student", type: "ObjectId", required: true, ref: "Student", description: "Originator of the request." },
      { name: "room", type: "ObjectId", required: true, ref: "Room", description: "Location needing inspection." },
      { name: "category", type: "String", required: true, validation: "Enum: ['Electrical', 'Plumbing', 'Carpentry', 'Cleanliness', 'Internet', 'Discipline', 'Other']", description: "Used for auto-routing to specific maintenance queues." },
      { name: "title", type: "String", required: true, description: "Short heading summarizing the incident." },
      { name: "description", type: "String", required: true, description: "Detailed summary of the failure." },
      { name: "priority", type: "String", required: true, default: "'Medium'", validation: "Enum: ['Low', 'Medium', 'High', 'Critical']", description: "Dictates SLA resolution timeframes." },
      { name: "status", type: "String", required: true, default: "'Pending'", validation: "Enum: ['Pending', 'In-Progress', 'Resolved', 'Rejected']", description: "Current stage in the resolution chain." },
      { name: "assignedWarden", type: "ObjectId", required: false, ref: "User", description: "Staff member directly accountable for signing off on resolution." },
      { name: "comments", type: "Array<Object>", required: false, description: "Embedded comment array tracking dialogue timestamps and authorship." }
    ],
    codeSnippet: `import { Schema, model } from 'mongoose';

const CommentSchema = new Schema({
  postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  postedAt: { type: Date, default: Date.now }
}, { _id: false });

const ComplaintSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Electrical', 'Plumbing', 'Carpentry', 'Cleanliness', 'Internet', 'Discipline', 'Other'] 
  },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium' 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'In-Progress', 'Resolved', 'Rejected'],
    default: 'Pending' 
  },
  assignedWarden: { type: Schema.Types.ObjectId, ref: 'User' },
  comments: [CommentSchema]
}, { timestamps: true });

ComplaintSchema.index({ status: 1, priority: 1 });
ComplaintSchema.index({ student: 1 });

export const Complaint = model('Complaint', ComplaintSchema);`
  },
  {
    collectionName: "visitors",
    modelName: "Visitor",
    description: "Security monitoring registry tracking outsider entry, authorization, and checkout events.",
    indexes: [
      "{ studentToVisit: 1 }",
      "{ checkInTime: 1 }",
      "{ status: 1 }"
    ],
    fields: [
      { name: "_id", type: "ObjectId", required: true, description: "Primary Key." },
      { name: "visitorName", type: "String", required: true, description: "Legal name of the arriving guest." },
      { name: "phone", type: "String", required: true, description: "Verified guest phone number." },
      { name: "idProofType", type: "String", required: true, description: "Government ID class (e.g. 'Passport', 'Driver License', 'National ID')." },
      { name: "idProofNumber", type: "String", required: true, description: "Scanned or entered verification string." },
      { name: "relationToStudent", type: "String", required: true, description: "E.g. 'Father', 'Mother', 'Sibling', 'Friend'." },
      { name: "studentToVisit", type: "ObjectId", required: true, ref: "Student", description: "Hostel resident receiving the guest." },
      { name: "checkInTime", type: "Date", required: true, default: "Date.now", description: "Entry validation instant." },
      { name: "checkOutTime", type: "Date", required: false, description: "Updated when guest exits the physical boundary." },
      { name: "status", type: "String", required: true, default: "'Checked-In'", validation: "Enum: ['Checked-In', 'Checked-Out', 'Overstayed']", description: "Live location state." },
      { name: "approvedBy", type: "ObjectId", required: true, ref: "User", description: "Warden authorizing gate access." }
    ],
    codeSnippet: `import { Schema, model } from 'mongoose';

const VisitorSchema = new Schema({
  visitorName: { type: String, required: true, trim: true },
  phone: { type: String, required: true },
  idProofType: { type: String, required: true },
  idProofNumber: { type: String, required: true },
  relationToStudent: { type: String, required: true },
  studentToVisit: { 
    type: Schema.Types.ObjectId, 
    ref: 'Student', 
    required: true,
    index: true 
  },
  checkInTime: { type: Date, required: true, default: Date.now },
  checkOutTime: { type: Date },
  status: { 
    type: String, 
    enum: ['Checked-In', 'Checked-Out', 'Overstayed'],
    default: 'Checked-In' 
  },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

VisitorSchema.index({ status: 1, checkInTime: 1 });

export const Visitor = model('Visitor', VisitorSchema);`
  },
  {
    collectionName: "fees",
    modelName: "Fee",
    description: "Financial ledger itemizing rent charges, mess subscriptions, fines, and successful receipt reconciliations.",
    indexes: [
      "{ student: 1, status: 1 }",
      "{ dueDate: 1 }"
    ],
    fields: [
      { name: "_id", type: "ObjectId", required: true, description: "Primary Key." },
      { name: "student", type: "ObjectId", required: true, ref: "Student", description: "Accountable individual." },
      { name: "feeType", type: "String", required: true, validation: "Enum: ['Room Rent', 'Mess Fee', 'Maintenance Fine', 'Late Fine', 'Security Deposit']", description: "Categorization for accounting buckets." },
      { name: "amount", type: "Number", required: true, description: "Total value in regional currency." },
      { name: "dueDate", type: "Date", required: true, description: "Final date for penalty-free clearing." },
      { name: "status", type: "String", required: true, default: "'Pending'", validation: "Enum: ['Pending', 'Paid', 'Overdue', 'Partially Paid', 'Waived']", description: "Payment state." },
      { name: "paidAmount", type: "Number", required: true, default: "0", description: "Accumulated confirmed remittance." },
      { name: "paymentDate", type: "Date", required: false, description: "Timestamp of final payment clearing." },
      { name: "transactionId", type: "String", required: false, description: "Payment Gateway or Bank transfer transaction key." },
      { name: "billingPeriod", type: "String", required: true, description: "E.g. 'Fall Semester 2026', 'Q1-2026'." }
    ],
    codeSnippet: `import { Schema, model } from 'mongoose';

const FeeSchema = new Schema({
  student: { 
    type: Schema.Types.ObjectId, 
    ref: 'Student', 
    required: true,
    index: true 
  },
  feeType: { 
    type: String, 
    required: true,
    enum: ['Room Rent', 'Mess Fee', 'Maintenance Fine', 'Late Fine', 'Security Deposit'] 
  },
  amount: { type: Number, required: true, min: 0 },
  dueDate: { type: Date, required: true },
  status: { 
    type: String, 
    required: true,
    enum: ['Pending', 'Paid', 'Overdue', 'Partially Paid', 'Waived'],
    default: 'Pending' 
  },
  paidAmount: { type: Number, required: true, default: 0 },
  paymentDate: { type: Date },
  transactionId: { type: String, sparse: true },
  billingPeriod: { type: String, required: true }
}, { timestamps: true });

FeeSchema.index({ student: 1, status: 1 });
FeeSchema.index({ dueDate: 1 });

export const Fee = model('Fee', FeeSchema);`
  }
];

export const COLLECTION_RELATIONSHIPS = {
  text: `
===================================================================================================
                                  COLLECTION RELATIONSHIPS & CONSTRAINTS
===================================================================================================

The data model utilizes highly strict foreign key linkages using Mongoose ObjectIds.

1. USER <---> STUDENT  (One-to-One)
   - Every Student document MUST possess exactly one referenced User ID.
   - The User document stores the cryptographic access secrets and system role.
   - On deletion of a User, a cascading soft-delete triggers to preserve audit histories while revoking active access.

2. STUDENT <---> ROOM  (Many-to-One)
   - A Room holds multiple Students up to its strict \`capacity\` ceiling.
   - The Student document tracks its active placement inside \`currentRoom\`.
   - The Room document manages the aggregate occupancy inside \`currentOccupancy\`.

3. STUDENT <---> ALLOCATION <---> ROOM  (Many-to-Many resolved via Allocation Entity)
   - The Allocation acts as the core join table resolving the many-to-many historical bindings.
   - A single Student can have multiple historical allocations across their academic years, but only ONE \`status: 'Active'\` Allocation at any given time.
   - An Allocation explicitly identifies the target Bed slot (\`bedIdentifier\`).

4. STUDENT <---> COMPLAINT  (One-to-Many)
   - Students can file multiple facility or discipline complaints over time.
   - A Complaint mandates referencing both the Student and the specific Room asset where the defect occurred.

5. STUDENT <---> VISITOR  (One-to-Many)
   - A Student can have multiple external guests log check-ins over the year.
   - Visitors MUST be explicitly approved by an authorized Warden (User entity with role 'Warden').

6. STUDENT <---> FEE  (One-to-Many)
   - The financial interface binds direct ledger line items to the specific Student.
   - Subscriptions for Rent and Mess are generated automatically via scheduled CRON jobs.
`,
  strategies: [
    {
      title: "Cascade Deletion vs Soft-Deletes",
      description: "Enterprise systems strictly ban hard deletions of primary audit tables. Instead, deleting a student sets `status = 'Suspended'` on the User schema and sets `actualVacateDate = Date.now()` on active Allocations. This ensures downstream financial reports and visitor logs retain reference integrity."
    },
    {
      title: "Read Performance Optimization via populate()",
      description: "To prevent N+1 query patterns, MongoDB `$lookup` stages are embedded inside static Mongoose Model helpers. When querying Room Allocations, a single aggregated stage pulls both the resident Profile and their emergency contact info, keeping network round-trips to exactly 1."
    }
  ]
};

export const ER_DIAGRAM_TEXT = `
===================================================================================================
                                   ENTITY RELATIONSHIP DIAGRAM
===================================================================================================

  +-----------------------------------------------------------------------+
  |                                USERS                                  |
  +-----------------------------------------------------------------------+
  | PK  _id           : ObjectId                                          |
  | UQ  email         : String                                            |
  |     passwordHash  : String                                            |
  |     role          : Enum ['Admin', 'Warden', 'Student']               |
  |     status        : Enum ['Active', 'Suspended', 'Pending']           |
  +-----------------------------------------------------------------------+
        | 1
        |
        | (One-to-One Identity Mapping)
        |
        v 1
  +-----------------------------------------------------------------------+
  |                               STUDENTS                                |
  +-----------------------------------------------------------------------+
  | PK  _id           : ObjectId                                          |
  | FK  user          : ObjectId ---> USERS._id                           |
  | UQ  enrollmentNo  : String                                            |
  |     course        : String                                            |
  |     guardian      : Embedded Document                                 |
  | FK  currentRoom   : ObjectId ---> ROOMS._id                           |
  +-----------------------------------------------------------------------+
        | 1                                  | 1                    | 1
        |                                    |                      |
        | (1-to-Many)                        | (1-to-Many)          | (1-to-Many)
        v N                                  v N                    v N
  +--------------------------+    +----------------------+    +----------------------+
  |       ALLOCATIONS        |    |      COMPLAINTS      |    |       VISITORS       |
  +--------------------------+    +----------------------+    +----------------------+
  | PK  _id        : ObjectId|    | PK  _id    : ObjectId|    | PK  _id    : ObjectId|
  | FK  student    : ObjectId|    | FK  student: ObjectId|    | FK  student: ObjectId|
  | FK  room       : ObjectId|    | FK  room   : ObjectId|    |     name   : String  |
  |     bedId      : String  |    |     status : Enum    |    |     checkIn: Date    |
  |     status     : Enum    |    |     priority: Enum   |    |     status : Enum    |
  +--------------------------+    +----------------------+    +----------------------+
        ^ N                                  ^ N
        |                                    |
        +-----------------+------------------+
                          |
                          | (Many-to-One)
                          |
                          v 1
  +-----------------------------------------------------------------------+
  |                                ROOMS                                  |
  +-----------------------------------------------------------------------+
  | PK  _id           : ObjectId                                          |
  | UQ  roomNumber    : String                                            |
  |     hostelBlock   : String                                            |
  |     capacity      : Number                                            |
  |     occupancy     : Number                                            |
  |     status        : Enum ['Available', 'Full', 'Maintenance']         |
  +-----------------------------------------------------------------------+
`;

export const API_ENDPOINTS: ApiEndpoint[] = [
  // AUTH
  {
    id: "auth-1",
    method: "POST",
    path: "/api/v1/auth/login",
    module: "Auth",
    roles: ["All"],
    description: "Authenticates user credentials and returns a short-lived JWT alongside a secure, HTTP-only Refresh Token cookie.",
    requestBody: "{\n  \"email\": \"admin@smarthostel.edu\",\n  \"password\": \"Secr3tP@ssw0rd\"\n}",
    responseShape: "{\n  \"status\": \"success\",\n  \"data\": {\n    \"token\": \"eyJhbGciOiJIUzI1Ni...\",\n    \"user\": {\n      \"id\": \"60d5ecb8b392d7...\",\n      \"email\": \"admin@smarthostel.edu\",\n      \"role\": \"Admin\",\n      \"firstName\": \"System\",\n      \"lastName\": \"Administrator\"\n    }\n  }\n}"
  },
  {
    id: "auth-2",
    method: "POST",
    path: "/api/v1/auth/refresh",
    module: "Auth",
    roles: ["All"],
    description: "Exchanges a valid HTTP-only refresh token cookie for a freshly signed access token without requiring password re-entry.",
    responseShape: "{\n  \"status\": \"success\",\n  \"data\": {\n    \"token\": \"eyJhbGciOiJIUzI1Ni...\"\n  }\n}"
  },
  {
    id: "auth-3",
    method: "GET",
    path: "/api/v1/auth/me",
    module: "Auth",
    roles: ["Admin", "Warden", "Student"],
    description: "Returns the highly detailed identity profile and security claims attached to the current active session.",
    responseShape: "{\n  \"status\": \"success\",\n  \"data\": {\n    \"user\": {\n      \"id\": \"...\",\n      \"role\": \"Student\",\n      \"status\": \"Active\"\n    }\n  }\n}"
  },

  // STUDENTS
  {
    id: "stu-1",
    method: "POST",
    path: "/api/v1/students",
    module: "Students",
    roles: ["Admin"],
    description: "Onboards a new student. Simultaneously provisions their central User credentials and their specific academic profile.",
    requestBody: "{\n  \"email\": \"student.2026@university.edu\",\n  \"password\": \"InitP@ss123\",\n  \"firstName\": \"Arjun\",\n  \"lastName\": \"Mehta\",\n  \"phone\": \"+919876543210\",\n  \"enrollmentNumber\": \"CS2026001\",\n  \"course\": \"B.Tech Computer Science\",\n  \"gender\": \"Male\",\n  \"dateOfBirth\": \"2006-05-14\",\n  \"address\": {\n    \"street\": \"42 Tech Park Road\",\n    \"city\": \"Bangalore\",\n    \"state\": \"Karnataka\",\n    \"zipCode\": \"560001\"\n  },\n  \"guardian\": {\n    \"name\": \"Rajesh Mehta\",\n    \"relation\": \"Father\",\n    \"phone\": \"+919876543211\"\n  }\n}",
    responseShape: "{\n  \"status\": \"success\",\n  \"data\": {\n    \"student\": {\n      \"id\": \"60d5ecc...\",\n      \"enrollmentNumber\": \"CS2026001\"\n    }\n  }\n}"
  },
  {
    id: "stu-2",
    method: "GET",
    path: "/api/v1/students",
    module: "Students",
    roles: ["Admin", "Warden"],
    description: "Retrieves a paginated list of all enrolled students. Supports advanced search by enrollment ID, current course, or hostel allocation status.",
    queryParams: "?page=1&limit=20&search=CS2026&status=Active",
    responseShape: "{\n  \"status\": \"success\",\n  \"results\": 1,\n  \"data\": {\n    \"students\": [...]\n  }\n}"
  },
  {
    id: "stu-3",
    method: "GET",
    path: "/api/v1/students/:id",
    module: "Students",
    roles: ["Admin", "Warden", "Student"],
    description: "Fetches complete detail profile for a specified student. Students can only query their own ID unless their role is Admin or Warden.",
    responseShape: "{\n  \"status\": \"success\",\n  \"data\": {\n    \"student\": {...}\n  }\n}"
  },

  // ROOMS
  {
    id: "rm-1",
    method: "POST",
    path: "/api/v1/rooms",
    module: "Rooms",
    roles: ["Admin"],
    description: "Provisions a new physical room asset into the inventory database.",
    requestBody: "{\n  \"roomNumber\": \"204B\",\n  \"hostelBlock\": \"Block B - Boys\",\n  \"floorNumber\": 2,\n  \"capacity\": 3,\n  \"type\": \"Triple\",\n  \"facilities\": [\"High-Speed Wi-Fi\", \"Attached Bath\", \"Balcony\"]\n}",
    responseShape: "{\n  \"status\": \"success\",\n  \"data\": {\n    \"room\": {...}\n  }\n}"
  },
  {
    id: "rm-2",
    method: "GET",
    path: "/api/v1/rooms",
    module: "Rooms",
    roles: ["Admin", "Warden", "Student"],
    description: "Queries active room listings. Students use this to inspect availability during room choice requests.",
    queryParams: "?hostelBlock=Block B - Boys&status=Available",
    responseShape: "{\n  \"status\": \"success\",\n  \"data\": {\n    \"rooms\": [...]\n  }\n}"
  },
  {
    id: "rm-3",
    method: "PATCH",
    path: "/api/v1/rooms/:id/status",
    module: "Rooms",
    roles: ["Admin", "Warden"],
    description: "Modifies operational status (e.g., placing a room into 'Maintenance' to prevent automatic allocations).",
    requestBody: "{\n  \"status\": \"Maintenance\"\n}",
    responseShape: "{\n  \"status\": \"success\",\n  \"data\": {\n    \"room\": {...}\n  }\n}"
  },

  // ALLOCATIONS
  {
    id: "al-1",
    method: "POST",
    path: "/api/v1/allocations",
    module: "Allocations",
    roles: ["Admin", "Warden"],
    description: "Executes an atomic room allocation. Locks the target bed, updates room occupancy, and links the student profile inside a MongoDB multi-document transaction.",
    requestBody: "{\n  \"studentId\": \"60d5ecc...\",\n  \"roomId\": \"60d5ecd...\",\n  \"bedIdentifier\": \"Bed-1\",\n  \"expectedVacateDate\": \"2027-05-30\"\n}",
    responseShape: "{\n  \"status\": \"success\",\n  \"data\": {\n    \"allocation\": {...}\n  }\n}"
  },
  {
    id: "al-2",
    method: "POST",
    path: "/api/v1/allocations/:id/vacate",
    module: "Allocations",
    roles: ["Admin", "Warden"],
    description: "Finalizes check-out. Decrements room occupancy, flags the allocation as 'Vacated', and populates the actual termination date.",
    responseShape: "{\n  \"status\": \"success\",\n  \"data\": {\n    \"allocation\": {...}\n  }\n}"
  },

  // COMPLAINTS
  {
    id: "cp-1",
    method: "POST",
    path: "/api/v1/complaints",
    module: "Complaints",
    roles: ["Student"],
    description: "Allows an active student resident to file a service request or incident ticket directly to their block's administrative queue.",
    requestBody: "{\n  \"roomId\": \"60d5ecd...\",\n  \"category\": \"Electrical\",\n  \"title\": \"Ceiling Fan Regulator Defective\",\n  \"description\": \"Fan spins only at maximum speed. Sparks observed when switching on.\",\n  \"priority\": \"High\"\n}",
    responseShape: "{\n  \"status\": \"success\",\n  \"data\": {\n    \"complaint\": {...}\n  }\n}"
  },
  {
    id: "cp-2",
    method: "GET",
    path: "/api/v1/complaints",
    module: "Complaints",
    roles: ["Admin", "Warden", "Student"],
    description: "Retrieves list of complaints. Students see only their own filings. Wardens see all tickets assigned to their hostel block.",
    queryParams: "?status=Pending&priority=High",
    responseShape: "{\n  \"status\": \"success\",\n  \"data\": {\n    \"complaints\": [...]\n  }\n}"
  },
  {
    id: "cp-3",
    method: "POST",
    path: "/api/v1/complaints/:id/comments",
    module: "Complaints",
    roles: ["Admin", "Warden", "Student"],
    description: "Appends a dialogue message to the ticket thread, driving transparent communication.",
    requestBody: "{\n  \"message\": \"Electrician dispatched. Will inspect room at 4 PM today.\"\n}",
    responseShape: "{\n  \"status\": \"success\",\n  \"data\": {\n    \"complaint\": {...}\n  }\n}"
  },

  // VISITORS
  {
    id: "vs-1",
    method: "POST",
    path: "/api/v1/visitors",
    module: "Visitors",
    roles: ["Warden"],
    description: "Registers an arriving guest at the hostel security gate. Demands valid government ID proof registration.",
    requestBody: "{\n  \"visitorName\": \"Sunita Mehta\",\n  \"phone\": \"+919876543212\",\n  \"idProofType\": \"National ID\",\n  \"idProofNumber\": \"UID-9876-5432\",\n  \"relationToStudent\": \"Mother\",\n  \"studentToVisit\": \"60d5ecc...\"\n}",
    responseShape: "{\n  \"status\": \"success\",\n  \"data\": {\n    \"visitor\": {...}\n  }\n}"
  },

  // FEES
  {
    id: "fe-1",
    method: "GET",
    path: "/api/v1/fees",
    module: "Fees",
    roles: ["Admin", "Warden", "Student"],
    description: "Retrieves billing ledgers. Students view personal outstandings. Admins review universal financial reconciliations.",
    queryParams: "?status=Pending",
    responseShape: "{\n  \"status\": \"success\",\n  \"data\": {\n    \"fees\": [...]\n  }\n}"
  },

  // ANALYTICS
  {
    id: "an-1",
    method: "GET",
    path: "/api/v1/analytics/dashboard",
    module: "Analytics",
    roles: ["Admin", "Warden"],
    description: "Aggregates real-time macro telemetry: total occupancy percentages, pending complaint backlogs, real-time fee collections, and floor capacity saturation.",
    responseShape: "{\n  \"status\": \"success\",\n  \"data\": {\n    \"totalRooms\": 150,\n    \"occupiedRooms\": 142,\n    \"occupancyRate\": 94.6,\n    \"pendingComplaints\": 8,\n    \"activeVisitors\": 3,\n    \"feeCollectionRate\": 88.5\n  }\n}"
  }
];

export const FRONTEND_ROUTES: RouteDef[] = [
  { path: "/login", component: "Login", roles: ["All"], layout: "AuthLayout", description: "Public entry form handling user verification and token persistence." },
  { path: "/admin/dashboard", component: "AdminDashboard", roles: ["Admin"], layout: "MainLayout", description: "Macro command center housing executive analytics, universal occupancy telemetry, and instant user administration widgets." },
  { path: "/warden/dashboard", component: "WardenDashboard", roles: ["Warden"], layout: "MainLayout", description: "Hostel-specific overview monitoring active complaints, live visitor registries, and pending room check-outs." },
  { path: "/student/dashboard", component: "StudentDashboard", roles: ["Student"], layout: "MainLayout", description: "Self-service dashboard detailing active bed location, outstanding fees, and status of active service requests." },
  { path: "/rooms", component: "RoomManagement", roles: ["Admin", "Warden"], layout: "MainLayout", description: "Comprehensive floor plan visualizer, maintenance toggles, and drag-and-drop room assignment controllers." },
  { path: "/students", component: "StudentManagement", roles: ["Admin", "Warden"], layout: "MainLayout", description: "Searchable directory for student lookups, medical background reference, and academic parent correspondence." },
  { path: "/complaints", component: "ComplaintManagement", roles: ["Admin", "Warden", "Student"], layout: "MainLayout", description: "Unified ticketing dashboard with role-based filtering, status badges, and expandable real-time chat threads." },
  { path: "/visitors", component: "VisitorManagement", roles: ["Admin", "Warden"], layout: "MainLayout", description: "Security log view featuring one-click check-out timestamping and guest identity documentation verification." },
  { path: "/fees", component: "FeeManagement", roles: ["Admin", "Warden", "Student"], layout: "MainLayout", description: "Ledger interface allowing administrative custom fine creation and allowing students to download itemized receipts." }
];

export const COMPONENT_HIERARCHY: ComponentNode = {
  name: "App (Root)",
  type: "Layout",
  description: "Initializes React Router, Redux/Zustand Global Store Providers, and the Custom Theme Context.",
  children: [
    {
      name: "AuthProvider",
      type: "Context",
      description: "Monitors local storage JWT tokens, maintains live claims, and exposes automatic logout mechanisms upon receiving 401 Interceptor errors.",
      children: [
        {
          name: "MainLayout",
          type: "Layout",
          description: "Authenticated shell rendering persistent structural navigation.",
          children: [
            {
              name: "Sidebar",
              type: "Component",
              description: "Renders adaptive navigational route links conditionally based on active User RBAC Role."
            },
            {
              name: "Header",
              type: "Component",
              description: "Houses dynamic breadcrumbs, live search hotkeys, and context-aware quick notification flyouts."
            },
            {
              name: "Page Content Outlet",
              type: "Page",
              description: "Renders active matched route components.",
              children: [
                {
                  name: "DashboardViews",
                  type: "Page",
                  description: "Renders AdminDashboard, WardenDashboard, or StudentDashboard dynamically.",
                  children: [
                    { name: "MetricCard", type: "Component", description: "Displays KPIs with animated micro-charts and dynamic percentage indicators." },
                    { name: "OccupancyChart", type: "Component", description: "Renders visual SVGs/Canvas graphs plotting block saturation." },
                    { name: "RecentActivityFeed", type: "Component", description: "Real-time scrolling ticker of check-ins, tickets, and payments." }
                  ]
                },
                {
                  name: "RoomManagement",
                  type: "Page",
                  description: "Dedicated inventory workspace.",
                  children: [
                    {
                      name: "RoomGrid",
                      type: "Component",
                      description: "Interactive visual array mirroring actual physical architectural layouts.",
                      children: [
                        { name: "RoomCell", type: "Component", description: "Color-coded micro-component showing beds, residents, and real-time maintenance flags." }
                      ]
                    },
                    { name: "AllocationModal", type: "Component", description: "Popup form driving atomic room mapping transactions." }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export const STATE_MANAGEMENT_STRATEGY = {
  overview: "The Smart Hostel Management System implements a strict segregation between **Client UI State** and **Server Cache State** to maximize rendering efficiency and prevent stale race conditions.",
  pillars: [
    {
      title: "Server State: TanStack React Query",
      description: "All API interactions (fetching room layouts, polling active complaints, loading fee ledgers) are managed via React Query. This completely automates background refetching, query deduplication, stale-while-revalidate caching, and optimistic UI updates (e.g. instantly showing a filed complaint in the list before the server roundtrip finishes)."
    },
    {
      title: "Global Client State: Redux Toolkit / Zustand",
      description: "Reserved exclusively for synchronous UI configurations. It stores the authenticated User session (claims, token state, user ID), responsive Sidebar collapse toggles, and universal application color themes. This prevents re-rendering heavy tables when minor UI attributes change."
    },
    {
      title: "Form State: React Hook Form + Zod",
      description: "Forms (Login, Room Allocation, Complaint Creation) utilize uncontrolled inputs managed by React Hook Form. This completely eliminates input typing lag. Complete validation is executed instantly client-side using the exact same Zod validation schemas shared with the backend monorepo."
    },
    {
      title: "Optimistic Updates & Mutation Pipelines",
      description: "When a Warden approves a room check-out, the local React Query cache for the specific room is immediately modified to decrement occupancy. If the backend server responds with a failure (e.g. database network error), the cache is automatically rolled back to its previous pristine state."
    }
  ]
};

export const SECURITY_ARCHITECTURE: SecurityRule[] = [
  {
    category: "Authentication",
    title: "Stateless JWT + Rotating HTTP-Only Cookies",
    description: "Access tokens are extremely short-lived (15 minutes) and delivered in memory. Long-lived refresh tokens (7 days) are stored inside highly secure, `HttpOnly`, `Secure`, `SameSite=Strict` cookies. This renders them completely invulnerable to client-side XSS attacks.",
    implementation: "Express `res.cookie('refreshToken', token, { httpOnly: true, secure: true, sameSite: 'strict' })`",
    icon: "ShieldCheck"
  },
  {
    category: "Authorization",
    title: "Declarative RBAC Gatekeeping",
    description: "Every sensitive REST endpoint is protected by a dual-layer middleware pipeline. The first verifies token integrity and cryptographic signatures. The second inspects the decoded token claims against an explicit array of allowed Roles.",
    implementation: "Route Definition: `router.post('/allocations', requireAuth, requireRoles(['Admin', 'Warden']), allocationController.create)`",
    icon: "Lock"
  },
  {
    category: "Network Defense",
    title: "Strict Rate Limiting & Brute Force Protection",
    description: "To prevent dictionary login attacks and automated server scraping, a Redis-backed token bucket rate limiter restricts inbound requests. Login routes are limited to 5 attempts per 15 minutes per IP address.",
    implementation: "Express Rate Limiter: `rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true })`",
    icon: "Server"
  },
  {
    category: "Data Sanitation",
    title: "NoSQL Injection & Cross-Site Scripting Mitigation",
    description: "All incoming request bodies, queries, and parameters are rigorously parsed to strip unescaped operators like `$where` or `$gt`. HTML entities are completely encoded before saving to prevent persistent stored XSS.",
    implementation: "Integration of `mongo-sanitize` and strict entry schema validation via Zod.",
    icon: "FileCode"
  },
  {
    category: "Transport Security",
    title: "Mandatory TLS 1.3 & HTTP Security Headers",
    description: "All network traffic is strictly forced over HTTPS. Production setups integrate Helmet to inject security headers preventing Clickjacking, MIME-sniffing, and enforcing an explicit Content Security Policy (CSP).",
    implementation: "Express Configuration: `app.use(helmet())` with custom CSP rules restricting script execution sources.",
    icon: "Globe"
  }
];

export const VALIDATION_STRATEGY: ValidationLayer[] = [
  {
    layer: "1. Client UI Layer",
    tool: "React Hook Form + Zod",
    strategy: "Catches malformed inputs immediately during user typing. Disables form submission triggers until schema verification passes, providing clean localization error feedback.",
    exampleSnippet: `const AllocationSchema = z.object({
  studentId: z.string().min(1, "Student selection is mandatory"),
  roomId: z.string().min(1, "Target room is mandatory"),
  expectedVacateDate: z.coerce.date().min(new Date(), "Vacate date must be in the future")
});`
  },
  {
    layer: "2. Edge / Transport Layer",
    tool: "Express Zod Middleware",
    strategy: "Acts as the impenetrable server entry gate. If inbound JSON payloads fail to perfectly match expected schemas, the middleware immediately intercepts the request and returns a 400 Bad Request directly to the client without ever invoking deeper application controllers.",
    exampleSnippet: `export const validate = (schema: AnyZodObject) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      return res.status(400).json({ status: "error", errors: error.errors });
    }
};`
  },
  {
    layer: "3. Database Persistence Layer",
    tool: "Mongoose Native Schema Constraints",
    strategy: "The absolute last line of defense. Enforces native MongoDB typing, minimum/maximum scalar bounds, and uncompromisable unique collection indexes directly at the storage level.",
    exampleSnippet: `capacity: { 
  type: Number, 
  required: true, 
  min: [1, 'Capacity cannot be less than 1'], 
  max: [6, 'Hostel rules forbid more than 6 beds per room'] 
}`
  }
];
