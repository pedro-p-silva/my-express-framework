import { BaseController } from './controllers/base.controller';
import { BaseService } from './services/base.service';

export class BaseModule {
    controller = new BaseController(new BaseService());
    service = new BaseService();
}