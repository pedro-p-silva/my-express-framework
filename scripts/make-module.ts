// scripts/make-module.ts
import fs from "fs";
import path from "path";
import chalk from "chalk";

// ----------------------
// Helpers
// ----------------------

// remove plural simples se o cara passar "users"
const singular = (name: string) =>
    name.endsWith("s") ? name.slice(0, -1) : name;

const pascalCase = (name: string) =>
    name
        .replace(/(^\w|-\w|_\w)/g, (m) => m.replace(/[-_]/, "").toUpperCase())
        .replace(/_/g, "");

// plural bem simples pra nome de tabela
const plural = (name: string) =>
    name.endsWith("s") ? name.toLowerCase() : `${name.toLowerCase()}s`;

// ----------------------
// CLI INPUT
// ----------------------
const rawArg = process.argv[2];

if (!rawArg) {
    console.log(chalk.red("❌ Você deve informar o nome do módulo."));
    console.log(chalk.yellow("Exemplo: npm run make:module user"));
    process.exit(1);
}

const moduleName = singular(rawArg.toLowerCase()); // user / product
const ClassName = pascalCase(moduleName);          // User / Product
const filePrefix = moduleName;                     // user / product
const tableName = plural(moduleName);             // users / products

const moduleFolder = path.join("src", "modules", moduleName);

if (fs.existsSync(moduleFolder)) {
    console.log(chalk.red(`❌ O módulo '${moduleName}' já existe!`));
    process.exit(1);
}

// ----------------------
// Create folders
// ----------------------
fs.mkdirSync(moduleFolder, { recursive: true });
fs.mkdirSync(path.join(moduleFolder, "controllers"), { recursive: true });
fs.mkdirSync(path.join(moduleFolder, "services"), { recursive: true });
fs.mkdirSync(path.join(moduleFolder, "dto"), { recursive: true });
fs.mkdirSync(path.join(moduleFolder, "entities"), { recursive: true });
fs.mkdirSync(path.join(moduleFolder, "repositories"), { recursive: true });
fs.mkdirSync(path.join(moduleFolder, "guards"), { recursive: true });
fs.mkdirSync(path.join(moduleFolder, "interceptors"), { recursive: true });

// ----------------------
// Templates
// ----------------------

// Controller com rota mínima (GET /) e exemplo comentado com Zod
const controllerTemplate = `
import { Request, Response, NextFunction } from "express";
import { ${ClassName}Service } from "../services/${filePrefix}.service";
import { Create${ClassName}Schema } from "../dto/${filePrefix}.schema";

export class ${ClassName}Controller {
  constructor(private readonly ${moduleName}Service: ${ClassName}Service) {}

  async index(_req: Request, res: Response, _next: NextFunction) {
    const data = this.${moduleName}Service.getMessage();
    return res.status(200).json(data);
  }

  // Exemplo de rota de criação usando Zod + Service (descomentando e ajustando):
  //
  // async create(req: Request, res: Response, _next: NextFunction) {
  //   const payload = Create${ClassName}Schema.parse(req.body);
  //   const result = await this.${moduleName}Service.create(payload);
  //   return res.status(201).json(result);
  // }
}
`.trim();

// Service usando repository (lazy) e tendo um getMessage básico
const serviceTemplate = `
import { ${moduleName}Repository } from "../repositories/${filePrefix}.repository";
import { Create${ClassName}Dto } from "../dto/create-${filePrefix}.dto";

export class ${ClassName}Service {
  async getAll() {
    const repo = await ${moduleName}Repository();
    return repo.find();
  }

  async create(data: Create${ClassName}Dto) {
    const repo = await ${moduleName}Repository();
    const entity = repo.create(data as any);
    return repo.save(entity);
  }

  getMessage() {
    return {
      message: "${ClassName} module working!",
      timestamp: new Date().toISOString(),
    };
  }
}
`.trim();

