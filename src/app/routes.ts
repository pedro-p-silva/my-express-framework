import { productRouter } from '../modules/product/product.routes';
import { userRouter } from '../modules/user/user.routes';
import {Application} from 'express';
import {welcomeRouter} from '../modules/welcome/welcome.routes';
import {authRouter} from "../modules/auth/auth.routes";

export function registerRoutes(app: Application) {

    app.use("/api/v1/auth", authRouter);
    app.use('/api/v1/welcome', welcomeRouter);
    app.use('/api/v1/users', userRouter);
    app.use('/api/v1/products', productRouter);
}