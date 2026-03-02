import dotenv from 'dotenv';
dotenv.config();

import dns from 'node:dns';
// Use Google public DNS to resolve SRV records (fixes ISP/firewall blocking)
dns.setServers(['8.8.8.8', '8.8.4.4']);

import app from './app.js';
import connectDB from './config/db.js';

/* ============================================================
 * Server entry point — connect to MongoDB then listen
 * ============================================================ */

const PORT = process.env.PORT || 5000;

const start = async (): Promise<void> => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 TaskFlow API running on port ${PORT}`);
      console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections gracefully
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

start();
