export const notFoundHandler = (req, res, next) => {
    // Silently ignore favicon requests
    if (req.path === '/favicon.ico') {
        res.status(204).end();
        return;
    }
    const error = new Error(`Cannot ${req.method} ${req.path}`);
    error.statusCode = 404;
    next(error);
};
//# sourceMappingURL=notFoundHandler.js.map