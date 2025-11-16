import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from '../config/env';
import path from "path";
import {ENTITIES} from "./entities";

export const AppDataSource = new DataSource({
    type: env.DB_TYPE as any,
    host: env.DB_HOST,
    port: Number(env.DB_PORT),
    username: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: ENTITIES,
    migrations: [
        path.join(__dirname, "migrations", "*.{ts,js}")
    ],
});
