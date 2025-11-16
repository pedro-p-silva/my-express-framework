import { UserRepository } from "../repositories/user.repository";
import { CreateUserDto } from "../dto/user-create.dto";
import {UserMapper} from "../mappers/user.mapper";
import {UserResponseDto} from "../dto/user-response";

export class UserService {

  async list() {
    const repo = await UserRepository();
    return repo.find();
  }

  async create(data: CreateUserDto): Promise<UserResponseDto> {
    const repo = await UserRepository();

    if (await repo.existsByEmail(data.email)) {
      throw new Error("Email already exists.");
    }

    const user = repo.create(data);
    const saved = await repo.save(user);

    return UserMapper.toResponse(saved)
  }

  getMessage() {
    return {
      message: "User module working!",
      timestamp: new Date().toISOString(),
    };
  }
}