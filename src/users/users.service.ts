import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateUser } from '../db/users/create-user';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export class UserService {
  private createUser: CreateUser;

  constructor() {
    this.createUser = new CreateUser();
  }

  async createUserService(dto: CreateUserDto) {
    const createUserDto = plainToInstance(CreateUserDto, dto);

    const errors = await validate(createUserDto);

    if (errors.length > 0) {
      throw new Error('Validation failed: ' + JSON.stringify(errors));
    }
    const newUser = await this.createUser.execute(createUserDto);

    return newUser;
  }
}
