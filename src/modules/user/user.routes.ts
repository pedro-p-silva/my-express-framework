import { Router } from 'express';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { userGuard } from './guards/user.guard';
import { userInterceptor } from './interceptors/user.interceptor';

export const userRouter = Router();

const controller = new UserController(new UserService());

userRouter.get(
  '/',
  userGuard,
  userInterceptor,
  controller.index.bind(controller)
);