import { Router } from "express";
import { ProductController } from "./controllers/product.controller";
import { ProductService } from "./services/product.service";
import { productGuard } from "./guards/product.guard";
import { productInterceptor } from "./interceptors/product.interceptor";

export const productRouter = Router();

const controller = new ProductController(new ProductService());

productRouter.get(
  "/",
  productGuard,
  productInterceptor,
  controller.index.bind(controller)
);

// Exemplo de rota POST usando Zod + Service (descomente se quiser usar)
// productRouter.post(
//   "/",
//   productGuard,
//   productInterceptor,
//   controller.create.bind(controller)
// );