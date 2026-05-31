# Enterprise Deployment & Production Manual
**Smart Hostel Management System**

This guide provides the complete, step-by-step production deployment manual for provisioning the highly available, secure MERN Stack infrastructure across **MongoDB Atlas** (Database Tier), **Render** (Application API Tier), and **Vercel** (Client Edge Tier).

---

## 1. Environment Variables Configuration

### **Backend Environment Variables (Render)**
Configure these strictly within your Render Web Service environment settings:

```env
# Application Server Settings
NODE_ENV=production
PORT=5000
CLIENT_ORIGIN=https://smarthostel.yourdomain.com

# MongoDB Atlas Database Connection
MONGO_URI=mongodb+srv://<db_username>:<secure_password>@cluster0.atlas.mongodb.net/smarthostel_production?retryWrites=true&w=majority

# Security Cryptographic Secrets
JWT_SECRET=c8b9a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8
JWT_EXPIRE=7d

# SMTP Mail Transport Settings (Nodemailer)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=465
SMTP_USER=apikey
SMTP_PASS=SG.secure_api_key_string_here
SMTP_FROM="SmartHostel Systems" <no-reply@smarthostel.yourdomain.com>
```

### **Frontend Environment Variables (Vercel)**
Configure these within your Vercel Project environment variables settings:

```env
# Target Production API Gateway URL
VITE_API_BASE_URL=https://api.smarthostel.yourdomain.com/api/v1

# Security / Verification Attributes
VITE_APP_ENV=production
```

---

## 2. Build Commands & Scripts

### **Backend Configuration (`backend/package.json`)**
Ensure your backend package root specifies the correct engine constraints and production start scripts:

```json
{
  "name": "smart-hostel-backend",
  "version": "1.0.0",
  "type": "module",
  "engines": {
    "node": ">=18.0.0"
  },
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```
* **Render Build Command:** `npm install`
* **Render Start Command:** `npm start`

### **Frontend Configuration (`package.json`)**
The frontend leverages Vite's high-speed ES module resolution and Single-File building for zero-latency client delivery:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```
* **Vercel Build Command:** `npm run build`
* **Vercel Output Directory:** `dist`
* **Vercel Install Command:** `npm install`

---

## 3. Step-by-Step Production Deployment

