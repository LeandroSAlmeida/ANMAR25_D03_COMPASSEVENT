import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    console.log('User password:', user.password);

    if (!user.password) {
      throw new UnauthorizedException('Senha do usuário não encontrada');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Senha inválida');
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
