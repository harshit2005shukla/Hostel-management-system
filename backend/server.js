import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/error.middleware.js';

// Route Imports
import authRoutes from './routes/auth.routes.js';
import studentRoutes from './routes/student.routes.js';
import roomRoutes from './routes/room.routes.js';
import allocationRoutes from './routes/allocation.routes.js';
import complaintRoutes from './routes/complaint.routes.js';
import visitorRoutes from './routes/visitor.routes.js';
import feeRoutes from './routes/fee.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import activityLogRoutes from './routes/activityLog.routes.js';
import reportRoutes from './routes/report.routes.js';

// Load Environment Configuration
dotenv.config();

// Initialize Express App
const app = express();

// Security & Parsing Middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many requests originating from this IP address. Please try again after 15 minutes.'
  }
});
app.use('/api/v1', limiter);

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database Connection
await connectDB();

// Root Health Check
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Smart Hostel Management System API is healthy and operational.',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Mount Module Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/rooms', roomRoutes);
app.use('/api/v1/allocations', allocationRoutes);
app.use('/api/v1/complaints', complaintRoutes);
app.use('/api/v1/visitors', visitorRoutes);
app.use('/api/v1/fees', feeRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/audit-logs', activityLogRoutes);
app.use('/api/v1/reports', reportRoutes);

// Handle 404 Unmatched Routes
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Requested path ${req.originalUrl} does not exist on this server.`
  });
});

// Global Centralized Error Handling Interceptor
app.use(errorHandler);

// Start Listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Express] Enterprise Backend API running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
});
