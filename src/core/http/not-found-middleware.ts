import { Request, Response, NextFunction } from 'express';

export function notFoundMiddleware(req: Request, res: Response, _next: NextFunction) {
    return res.status(404).json({
        error: 'Route not found',
        path: req.path
    });
}