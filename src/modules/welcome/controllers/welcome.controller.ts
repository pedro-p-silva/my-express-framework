import { Request, Response, NextFunction } from 'express';
import { WelcomeService } from '../services/welcome.service';

export class WelcomeController {
    constructor(private readonly welcomeService: WelcomeService) {}

    index(_req: Request, res: Response, _next: NextFunction) {
        const data = this.welcomeService.getWelcomeMessage();
        return res.status(200).json(data);
    }
}