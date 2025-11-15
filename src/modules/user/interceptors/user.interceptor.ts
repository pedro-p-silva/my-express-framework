import { Request, Response, NextFunction } from 'express';

export function userInterceptor(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const originalSend = res.send.bind(res);

  res.send = (body?: any) => {
    const ms = Date.now() - start;
    res.setHeader('X-Response-Time', `${ms}ms`);
    return originalSend(body);
  };

  next();
}