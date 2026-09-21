const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();
 
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173'
].filter(Boolean);
 
// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (
      !origin ||
      allowedOrigins.length === 0 ||
      allowedOrigins.includes(origin) ||
      allowedOrigins.includes('*') ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.onrender.com') ||
      origin.includes('localhost')
    ) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());

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
