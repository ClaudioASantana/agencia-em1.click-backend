import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

interface MailUser {
  email: string;
  name?: string | null;
}

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendUserConfirmation(user: MailUser, token: string) {
    const url = `${this.configService.get('API_URL')}/auth/verify-email?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Bem-vindo ao Agência em 1 Click! Confirme seu e-mail',
      context: {
        name: user.name || 'Usuário',
        url,
      },
      html: `
        <h1>Olá ${user.name || 'Usuário'}!</h1>
        <p>Por favor, clique no link abaixo para confirmar seu e-mail:</p>
        <p><a href="${url}">Confirmar E-mail</a></p>
        <p>Se você não solicitou este e-mail, pode ignorá-lo.</p>
      `,
    });
  }

  async sendPasswordReset(user: MailUser, token: string) {
    const url = `${this.configService.get('API_URL')}/auth/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Recuperação de Senha - Agência em 1 Click',
      html: `
        <h1>Recuperação de Senha</h1>
        <p>Você solicitou a recuperação de sua senha.</p>
        <p>Clique no link abaixo para definir uma nova senha:</p>
        <p><a href="${url}">Recuperar Senha</a></p>
        <p>Este link expira em 1 hora.</p>
      `,
    });
  }
}
