import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../infrastructure/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { establishments: true },
    });

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: any) {
    // Legacy support: use the first establishment as the "active" one for the token
    const primaryEstId = user.establishments?.[0]?.id || null;

    const payload = {
      username: user.email,
      name: user.name,
      sub: user.id,
      establishmentId: primaryEstId,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        establishmentId: primaryEstId,
        role: user.role,
      },
    };
  }

  async impersonate(establishmentId: number, adminUser: any) {
    // 1. Find the target establishment
    const establishment = await this.prisma.establishment.findUnique({
      where: { id: establishmentId },
      include: { users: { where: { active: true } } },
    });

    if (!establishment) {
      throw new UnauthorizedException('Establishment not found');
    }

    // 2. Determine target user (first owner or stay as admin with new context)
    const targetUser = establishment.users[0];

    if (targetUser) {
      // Modify login payload for impersonation
      const payload = {
        username: targetUser.email,
        name: targetUser.name,
        sub: targetUser.id,
        establishmentId: establishment.id, // Explicitly set to target est
        role: targetUser.role,
        isImpersonation: true,
      };

      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: targetUser.id,
          name: targetUser.name,
          email: targetUser.email,
          establishmentId: establishment.id,
          role: targetUser.role,
        },
      };
    }

    // 3. Fallback: Generate token for admin but bound to this establishment
    const payload = {
      username: adminUser.username,
      name: adminUser.name || adminUser.username, // Use name if available
      sub: adminUser.userId,
      establishmentId: establishment.id,
      role: 'STORE_OWNER', // Acting as owner
      isImpersonation: true,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: adminUser.userId,
        name: adminUser.name || `${adminUser.username} (Impersonating)`,
        email: adminUser.username,
        establishmentId: establishment.id,
        role: 'STORE_OWNER',
      },
    };
  }

  async impersonateUser(userId: number) {
    // 1. Find the target user
    const targetUser = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { establishments: true },
    });

    if (!targetUser) {
      throw new UnauthorizedException('User not found');
    }

    const primaryEstId = targetUser.establishments?.[0]?.id || null;

    // 2. Modify login payload for impersonation
    const payload = {
      username: targetUser.email,
      name: targetUser.name,
      sub: targetUser.id,
      establishmentId: primaryEstId,
      role: targetUser.role,
      isImpersonation: true,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: targetUser.id,
        name: targetUser.name,
        email: targetUser.email,
        establishmentId: primaryEstId,
        role: targetUser.role,
      },
    };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return; // Silent return for security

    const token =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExpires: expires,
      },
    });

    // In a real app, send email here. For now, we return it or log it.
    console.log(`Reset token for ${email}: ${token}`);
    return {
      message: 'Se o e-mail existir, um link de recuperação foi enviado.',
    };
  }

  async resetPassword(token: string, newPass: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: { gt: new Date() },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Token inválido ou expirado.');
    }

    const hashedPassword = await bcrypt.hash(newPass, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    return { message: 'Senha redefinida com sucesso.' };
  }
}
