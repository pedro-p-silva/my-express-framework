import { ProductController } from "./controllers/product.controller";
import { ProductService } from "./services/product.service";

export class ProductModule {
  public readonly service: ProductService;
  public readonly controller: ProductController;

  constructor() {
    this.service = new ProductService();
    this.controller = new ProductController(this.service);
  }
}