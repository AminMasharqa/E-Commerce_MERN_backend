"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Load environment variables first
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
// import as type
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const database_js_1 = require("./config/database.js");
const userRoute_js_1 = __importDefault(require("./routes/userRoute.js"));
const productRoute_js_1 = __importDefault(require("./routes/productRoute.js"));
const cartRoute_js_1 = __importDefault(require("./routes/cartRoute.js"));
const productService_js_1 = require("./services/productService.js");
const errorHandler_js_1 = require("./middlewares/errorHandler.js");
const notFoundHandler_js_1 = require("./middlewares/notFoundHandler.js");
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
const app = (0, express_1.default)();
// Security middleware
app.use((0, helmet_1.default)());
// CORS configuration
app.use((0, cors_1.default)({
    origin: NODE_ENV === 'production' ? ALLOWED_ORIGINS : '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Logging middleware
if (NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
else {
    app.use((0, morgan_1.default)('combined'));
}
// Health check endpoint
app.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: NODE_ENV,
    });
});
// API routes
app.use('/user', userRoute_js_1.default);
app.use('/product', productRoute_js_1.default);
app.use('/cart', cartRoute_js_1.default);
// 404 handler for undefined routes
app.use(notFoundHandler_js_1.notFoundHandler);
// Global error handler (must be last)
app.use(errorHandler_js_1.errorHandler);
// Server instance
let server;
// Graceful shutdown handler
const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);
    if (server) {
        server.close(async () => {
            console.log('HTTP server closed');
            try {
                await (0, database_js_1.disconnectDatabase)();
                console.log('Database connection closed');
                process.exit(0);
            }
            catch (err) {
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
        await (0, database_js_1.connectDatabase)();
        console.log('✓ Database connected successfully');
        // Seed products only in development or if flag is set
        if (NODE_ENV === 'development' || process.env.SEED_DATA === 'true') {
            await (0, productService_js_1.seedInitialProducts)();
            console.log('✓ Initial products seeded');
        }
        // Start server
        server = app.listen(PORT, () => {
            console.log(`✓ Server running on port ${PORT} in ${NODE_ENV} mode`);
            console.log(`✓ Health check available at http://localhost:${PORT}/health`);
        });
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`Port ${PORT} is already in use`);
            }
            else {
                console.error('Server error:', error);
            }
            process.exit(1);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
// Handle uncaught errors
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    gracefulShutdown('uncaughtException');
});
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
    gracefulShutdown('unhandledRejection');
});
// Start the server
startServer();
exports.default = app;