// DTOs como interfaces
const dtoCreateTemplate = `
export interface Create${ClassName}Dto {
  // Defina os campos principais do módulo aqui
  // Exemplo:
  // name: string;
}
`.trim();

const dtoUpdateTemplate = `
import { Create${ClassName}Dto } from "./create-${filePrefix}.dto";

export interface Update${ClassName}Dto extends Partial<Create${ClassName}Dto> {}
`.trim();

// Schemas Zod
const schemaTemplate = `
import { z } from "zod";

export const Create${ClassName}Schema = z.object({
  // name: z.string().min(2),
});

export const Update${ClassName}Schema = Create${ClassName}Schema.partial();
`.trim();

// Entity herdando BaseModel
const entityTemplate = `
import { Entity, Column } from "typeorm";
import { BaseModel } from "../../../database/base.model"

@Entity("${tableName}")
export class ${ClassName}Entity extends BaseModel {
  @Column({ nullable: true })
  name?: string;
}
`.trim();

// Repository dinâmico (lazy) usando DatabaseModule
const repositoryTemplate = `
import { Repository } from "typeorm";
import { DatabaseModule } from "../../../database/database.module";
import { ${ClassName}Entity } from "../entities/${filePrefix}.entity";

export interface I${ClassName}Repository extends Repository<${ClassName}Entity> {
  findByName(name: string): Promise<${ClassName}Entity | null>;
}

export const ${moduleName}Repository = async (): Promise<I${ClassName}Repository> => {
  const dataSource = await DatabaseModule.getConnection();

  return dataSource.getRepository(${ClassName}Entity).extend({
    findByName(name: string) {
      return this.findOne({ where: { name } });
    },
  }) as I${ClassName}Repository;
};
`.trim();

// Guard simples
const guardTemplate = `
import { Request, Response, NextFunction } from "express";

export function ${moduleName}Guard(_req: Request, _res: Response, next: NextFunction) {
  // Exemplo: adicionar lógica de autorização aqui
  // if (!req.headers["x-api-key"]) return res.status(401).json({ error: "Unauthorized" });
  next();
}
`.trim();

// Interceptor de tempo de resposta
const interceptorTemplate = `
import { Request, Response, NextFunction } from "express";

export function ${moduleName}Interceptor(_req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const originalSend = res.send.bind(res);

  res.send = (body?: any) => {
    const ms = Date.now() - start;
    res.setHeader("X-Response-Time", \`\${ms}ms\`);
    return originalSend(body);
  };

  next();
}
`.trim();

// Rotas – rota mínima GET /
const routesTemplate = `
import { Router } from "express";
import { ${ClassName}Controller } from "./controllers/${filePrefix}.controller";
import { ${ClassName}Service } from "./services/${filePrefix}.service";
import { ${moduleName}Guard } from "./guards/${filePrefix}.guard";
import { ${moduleName}Interceptor } from "./interceptors/${filePrefix}.interceptor";

export const ${moduleName}Router = Router();

const controller = new ${ClassName}Controller(new ${ClassName}Service());

${moduleName}Router.get(
  "/",
  ${moduleName}Guard,
  ${moduleName}Interceptor,
  controller.index.bind(controller)
);

// Exemplo de rota POST usando Zod + Service (descomente se quiser usar)
// ${moduleName}Router.post(
//   "/",
//   ${moduleName}Guard,
//   ${moduleName}Interceptor,
//   controller.create.bind(controller)
// );
`.trim();

// Module organizando controller + service
const moduleTemplate = `
import { ${ClassName}Controller } from "./controllers/${filePrefix}.controller";
import { ${ClassName}Service } from "./services/${filePrefix}.service";

export class ${ClassName}Module {
  public readonly service: ${ClassName}Service;
  public readonly controller: ${ClassName}Controller;

  constructor() {
    this.service = new ${ClassName}Service();
    this.controller = new ${ClassName}Controller(this.service);
  }
}
`.trim();

