import { Repository } from "typeorm";
import { DatabaseModule } from "../../../database/database.module";
import { ProductEntity } from "../entities/product.entity";

export interface IProductRepository extends Repository<ProductEntity> {
  findByName(name: string): Promise<ProductEntity | null>;
}

export const productRepository = async (): Promise<IProductRepository> => {
  const dataSource = await DatabaseModule.getConnection();

  return dataSource.getRepository(ProductEntity).extend({
    findByName(name: string) {
      return this.findOne({ where: { name } });
    },
  }) as IProductRepository;
};