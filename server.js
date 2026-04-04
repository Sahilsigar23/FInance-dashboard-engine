require('dotenv').config();
const app = require('./src/app');

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingEnvVars.forEach(envVar => {
    console.error(`   - ${envVar}`);
  });
  console.error('\nPlease create a .env file based on .env.example and set all required variables.');
  process.exit(1);
}

// Set default port (Render uses dynamic PORT)
const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, () => {
  console.log('\n🚀 FinSight Backend Server Started Successfully!');
  console.log('================================================');
  console.log(`📍 Server running on: http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api/v1`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('================================================');
  console.log('\n📋 Available Endpoints:');
  console.log('   • POST /api/v1/auth/register - Register user');
  console.log('   • POST /api/v1/auth/login - User login');
  console.log('   • GET  /api/v1/auth/me - Get profile');
  console.log('   • GET  /api/v1/users - Get users (Admin)');
  console.log('   • POST /api/v1/users - Create user (Admin)');
  console.log('   • GET  /api/v1/transactions - Get transactions');
  console.log('   • POST /api/v1/transactions - Create transaction (Admin)');
  console.log('   • GET  /api/v1/dashboard/summary - Dashboard summary');
  console.log('   • GET  /api/v1/dashboard/net-balance - Net balance');
  console.log('\n🔐 Role-Based Access Control:');
  console.log('   • ADMIN: Full access to all resources');
  console.log('   • ANALYST: View transactions and analytics');
  console.log('   • VIEWER: View dashboard summaries only');
  console.log('\n💡 Next Steps:');
  console.log('   1. Run: npm run migrate (to setup database)');
  console.log('   2. Visit: http://localhost:${PORT}/api-docs');
  console.log('   3. Register your first admin user');
  console.log('   4. Start building your financial dashboard!');
  console.log('\n');
});

// Global error handlers
server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;

  switch (error.code) {
    case 'EACCES':
      console.error(`❌ ${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`❌ ${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n🛑 ${signal} received: closing HTTP server gracefully...`);
  
  server.close((err) => {
    if (err) {
      console.error('❌ Error during server shutdown:', err);
      process.exit(1);
    }
    
    console.log('✅ HTTP server closed successfully');
    console.log('👋 FinSight Backend shutdown complete');
    process.exit(0);
  });

  // Force close after 30 seconds
  setTimeout(() => {
    console.error('❌ Forcefully shutting down after 30s timeout');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Keep process alive
process.stdin.resume();