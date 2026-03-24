import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * WhatsappService — infraestrutura de envio de mensagens WhatsApp.
 *
 * Estado atual: sem provider configurado → loga a mensagem (PENDING).
 *
 * Para ativar envio real, configure as variáveis de ambiente e
 * descomente o bloco do provider desejado:
 *
 *   TWILIO:   WHATSAPP_PROVIDER=twilio  TWILIO_ACCOUNT_SID=...  TWILIO_AUTH_TOKEN=...  TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
 *   ZENVIA:   WHATSAPP_PROVIDER=zenvia  ZENVIA_TOKEN=...  ZENVIA_FROM=...
 */
@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private readonly provider: string;

  constructor(private readonly config: ConfigService) {
    this.provider = config.get<string>('WHATSAPP_PROVIDER') || 'none';
  }

  /**
   * Envia uma mensagem WhatsApp para um número em formato E.164 (+5511999999999).
   * Retorna 'sent' se enviado com sucesso, 'pending' se sem provider configurado.
   */
  async send(phone: string, message: string): Promise<'sent' | 'pending'> {
    if (this.provider === 'twilio') {
      return this.sendViaTwilio(phone, message);
    }

    if (this.provider === 'zenvia') {
      return this.sendViaZenvia(phone, message);
    }

    // Sem provider: loga e retorna pending (comportamento padrão em dev/staging)
    this.logger.log(
      `[WhatsApp PENDING] Para: ${phone} | Mensagem: ${message.substring(0, 80)}...`,
    );
    return 'pending';
  }

  // ─── Twilio ──────────────────────────────────────────────────────────────

  private async sendViaTwilio(
    phone: string,
    message: string,
  ): Promise<'sent' | 'pending'> {
    try {
      const accountSid = this.config.getOrThrow('TWILIO_ACCOUNT_SID');
      const authToken = this.config.getOrThrow('TWILIO_AUTH_TOKEN');
      const from = this.config.getOrThrow('TWILIO_WHATSAPP_FROM'); // ex: whatsapp:+14155238886

      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            From: from,
            To: `whatsapp:${phone}`,
            Body: message,
          }),
        },
      );

      if (!response.ok) {
        this.logger.error(
          `[Twilio] Falha ao enviar para ${phone}: ${response.statusText}`,
        );
        return 'pending';
      }

      this.logger.log(`[Twilio] Mensagem enviada para ${phone}`);
      return 'sent';
    } catch (err) {
      this.logger.error(`[Twilio] Erro: ${err}`);
      return 'pending';
    }
  }

  // ─── Zenvia ──────────────────────────────────────────────────────────────

  private async sendViaZenvia(
    phone: string,
    message: string,
  ): Promise<'sent' | 'pending'> {
    try {
      const token = this.config.getOrThrow('ZENVIA_TOKEN');
      const from = this.config.getOrThrow('ZENVIA_FROM');

      const response = await fetch(
        'https://api.zenvia.com/v2/channels/whatsapp/messages',
        {
          method: 'POST',
          headers: {
            'X-API-Token': token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from,
            to: phone.replace('+', ''),
            contents: [{ type: 'text', text: message }],
          }),
        },
      );

      if (!response.ok) {
        this.logger.error(
          `[Zenvia] Falha ao enviar para ${phone}: ${response.statusText}`,
        );
        return 'pending';
      }

      this.logger.log(`[Zenvia] Mensagem enviada para ${phone}`);
      return 'sent';
    } catch (err) {
      this.logger.error(`[Zenvia] Erro: ${err}`);
      return 'pending';
    }
  }
}
