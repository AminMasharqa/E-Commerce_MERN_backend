import type { Request, Response, NextFunction } from 'express';

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Silently ignore favicon requests
  if (req.path === '/favicon.ico') {
    res.status(204).end();
    return;
  }

  const error = new Error(`Cannot ${req.method} ${req.path}`);
  (error as any).statusCode = 404;
  next(error);
};