// ----------------------
// Create files
// ----------------------
fs.writeFileSync(
    path.join(moduleFolder, "controllers", `${filePrefix}.controller.ts`),
    controllerTemplate
);
fs.writeFileSync(
    path.join(moduleFolder, "services", `${filePrefix}.service.ts`),
    serviceTemplate
);
fs.writeFileSync(
    path.join(moduleFolder, "dto", `create-${filePrefix}.dto.ts`),
    dtoCreateTemplate
);
fs.writeFileSync(
    path.join(moduleFolder, "dto", `update-${filePrefix}.dto.ts`),
    dtoUpdateTemplate
);
fs.writeFileSync(
    path.join(moduleFolder, "dto", `${filePrefix}.schema.ts`),
    schemaTemplate
);
fs.writeFileSync(
    path.join(moduleFolder, "entities", `${filePrefix}.entity.ts`),
    entityTemplate
);
fs.writeFileSync(
    path.join(moduleFolder, "repositories", `${filePrefix}.repository.ts`),
    repositoryTemplate
);
fs.writeFileSync(
    path.join(moduleFolder, "guards", `${filePrefix}.guard.ts`),
    guardTemplate
);
fs.writeFileSync(
    path.join(moduleFolder, "interceptors", `${filePrefix}.interceptor.ts`),
    interceptorTemplate
);
fs.writeFileSync(
    path.join(moduleFolder, `${filePrefix}.routes.ts`),
    routesTemplate
);
fs.writeFileSync(
    path.join(moduleFolder, `${filePrefix}.module.ts`),
    moduleTemplate
);

// ----------------------
// Auto-register route in src/app/routes.ts
// ----------------------
const routesFilePath = path.join("src", "app", "routes.ts");

if (fs.existsSync(routesFilePath)) {
    let content = fs.readFileSync(routesFilePath, "utf-8");

    const importLine = `import { ${moduleName}Router } from '../modules/${moduleName}/${filePrefix}.routes';`;

    // 1) garante import
    if (!content.includes(importLine)) {
        content = importLine + "\n" + content;
    }

    // 2) encontrar função registerRoutes com regex tolerante
    const registerFnRegex =
        /export function registerRoutes\s*\(([^)]*)\)\s*\{([\s\S]*?)\}/m;

    const match = content.match(registerFnRegex);

    if (match) {
        const params = match[1];
        const body = match[2];

        // indentação correta (primeira linha com código)
        const lines = body.split("\n");
        let detectedIndent = "  ";
        for (const line of lines) {
            const m = line.match(/^(\s+)\S/);
            if (m) {
                detectedIndent = m[1];
                break;
            }
        }

        const indent = detectedIndent;
        const useLine = `${indent}app.use('/api/v1/${moduleName}', ${moduleName}Router);\n`;

        if (!body.includes(useLine.trim())) {
            const newBody = body.trimEnd() + "\n" + useLine;
            const newFn = `export function registerRoutes(${params}) {\n${newBody}}`;
            content = content.replace(registerFnRegex, newFn);
        }
    } else {
        console.log(
            chalk.yellow(
                `⚠ Não encontrei 'registerRoutes' em ${routesFilePath}. Adicione manualmente:`
            )
        );
        console.log(
            chalk.cyan(
                `  import { ${moduleName}Router } from '../modules/${moduleName}/${filePrefix}.routes';`
            )
        );
        console.log(
            chalk.cyan(
                `  app.use('/api/v1/${moduleName}', ${moduleName}Router);`
            )
        );
    }

    fs.writeFileSync(routesFilePath, content);
} else {
    console.log(
        chalk.yellow(
            `⚠ Arquivo src/app/routes.ts não encontrado. Crie e registre manualmente as rotas.`
        )
    );
}

console.log(chalk.green(`\n✔ Módulo '${moduleName}' criado com sucesso!`));
console.log(chalk.blue(`📁 Pasta: src/modules/${moduleName}/`));
console.log(chalk.green("✔ Rotas registradas (ou instruções exibidas acima)."));