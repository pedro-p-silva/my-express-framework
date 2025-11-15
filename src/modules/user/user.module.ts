import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';

export class UserModule {
  controller = new UserController(new UserService());
  service = new UserService();
}