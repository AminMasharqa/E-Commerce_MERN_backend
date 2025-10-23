// Load environment variables first
import dotenv from 'dotenv';
dotenv.config();

import express, { type Express, type Request, type Response, type NextFunction } from 'express';

// import as type



import cors from 'cors';
import { default as helmet } from 'helmet';
import morgan from 'morgan';

import { connectDatabase, disconnectDatabase } from './config/database.ts';
import userRoute from './routes/userRoute.ts';
import productRoute from './routes/productRoute.ts';
import cartRoute from './routes/cartRoute.ts';
import { seedInitialProducts } from './services/productService.ts';
import { errorHandler } from './middlewares/errorHandler.ts';
import { notFoundHandler } from './middlewares/notFoundHandler.ts';

// Environment variables with validation
const PORT = parseInt(process.env.PORT || '3001', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

// Create Express app
const app: Express = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: NODE_ENV === 'production' ? ALLOWED_ORIGINS : '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
  });
});

// API routes
app.use('/user', userRoute);
app.use('/product', productRoute);
app.use('/cart', cartRoute);

// 404 handler for undefined routes
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// Server instance
let server: any;

// Graceful shutdown handler
const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);

  if (server) {
    server.close(async () => {
      console.log('HTTP server closed');

      try {
        await disconnectDatabase();
        console.log('Database connection closed');
        process.exit(0);
      } catch (err) {
        console.error('Error during database disconnect:', err);
        process.exit(1);
      }
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      console.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  }
};

// Startup function
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();
    console.log('✓ Database connected successfully');

    // Seed products only in development or if flag is set
    if (NODE_ENV === 'development' || process.env.SEED_DATA === 'true') {
      await seedInitialProducts();
      console.log('✓ Initial products seeded');
    }

    // Start server
    server = app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT} in ${NODE_ENV} mode`);
      console.log(`✓ Health check available at http://localhost:${PORT}/health`);
    });

    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
      } else {
        console.error('Server error:', error);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught errors
process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason: any) => {
  console.error('Unhandled Rejection:', reason);
  gracefulShutdown('unhandledRejection');
});

// Start the server
startServer();

export default app;