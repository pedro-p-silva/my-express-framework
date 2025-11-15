import express, { Application } from 'express';
import 'reflect-metadata';
import { registerRoutes } from './routes';
import { errorMiddleware } from '../core/http/error-middleware';
import { notFoundMiddleware } from '../core/http/not-found-middleware';

export function createApp(): Application {
    const app = express();

    app.use(express.json());

    registerRoutes(app);

    app.use(notFoundMiddleware);

    app.use(errorMiddleware);

    return app;
}