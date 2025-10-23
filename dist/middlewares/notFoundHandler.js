"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = void 0;
const notFoundHandler = (req, res, next) => {
    // Silently ignore favicon requests
    if (req.path === '/favicon.ico') {
        res.status(204).end();
        return;
    }
    const error = new Error(`Cannot ${req.method} ${req.path}`);
    error.statusCode = 404;
    next(error);
};
exports.notFoundHandler = notFoundHandler;
