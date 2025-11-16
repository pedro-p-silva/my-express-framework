import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { CreateUserSchema } from "../dto/user.schema";

export class UserController {
  constructor(private readonly userService: UserService) {}

  async index(_req: Request, res: Response, _next: NextFunction) {
    const data = this.userService.getMessage();
    return res.status(200).json(data);
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = CreateUserSchema.parse(req.body);
      const result = await this.userService.create(payload);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
}