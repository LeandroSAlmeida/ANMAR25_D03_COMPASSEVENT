import 'dotenv/config';
import { CreateUser } from '../db/users/create-user';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserRole } from '../users/enums/userRole.enum';
import { UserStatus } from '../users/enums/userStatus.enum';

async function runSeed() {
  const createUserService = new CreateUser();

  const userDto: CreateUserDto = {
    name: process.env.DEFAULT_USER_NAME || 'Organizador Seed',
    email: process.env.DEFAULT_USER_EMAIL || 'organizador@seed.com',
    password: process.env.DEFAULT_USER_PASSWORD || 'SenhaForte123!',
    phone: process.env.DEFAULT_USER_PHONE || '+5511999999999',
    profileImageUrl:
      process.env.DEFAULT_USER_IMAGE || 'https://meusite.com/imagem.png',
    role: UserRole.ORGANIZADOR,
    isActive: UserStatus.active,
  };

  try {
    const user = await createUserService.execute(userDto);
    console.log('User seed created:', user);
  } catch (error: any) {
    if (error.message.includes('E-mail already in use')) {
      console.log('User seed already existing.');
    } else {
      console.error('Error to create user seed:', error);
    }
  }
}

runSeed();
