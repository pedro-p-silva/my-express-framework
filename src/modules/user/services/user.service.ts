import { UserResponseDto } from '../dto/user-response.dto';

export class UserService {
  getMessage(): UserResponseDto {
    return {
      message: 'User module working!',
      timestamp: new Date().toISOString()
    };
  }
}