import { Router } from 'express';
import {WelcomeController} from "../controller/WelcomeController";

export const welcomeRouter: Router = Router();

welcomeRouter.get('/', WelcomeController.index);