### **Step A: Provision MongoDB Atlas Database**
1. Log in to the [MongoDB Atlas Console](https://cloud.mongodb.com/).
2. Create a new **Dedicated** or **Serverless** Cluster in your target AWS/GCP region.
3. Navigate to **Database Access** -> **Add New Database User**.
   * Select **Password Authentication**.
   * Set Database User Privileges to **Read and write to any database**.
4. Navigate to **Network Access** -> **Add IP Address**.
   * For Render deployment, allow access from **Anywhere (`0.0.0.0/0`)** since Render uses dynamic outbound IPs, or explicitly peer your VPC if operating on Render Enterprise.
5. Click **Connect** -> **Connect your application** and copy the **SRV Connection String** to inject into your Render `MONGO_URI`.

### **Step B: Deploy Backend Application API to Render**
1. Log in to the [Render Dashboard](https://dashboard.render.com/).
2. Select **New +** -> **Web Service**.
3. Connect your GitHub/GitLab repository hosting the `smart-hostel-backend` code.
4. Configure the Web Service:
   * **Name:** `smarthostel-production-api`
   * **Root Directory:** `backend` (if operating inside a monorepo, specify the sub-folder directly).
   * **Environment:** `Node`
   * **Region:** Match your MongoDB Atlas region directly to minimize network latency.
   * **Build Command:** `npm install`
   * **Start Command:** `npm start`
5. Expand **Advanced** -> **Environment Variables** and paste your complete Backend Environment Variables array.
6. Click **Create Web Service**. Render will securely build and launch the API cluster.

### **Step C: Deploy Client SPA to Vercel**
1. Log in to the [Vercel Dashboard](https://vercel.com/).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository.
4. Configure the Project:
   * **Project Name:** `smarthostel-client`
   * **Framework Preset:** `Vite`
   * **Root Directory:** `./` (or the frontend folder inside your monorepo).
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
5. Expand **Environment Variables** and inject `VITE_API_BASE_URL` pointing to your new Render Web Service URL.
6. Click **Deploy**. Vercel will bundle the SPA and instantly cache it across its global Edge CDN.

---

## 4. Custom Domain Setup & SSL Provisioning

To maintain absolute brand authority and allow smooth cross-origin cookie sharing, attach custom subdomains under a unified root domain:

### **DNS Configuration Matrix**

| Subdomain | Target Platform | Record Type | Value / Target |
| :--- | :--- | :--- | :--- |
| `smarthostel.yourdomain.com` | Vercel (Frontend) | **CNAME** | `cname.vercel-dns.com` |
| `api.smarthostel.yourdomain.com` | Render (Backend) | **CNAME** | `smarthostel-production-api.onrender.com` |

### **SSL / TLS Provisioning**
* **Vercel:** Automatically provisions and renews **Let's Encrypt** managed SSL certificates with automatic HTTP-to-HTTPS redirection.
* **Render:** Automatically provisions managed TLS 1.3 certificates. Ensure your domain's Cloudflare or DNS provider does not enforce conflicting proxying ("Orange Cloud") unless SSL mode is strictly set to **Full (Strict)**.

---

## 5. Production CORS Configuration

To prevent unauthorized third-party applications from directly querying your backend API, enforce explicit cross-origin boundaries inside `backend/server.js`:

```javascript
import cors from 'cors';

// Define the absolute whitelist of trusted origin domains
const allowedOrigins = [
  'https://smarthostel.yourdomain.com',
  'https://smarthostel-client.vercel.app' // Vercel direct fallback
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests) if explicitly authorized
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Cross-Origin Resource Sharing (CORS) policy strictly forbids access from this origin.'));
    }
  },
  credentials: true, // Mandatory to permit secure HTTP-Only session cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
```

---

## 6. Enterprise Production Security Settings

When operating in production, activate these mandatory baseline security settings to defend against automated brute-force attacks, packet sniffing, and code injection:

### **A. Transport Security & Security Headers (Helmet)**
Ensure your Express application explicitly mounts Helmet to block Clickjacking and force modern browsers to execute strict MIME validation:

```javascript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https://images.unsplash.com"],
      connectSrc: ["'self'", "https://api.smarthostel.yourdomain.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

### **B. Brute-Force Rate Limiting**
Protect your authentication and transactional endpoints from automated dictionary attacks:

```javascript
import rateLimit from 'express-rate-limit';

const productionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 200, // Limit each IP to 200 requests per window
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many requests originating from this IP address. To protect system stability, access is temporarily paused.'
  }
});

// Apply universally to the API gateway
app.use('/api/v1', productionLimiter);
```

### **C. Secure Session Cookie Directives**
If implementing HTTP-Only refresh cookies, ensure your transport flags guarantee that cookies are never leaked over unencrypted transport layers:

```javascript
res.cookie('smart_hostel_refresh', refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // Requires true HTTPS
  sameSite: 'strict', // Protects against Cross-Site Request Forgery (CSRF)
  domain: '.yourdomain.com', // Permits sharing across api. and primary client origins
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});
```

### **D. MongoDB Connection Pool Optimization**
Ensure your Mongoose configuration inside `backend/config/db.js` enforces highly available connection pools to prevent timeout backlogs during traffic spikes:

```javascript
const conn = await mongoose.connect(process.env.MONGO_URI, {
  maxPoolSize: 50, // Maintain up to 50 socket connections
  minPoolSize: 10, // Keep 10 active connections hot
  socketTimeoutMS: 45000, // Close inactive sockets after 45s
  serverSelectionTimeoutMS: 5000, // Fail fast if Atlas is unreachable
  family: 4 // Force IPv4 routing
});
```
