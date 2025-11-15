import { WelcomeController } from './controllers/welcome.controller';
import { WelcomeService } from './services/welcome.service';

export class WelcomeModule {
    controller = new WelcomeController(new WelcomeService());
    service = new WelcomeService();
}
