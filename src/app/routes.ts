import { Application } from 'express';
import { welcomeRouter } from '../modules/welcome/welcome.routes';

export function registerRoutes(app: Application) {
    app.use('/api/v1/welcome', welcomeRouter);

    // aqui no futuro:
    // app.use('/api/v1/auth', authRouter);
    // app.use('/api/v1/users', usersRouter);
}