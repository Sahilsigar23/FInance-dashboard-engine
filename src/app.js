const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { specs, swaggerUi, swaggerOptions } = require('./config/swagger');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const transactionRoutes = require('./routes/transaction.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

// Create Express app
const app = express();

// Trust proxy (for production deployment behind reverse proxy)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS configuration with production support
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5000',
      'https://localhost:3000',
      'https://localhost:3001'
    ];
    
    // In production, allow same-origin requests (Swagger UI from same domain)
    if (process.env.NODE_ENV === 'production') {
      // Allow requests from the same domain (for Swagger UI)
      const requestOrigin = origin || '';
      const isRenderDomain = requestOrigin.includes('.onrender.com');
      const isSameOrigin = true; // Always allow same-origin in production
      
      if (isRenderDomain || isSameOrigin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
    } else {
      // Development: be more permissive
      if (allowedOrigins.includes(origin) || origin.includes('localhost')) {
        return callback(null, true);
      }
    }
    
    callback(new Error(`CORS policy violation: Origin ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS', 'PUT'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  credentials: true,
  optionsSuccessStatus: 200, // For legacy browser support
  maxAge: 86400 // 24 hours
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Body parsing middleware
app.use(express.json({ 
  limit: '10mb',
  strict: true
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb'
}));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'FinSight Backend is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

// Redirect root to API documentation
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// API Routes
const API_PREFIX = '/api/v1';

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/transactions`, transactionRoutes);
app.use(`${API_PREFIX}/dashboard`, dashboardRoutes);

// API info endpoint
app.get(`${API_PREFIX}`, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'FinSight Backend API v1.0.0',
    documentation: '/api-docs',
    endpoints: {
      authentication: `${API_PREFIX}/auth`,
      users: `${API_PREFIX}/users`,
      transactions: `${API_PREFIX}/transactions`,
      dashboard: `${API_PREFIX}/dashboard`
    },
    rolePermissions: {
      ADMIN: [
        'Full access to all resources',
        'Create/update/delete transactions',
        'Manage users and roles',
        'Access all analytics'
      ],
      ANALYST: [
        'View and analyze transactions',
        'Access analytics dashboards',
        'Filter and search data'
      ],
      VIEWER: [
        'View dashboard summaries',
        'Basic financial overview'
      ]
    },
    timestamp: new Date().toISOString()
  });
});

// 404 handler for undefined routes
app.use('*', notFoundHandler);

// Global error handling middleware (must be last)
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Promise Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

module.exports = app;