import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { CreateUserSchema } from "../dto/user.schema";

export class UserController {
  constructor(private readonly userService: UserService) {}

  async list(_req: Request, res: Response, _next: NextFunction) {
    const data = await this.userService.list();
    return res.status(200).json(data);
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const payload = CreateUserSchema.parse(req.body);
    const result = await this.userService.create(payload);
    return res.status(201).json(result);
  }
}