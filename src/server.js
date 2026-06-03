import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import prisma from './config/db.js';

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const startServer = async () => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✓ Database connection successful');

    // Start Express server
    const server = app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║   Water Monitoring Backend Server      ║
╠════════════════════════════════════════╣
║  Environment: ${NODE_ENV.padEnd(30, ' ')} ║
║  Port: ${PORT.toString().padEnd(35, ' ')} ║
║  Status: Running                       ║
╚════════════════════════════════════════╝
      `);
    });

    // Handle server shutdown gracefully
    process.on('SIGINT', async () => {
      console.log('\n[SHUTDOWN] Gracefully shutting down...');
      server.close(async () => {
        await prisma.$disconnect();
        console.log('[SHUTDOWN] Server and database connections closed');
        process.exit(0);
      });
    });

    process.on('SIGTERM', async () => {
      console.log('\n[SHUTDOWN] SIGTERM received');
      server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
      });
    });

    // Handle unhandled exceptions
    process.on('uncaughtException', (error) => {
      console.error('[UNCAUGHT EXCEPTION]', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('[UNHANDLED REJECTION]', {
        reason,
        promise
      });
      process.exit(1);
    });

  } catch (error) {
    console.error('✗ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
