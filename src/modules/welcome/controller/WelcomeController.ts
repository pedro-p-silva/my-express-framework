import { Request, Response, NextFunction } from 'express';
import { WelcomeService } from "../service/WelcomeService";

const welcomeService = new WelcomeService();

export class WelcomeController {
    static index(_req: Request, res: Response, _next: NextFunction) {
        const data = welcomeService.getWelcomeMessage();
        return res.status(200).json(data);
    }
}