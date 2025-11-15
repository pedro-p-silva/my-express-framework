// scripts/make-module.ts

import fs from "fs";
import path from "path";
import chalk from "chalk";

// ----------------------
// Helpers
// ----------------------

// remove plural if user passes "users"
const singular = (name: string) =>
    name.endsWith("s") ? name.slice(0, -1) : name;

const kebabCase = (name: string) =>
    name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

const pascalCase = (name: string) =>
    name
        .replace(/(^\w|-\w)/g, (m) => m.replace("-", "").toUpperCase())
        .replace(/_/g, "");

// ----------------------
// CLI INPUT
// ----------------------
const moduleNameArg = process.argv[2];

if (!moduleNameArg) {
    console.log(chalk.red("❌ Você deve informar o nome do módulo."));
    console.log(chalk.yellow("Exemplo: npm run make:module user"));
    process.exit(1);
}

const moduleName = singular(moduleNameArg.toLowerCase());
const moduleFolder = path.join("src", "modules", moduleName);

if (fs.existsSync(moduleFolder)) {
    console.log(chalk.red(`❌ O módulo '${moduleName}' já existe!`));
    process.exit(1);
}

const ClassName = pascalCase(moduleName);
const filePrefix = moduleName; // ex: user, product
const folder = moduleFolder;

// ----------------------
// Create folders
// ----------------------
fs.mkdirSync(folder, { recursive: true });
fs.mkdirSync(path.join(folder, "controllers"), { recursive: true });
fs.mkdirSync(path.join(folder, "services"), { recursive: true });
fs.mkdirSync(path.join(folder, "dto"), { recursive: true });
fs.mkdirSync(path.join(folder, "guards"), { recursive: true });
fs.mkdirSync(path.join(folder, "interceptors"), { recursive: true });

// ----------------------
// Templates
// ----------------------

const controllerTemplate = `
import { Request, Response, NextFunction } from 'express';
import { ${ClassName}Service } from '../services/${filePrefix}.service';

export class ${ClassName}Controller {
  constructor(private readonly ${moduleName}Service: ${ClassName}Service) {}

  index(_req: Request, res: Response, _next: NextFunction) {
    const data = this.${moduleName}Service.getMessage();
    return res.status(200).json(data);
  }
}
`.trim();

const serviceTemplate = `
import { ${ClassName}ResponseDto } from '../dto/${filePrefix}-response.dto';

export class ${ClassName}Service {
  getMessage(): ${ClassName}ResponseDto {
    return {
      message: '${ClassName} module working!',
      timestamp: new Date().toISOString()
    };
  }
}
`.trim();

const dtoTemplate = `
export interface ${ClassName}ResponseDto {
  message: string;
  timestamp: string;
}
`.trim();

const guardTemplate = `
import { Request, Response, NextFunction } from 'express';

export function ${moduleName}Guard(req: Request, res: Response, next: NextFunction) {
  if (req.headers['x-block']) {
    return res.status(403).json({ error: 'Access denied by ${ClassName}Guard' });
  }
  next();
}
`.trim();

const interceptorTemplate = `
import { Request, Response, NextFunction } from 'express';

export function ${moduleName}Interceptor(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const originalSend = res.send.bind(res);

  res.send = (body?: any) => {
    const ms = Date.now() - start;
    res.setHeader('X-Response-Time', \`\${ms}ms\`);
    return originalSend(body);
  };

  next();
}
`.trim();

const routesTemplate = `
import { Router } from 'express';
import { ${ClassName}Controller } from './controllers/${filePrefix}.controller';
import { ${ClassName}Service } from './services/${filePrefix}.service';
import { ${moduleName}Guard } from './guards/${filePrefix}.guard';
import { ${moduleName}Interceptor } from './interceptors/${filePrefix}.interceptor';

export const ${moduleName}Router = Router();

const controller = new ${ClassName}Controller(new ${ClassName}Service());

${moduleName}Router.get(
  '/',
  ${moduleName}Guard,
  ${moduleName}Interceptor,
  controller.index.bind(controller)
);
`.trim();

const moduleTemplate = `
import { ${ClassName}Controller } from './controllers/${filePrefix}.controller';
import { ${ClassName}Service } from './services/${filePrefix}.service';

export class ${ClassName}Module {
  controller = new ${ClassName}Controller(new ${ClassName}Service());
  service = new ${ClassName}Service();
}
`.trim();

// ----------------------
// Create files
// ----------------------
fs.writeFileSync(path.join(folder, "controllers", `${filePrefix}.controller.ts`), controllerTemplate);
fs.writeFileSync(path.join(folder, "services", `${filePrefix}.service.ts`), serviceTemplate);
fs.writeFileSync(path.join(folder, "dto", `${filePrefix}-response.dto.ts`), dtoTemplate);
fs.writeFileSync(path.join(folder, "guards", `${filePrefix}.guard.ts`), guardTemplate);
fs.writeFileSync(path.join(folder, "interceptors", `${filePrefix}.interceptor.ts`), interceptorTemplate);
fs.writeFileSync(path.join(folder, `${filePrefix}.routes.ts`), routesTemplate);
fs.writeFileSync(path.join(folder, `${filePrefix}.module.ts`), moduleTemplate);

console.log(chalk.green(`\n✔ Módulo '${moduleName}' criado com sucesso!`));
console.log(chalk.blue(`📁 Pasta: src/modules/${moduleName}/`));
console.log(chalk.yellow(`\nLembre de registrar as rotas em src/app/routes.ts:\n`));
console.log(chalk.cyan(`  app.use('/api/v1/${moduleName}', ${moduleName}Router);\n`));