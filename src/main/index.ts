import "reflect-metadata";
import { createApp } from '../app/app';
import { env } from '../config/env';

async function bootstrap() {
    const app = createApp();

    const port = Number(env.APP_PORT);

    app.listen(port, () => {
        console.log(`🚀 Server running on http://localhost:${port}`);
    });
}

bootstrap();
