const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

// Trust proxy if deployed behind reverse proxy like Render / Vercel
app.set('trust proxy', 1);

// Security Response Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

// Production-Restricted CORS Configuration
const isProduction = process.env.NODE_ENV === 'production';

const getProductionOrigins = () => {
  const origins = [];
  if (process.env.CLIENT_URL) origins.push(process.env.CLIENT_URL.trim());
  if (process.env.FRONTEND_URL) origins.push(process.env.FRONTEND_URL.trim());
  return origins.filter(Boolean);
};

const devOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    // Same-origin server requests or server-to-server calls without Origin header
    if (!origin) {
      return callback(null, true);
    }

    if (isProduction) {
      const prodOrigins = getProductionOrigins();
      
      // Explicitly reject localhost origins and wildcard in production
      if (origin.includes('localhost') || origin.includes('127.0.0.1') || origin === '*') {
        return callback(new Error('CORS policy: Localhost & wildcard origins are blocked in production'));
      }

      // Allow matching production origins
      const isAllowed = prodOrigins.some(allowed => origin === allowed || allowed === '*') ||
                        origin.endsWith('.vercel.app') ||
                        origin.endsWith('.onrender.com');

      if (isAllowed) {
        return callback(null, true);
      }
      return callback(new Error('CORS policy: Request origin not allowed by production security settings'));
    } else {
      // Development mode
      const allowed = [...getProductionOrigins(), ...devOrigins];
      if (allowed.some(o => o === '*' || origin === o) || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }
      return callback(new Error('CORS policy: Request origin not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '10mb' }));

// Rate Limiting Middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // max 300 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: 'Too many requests from this IP, please try again after 15 minutes' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // max 15 login/register attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: 'Too many authentication attempts. Please try again after 15 minutes.' }
});

// Apply rate limiting
app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// API Routes
app.use('/api/health', require('./routes/health'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/userdata', require('./routes/userData'));
app.use('/api/library', require('./routes/library'));
app.use('/api/upload', require('./routes/upload'));

// Root info endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'PlayBack API Server is Live',
    health: '/api/health'
  });
});

// Production Static File Serving (Single-Server Deployment)
if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, '../../frontend/dist');
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));

    app.get('{*path}', (req, res, next) => {
      if (req.path.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

// Central error handler
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }
  res.status(500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

// Handle 404 for unhandled API routes
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`PlayBack API server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});
