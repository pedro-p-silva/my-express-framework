import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';

export class UserController {
  constructor(private readonly userService: UserService) {}

  index(_req: Request, res: Response, _next: NextFunction) {
    const data = this.userService.getMessage();
    return res.status(200).json(data);
  }
}