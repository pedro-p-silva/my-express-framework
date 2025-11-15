import { Router } from 'express';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { userGuard } from './guards/user.guard';
import { userInterceptor } from './interceptors/user.interceptor';
import {DatabaseModule} from "../../database/database.module";

export const userRouter = Router();

const controller = new UserController(new UserService());

userRouter.get(
  '/',
  userGuard,
  userInterceptor,
  controller.index.bind(controller)
);

userRouter.get("/test-db", async (_req, res) => {
    const db = await DatabaseModule.getConnection();
    const ent = db.entityMetadatas.map((e) => e.name);
    res.json({ entities: ent });
});