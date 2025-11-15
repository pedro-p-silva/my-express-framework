import { Router } from 'express';
import { WelcomeController } from './controllers/welcome.controller';
import { WelcomeService } from './services/welcome.service';
import { welcomeGuard } from './guards/welcome.guard';
import { welcomeInterceptor } from './interceptors/welcome.interceptor';

export const welcomeRouter = Router();

const controller = new WelcomeController(new WelcomeService());

welcomeRouter.get(
    '/',
    welcomeGuard,
    welcomeInterceptor,
    controller.index.bind(controller)
);
