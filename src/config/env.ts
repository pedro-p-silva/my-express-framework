import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
    APP_PORT: z.string().default('3000'),
    APP_ENV: z.enum(['development', 'test', 'production']).default('development'),

    DB_HOST: z.string(),
    DB_PORT: z.string().default('3306'),
    DB_USER: z.string(),
    DB_PASS: z.string(),
    DB_NAME: z.string(),
    DB_TYPE: z.enum(['mysql', 'postgres', 'sqlite', 'mssql']).default('mysql'),

    JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
    JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),
    JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
    JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error('Erro ao validar variáveis de ambiente:', _env.error);
    throw new Error('Invalid environment variables');
}

export const env = _env.data;