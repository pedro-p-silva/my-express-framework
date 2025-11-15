import { BaseResponseDto } from '../dto/base-response.dto';

export class BaseService {
    getMessage(): BaseResponseDto {
        return {
            message: 'Base module working!',
            timestamp: new Date().toISOString()
        };
    }
}