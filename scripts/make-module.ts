import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

// ----------------------
// Helpers
// ----------------------

// remove plural simples se o cara passar "users"
const singular = (name: string) =>
    name.endsWith('s') ? name.slice(0, -1) : name;

const kebabCase = (name: string) =>
    name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

const pascalCase = (name: string) =>
    name
        .replace(/(^\w|-\w)/g, (m) => m.replace('-', '').toUpperCase())
        .replace(/_/g, '');

// ----------------------
// CLI INPUT
// ----------------------
const rawArg = process.argv[2];

if (!rawArg) {
    console.log(chalk.red('❌ Você deve informar o nome do módulo.'));
    console.log(chalk.yellow('Exemplo: npm run make:module user'));
    process.exit(1);
}

const moduleName = singular(rawArg.toLowerCase()); // user / product
const ClassName = pascalCase(moduleName);          // User / Product
const filePrefix = moduleName;                     // user / product

const moduleFolder = path.join('src', 'modules', moduleName);

if (fs.existsSync(moduleFolder)) {
    console.log(chalk.red(`❌ O módulo '${moduleName}' já existe!`));
    process.exit(1);
}

// ----------------------
// Create folders
// ----------------------
fs.mkdirSync(moduleFolder, { recursive: true });
fs.mkdirSync(path.join(moduleFolder, 'controllers'), { recursive: true });
fs.mkdirSync(path.join(moduleFolder, 'services'), { recursive: true });
fs.mkdirSync(path.join(moduleFolder, 'dto'), { recursive: true });
fs.mkdirSync(path.join(moduleFolder, 'guards'), { recursive: true });
fs.mkdirSync(path.join(moduleFolder, 'interceptors'), { recursive: true });

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
fs.writeFileSync(
    path.join(moduleFolder, 'controllers', `${filePrefix}.controller.ts`),
    controllerTemplate
);
fs.writeFileSync(
    path.join(moduleFolder, 'services', `${filePrefix}.service.ts`),
    serviceTemplate
);
fs.writeFileSync(
    path.join(moduleFolder, 'dto', `${filePrefix}-response.dto.ts`),
    dtoTemplate
);
fs.writeFileSync(
    path.join(moduleFolder, 'guards', `${filePrefix}.guard.ts`),
    guardTemplate
);
fs.writeFileSync(
    path.join(moduleFolder, 'interceptors', `${filePrefix}.interceptor.ts`),
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
// ----------------------
// Auto-register route in src/app/routes.ts
// ----------------------
const routesFilePath = path.join('src', 'app', 'routes.ts');

if (fs.existsSync(routesFilePath)) {
    let content = fs.readFileSync(routesFilePath, 'utf-8');

    const importLine = `import { ${moduleName}Router } from '../modules/${moduleName}/${filePrefix}.routes';`;

    // ---------------------------------------
    // 1. Inserir IMPORT se ainda não existir
    // ---------------------------------------
    if (!content.includes(importLine)) {
        // adicionar sempre antes da 1ª export function, ou no topo se não achar
        const firstExport = content.indexOf('export function registerRoutes');

        if (firstExport !== -1) {
            content = importLine + '\n' + content;
        } else {
            content = importLine + '\n' + content;
        }
    }

    // ---------------------------------------
    // 2. Encontrar função registerRoutes com regex tolerante
    // ---------------------------------------
    const registerFnRegex =
        /export function registerRoutes\s*\([^)]*\)\s*\{([\s\S]*?)\}/m;

    const match = content.match(registerFnRegex);

    if (!match) {
        console.log(chalk.red('❌ Não consegui encontrar registerRoutes.'));
        console.log(chalk.yellow('Adicione manualmente:'));
        console.log(
            chalk.cyan(
                `app.use('/api/v1/${moduleName}' as any, ${moduleName}Router);`
            )
        );
        fs.writeFileSync(routesFilePath, content);
        process.exit(0);
    }

    const fullMatch = match[0];
    const body = match[1]; // tudo entre { ... }

    // ---------------------------------------
    // 3. Identação automática
    // ---------------------------------------
    // Detecta a indentação correta ignorando linhas vazias
    const lines = body.split('\n');

    // encontra a 1ª linha que contenha algo além de espaços
    let detectedIndent = '  '; // fallback
    for (const line of lines) {
        const match = line.match(/^(\s+)\S/); // captura indentação antes do primeiro caractere não-espaço
        if (match) {
            detectedIndent = match[1]; // pega exatamente os espaços/tabs em uso
            break;
        }
    }

    const indent = detectedIndent;

    const useLine = `${indent}app.use('/api/v1/${moduleName}' as any, ${moduleName}Router);\n`;

    // não adicionar duplicado
    if (body.includes(useLine.trim())) {
        fs.writeFileSync(routesFilePath, content);
        console.log(chalk.yellow(`⚠ Rota '/api/v1/${moduleName}' já existia.`));
        process.exit(0);
    }

    const newBody = body.trimEnd() + '\n' + useLine;

    // ---------------------------------------
    // 4. Substituir o bloco inteiro com o novo
    // ---------------------------------------
    const newFn = fullMatch.replace(body, '\n' + newBody);

    content = content.replace(fullMatch, newFn);

    // salvar arquivo
    fs.writeFileSync(routesFilePath, content);

} else {
    console.log(
        chalk.red(
            '❌ Arquivo src/app/routes.ts não encontrado. Crie manualmente.'
        )
    );
}

console.log(chalk.green(`\n✔ Módulo '${moduleName}' criado com sucesso!`));
console.log(chalk.blue(`📁 Pasta: src/modules/${moduleName}/`));
console.log(chalk.green('✔ Rotas registradas (ou instruções exibidas acima).'));