import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../infrastructure/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { MailService } from '../infrastructure/mail/mail.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { establishments: true },
    });

    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: any) {
    // Legacy support: use the first establishment as the "active" one for the token
    const establishments = (user.establishments as any[]) || [];
    const primaryEstId = establishments[0]?.id || null;

    const payload = {
      username: user.email as string,
      name: user.name as string,
      sub: user.id as number,
      establishmentId: primaryEstId,
      role: user.role as string,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id as number,
        name: user.name as string,
        email: user.email as string,
        establishmentId: primaryEstId,
        role: user.role as string,
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
        name: targetUser.name || '',
        sub: targetUser.id,
        establishmentId: establishment.id, // Explicitly set to target est
        role: targetUser.role,
        isImpersonation: true,
      };

      return {
        access_token: await this.jwtService.signAsync(payload),
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
      username: adminUser.username as string,
      name: (adminUser.name || adminUser.username) as string, // Use name if available
      sub: adminUser.userId as number,
      establishmentId: establishment.id,
      role: 'STORE_OWNER', // Acting as owner
      isImpersonation: true,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: adminUser.userId as number,
        name: (adminUser.name ||
          `${adminUser.username as string} (Impersonating)`) as string,
        email: adminUser.username as string,
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

    const establishments = (targetUser.establishments as any[]) || [];
    const primaryEstId = establishments[0]?.id || null;

    // 2. Modify login payload for impersonation
    const payload = {
      username: targetUser.email,
      name: targetUser.name || '',
      sub: targetUser.id,
      establishmentId: primaryEstId,
      role: targetUser.role,
      isImpersonation: true,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: targetUser.id,
        name: targetUser.name,
        email: targetUser.email,
        establishmentId: primaryEstId,
        role: targetUser.role,
      },
    };
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        // @ts-ignore - Prisma client needs local refresh to see new fields
        verificationToken: token,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Token de verificação inválido');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        // @ts-ignore
        emailVerified: true,
        // @ts-ignore
        verificationToken: null,
      },
    });

    return { message: 'E-mail verificado com sucesso!' };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return; // Silent return for security

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExpires: expires,
      },
    });

    // In a real app, send email here.
    try {
      await this.mailService.sendPasswordReset(user, token);
    } catch (error: any) {
      console.error('Failed to send reset password email:', error?.message);
    }

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
