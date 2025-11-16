import { productRepository } from "../repositories/product.repository";
import { CreateProductDto } from "../dto/create-product.dto";

export class ProductService {
  async getAll() {
    const repo = await productRepository();
    return repo.find();
  }

  async create(data: CreateProductDto) {
    const repo = await productRepository();
    const entity = repo.create(data as any);
    return repo.save(entity);
  }

  getMessage() {
    return {
      message: "Product module working!",
      timestamp: new Date().toISOString(),
    };
  }
}