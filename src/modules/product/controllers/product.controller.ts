import { Request, Response, NextFunction } from "express";
import { ProductService } from "../services/product.service";
import { CreateProductSchema } from "../dto/product.schema";

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  async index(_req: Request, res: Response, _next: NextFunction) {
    const data = this.productService.getMessage();
    return res.status(200).json(data);
  }

  // Exemplo de rota de criação usando Zod + Service (descomentando e ajustando):
  //
  // async create(req: Request, res: Response, _next: NextFunction) {
  //   const payload = CreateProductSchema.parse(req.body);
  //   const result = await this.productService.create(payload);
  //   return res.status(201).json(result);
  // }
}