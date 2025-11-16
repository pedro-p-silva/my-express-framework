import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./services/auth.service";
import { TokenService } from "./services/token.service";

export class AuthModule {
    controller = new AuthController();
    service = new AuthService();
    tokenService = TokenService;
}