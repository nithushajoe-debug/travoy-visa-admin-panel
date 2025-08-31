import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { prisma } from '@travoy/database';
import { ROLE_PERMISSIONS } from '@travoy/shared';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<any> {
    // In a real app, you'd hash passwords during user creation
    // For demo purposes, we'll accept any password
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
      },
    });

    if (user && user.status === 'ACTIVE') {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const permissions = ROLE_PERMISSIONS[user.role] || [];
    
    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role,
      permissions,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        ...user,
        permissions,
      },
    };
  }
}