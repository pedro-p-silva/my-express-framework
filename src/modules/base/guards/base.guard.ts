import { Request, Response, NextFunction } from 'express';

export function baseGuard(req: Request, res: Response, next: NextFunction) {
    if (req.headers['x-block']) {
        return res.status(403).json({ error: 'Access denied by BaseGuard' });
    }

    next();
}