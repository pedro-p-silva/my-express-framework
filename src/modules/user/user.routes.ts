import { Router } from 'express';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { userGuard } from './guards/user.guard';
import { userInterceptor } from './interceptors/user.interceptor';
import {DatabaseModule} from "../../database/database.module";

export const userRouter = Router();

const controller = new UserController(new UserService());

userRouter.post(
    "/",
    userGuard,
    userInterceptor,
    controller.create.bind(controller)
);