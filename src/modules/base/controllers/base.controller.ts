import { Request, Response, NextFunction } from 'express';
import { BaseService } from '../services/base.service';

export class BaseController {
    constructor(private readonly service: BaseService) {}

    index(_req: Request, res: Response, _next: NextFunction) {
        const data = this.service.getMessage();
        return res.status(200).json(data);
    }
}