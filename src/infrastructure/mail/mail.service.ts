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

  async sendNewCampaignAlert(
    emails: string[],
    publication: { title: string; description?: string | null },
    establishment: { name: string; slug: string },
  ) {
    const vitrineUrl =
      this.configService.get<string>('VITRINE_URL') ??
      'https://vitrine.amorimdev.cloud';
    const storeUrl = `${vitrineUrl}/catalog?agency=${establishment.slug}`;

    await this.mailerService.sendMail({
      to: emails,
      subject: `Nova campanha de ${establishment.name} na Agência em 1 Click!`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #2563EB;">🎉 ${establishment.name} tem uma nova campanha!</h2>
          <p style="color: #374151; font-size: 16px;">
            <strong>${publication.title}</strong>${publication.description ? ` — ${publication.description}` : ''}
          </p>
          <p style="color: #6B7280;">Você está recebendo este e-mail porque segue esta loja na Vitrine.</p>
          <a href="${storeUrl}"
            style="display:inline-block;margin-top:16px;padding:12px 24px;background:#2563EB;color:white;border-radius:8px;text-decoration:none;font-weight:bold;">
            Ver Ofertas da Loja
          </a>
          <hr style="margin-top:32px;border:none;border-top:1px solid #E5E7EB;" />
          <p style="color:#9CA3AF;font-size:12px;">
            Para não receber mais estes avisos, acesse sua conta na vitrine e desative as notificações.
          </p>
        </div>
      `,
    });
  }
}
