const { PrismaClient } = require('@prisma/client');

// Enhanced Prisma client with improved connection management
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'colorless',
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Add connection pool settings for stability
  __internal: {
    engine: {
      connectTimeout: 60000, // 60 seconds
      pool: {
        timeout: 60000,
        size: 5, // Connection pool size
      },
    },
  },
});

// Connection retry mechanism
let retryCount = 0;
const maxRetries = 5;

async function connectWithRetry() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    retryCount = 0; // Reset retry count on successful connection
  } catch (error) {
    console.error(`❌ Database connection failed (attempt ${retryCount + 1}/${maxRetries}):`, error.message);
    
    if (retryCount < maxRetries - 1) {
      retryCount++;
      console.log(`🔄 Retrying connection in ${retryCount * 2} seconds...`);
      setTimeout(connectWithRetry, retryCount * 2000); // Exponential backoff
    } else {
      console.error('💥 Max database connection retries exceeded. Server may be unstable.');
    }
  }
}

// Initialize connection
connectWithRetry();

// Health check function
async function checkDatabaseHealth() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('🔥 Database health check failed:', error.message);
    return false;
  }
}

// Periodic database health monitoring
setInterval(async () => {
  const isHealthy = await checkDatabaseHealth();
  if (!isHealthy) {
    console.log('🔄 Attempting to reconnect to database...');
    await connectWithRetry();
  }
}, 30000); // Check every 30 seconds

// Enhanced graceful shutdown with better error handling
async function gracefulShutdown(signal) {
  console.log(`\n🛑 ${signal} received: Closing database connections...`);
  
  try {
    await prisma.$disconnect();
    console.log('✅ Database disconnected successfully');
  } catch (error) {
    console.error('❌ Error disconnecting from database:', error.message);
  } finally {
    process.exit(0);
  }
}

// Handle various shutdown signals
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGUSR1', () => gracefulShutdown('SIGUSR1'));
process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2'));

// Handle uncaught exceptions to prevent crashes
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Promise Rejection at:', promise, 'reason:', reason);
  // Don't exit here, just log it and continue
});

// Export both prisma instance and health check function
module.exports = {
  prisma,
  checkDatabaseHealth,
};
