import { AppDataSource } from "./data-source";

let initialized = false;

export async function ensureConnection() {
    if (!initialized) {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        initialized = true;
    }

    return AppDataSource;
}