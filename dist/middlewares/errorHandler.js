// Custom error class
export class AppError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
// Error handler middleware
export const errorHandler = (err, req, res, next) => {
    // Default error values
    let statusCode = 500;
    let message = 'Internal server error';
    let isOperational = false;
    // Check if it's our custom AppError
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        isOperational = err.isOperational;
    }
    else if (err.name === 'ValidationError') {
        // Mongoose validation error
        statusCode = 400;
        message = 'Validation error';
    }
    else if (err.name === 'CastError') {
        // Mongoose cast error (invalid ObjectId)
        statusCode = 400;
        message = 'Invalid ID format';
    }
    else if (err.name === 'MongoServerError' && err.code === 11000) {
        // Mongoose duplicate key error
        statusCode = 409;
        message = 'Duplicate field value';
    }
    else if (err.name === 'JsonWebTokenError') {
        // JWT error
        statusCode = 401;
        message = 'Invalid token';
    }
    else if (err.name === 'TokenExpiredError') {
        // JWT expired
        statusCode = 401;
        message = 'Token expired';
    }
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
        console.error('Error:', {
            message: err.message,
            stack: err.stack,
            statusCode,
        });
    }
    // Send error response
    res.status(statusCode).json({
        status: 'error',
        message,
        ...(process.env.NODE_ENV === 'development' && {
            error: err.message,
            stack: err.stack,
        }),
    });
};
//# sourceMappingURL=errorHandler.js.map