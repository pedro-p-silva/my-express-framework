import { userRouter } from '../modules/user/user.routes';
import {Application} from 'express';
import {welcomeRouter} from '../modules/welcome/welcome.routes';

export function registerRoutes(app: Application) {

    app.use('/api/v1/welcome', welcomeRouter);
    app.use('/api/v1/user', userRouter);
}