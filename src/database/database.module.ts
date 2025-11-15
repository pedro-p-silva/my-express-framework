import { AppDataSource } from './data-source';

export class DatabaseModule {
    private static initialized = false;

    static async getConnection() {
        if (!this.initialized) {
            await AppDataSource.initialize();
            this.initialized = true;
            console.log('📦 Database connected (lazy)');
        }
        return AppDataSource;
    }

    static isInitialized() {
        return this.initialized;
    }
}