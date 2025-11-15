import { Router } from 'express';
import { WelcomeController } from './controllers/welcome.controller';
import { WelcomeService } from './services/welcome.service';
import { welcomeGuard } from './guards/welcome.guard';
import { welcomeInterceptor } from './interceptors/welcome.interceptor';
import {DatabaseModule} from "../../database/database.module";

export const welcomeRouter = Router();

const controller = new WelcomeController(new WelcomeService());

welcomeRouter.get(
    '/',
    welcomeGuard,
    welcomeInterceptor,
    controller.index.bind(controller)
);

welcomeRouter.get("/test-db", async (_req, res) => {
    const db = await DatabaseModule.getConnection();
    const ent = db.entityMetadatas.map((e) => e.name);
    res.json({ entities: ent });
});