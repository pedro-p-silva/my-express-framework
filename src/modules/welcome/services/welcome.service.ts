import { WelcomeResponseDto } from '../dto/welcome-response.dto';

export class WelcomeService {
    getWelcomeMessage(): WelcomeResponseDto {
        return {
            message: 'Bem-vindo à sua base Express + TypeScript 🚀',
            docsUrl: 'https://sua-docs-ou-swagger-aqui',
            timestamp: new Date().toISOString()
        };
    }
}