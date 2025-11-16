import { UserRepository } from "../repositories/user.repository";
import { CreateUserDto } from "../dto/user-create.dto";
import {UserMapper} from "../mappers/user.mapper";
import {UserResponseDto} from "../dto/user-response";
import argon2 from "argon2";

export class UserService {

  async list(): Promise<UserResponseDto[]> {
    const repo = await UserRepository();
    const result = await repo.find();

    return result.map(UserMapper.toResponse);
  }

  async create(data: CreateUserDto): Promise<UserResponseDto> {
    const repo = await UserRepository();

    if (await repo.existsByEmail(data.email)) {
      throw new Error("Email already exists.");
    }

    const hashedPassword = await argon2.hash(data.password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 5,
      parallelism: 1,
    });

    const user = repo.create({
      ...data,
      password: hashedPassword,
    });

    const saved = await repo.save(user);

    return UserMapper.toResponse(saved)
  }
}