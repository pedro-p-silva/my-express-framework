import { Router } from 'express';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { userInterceptor } from './interceptors/user.interceptor';
import { authGuard } from "../auth/guards/auth.guard";

export const userRouter = Router();

const controller = new UserController(new UserService());

userRouter.post("/", userInterceptor, controller.create.bind(controller));
userRouter.get("/", authGuard, controller.list.bind(controller));