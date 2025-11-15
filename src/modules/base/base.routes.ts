import { Router } from 'express';
import { BaseController } from './controllers/base.controller';
import { BaseService } from './services/base.service';
import { baseGuard } from './guards/base.guard';
import { baseInterceptor } from './interceptors/base.interceptor';

export const baseRouter = Router();

const controller = new BaseController(new BaseService());

baseRouter.get(
    '/',
    baseGuard,
    baseInterceptor,
    controller.index.bind(controller)
);