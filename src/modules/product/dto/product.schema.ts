import { z } from "zod";

export const CreateProductSchema = z.object({
  // name: z.string().min(2),
});

export const UpdateProductSchema = CreateProductSchema.partial();