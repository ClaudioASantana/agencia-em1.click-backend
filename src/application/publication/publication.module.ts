import { Module } from '@nestjs/common';
import { PublicationService } from './publication.service';
import { PublicationController } from './publication.controller';
import { PlanModule } from '../plans/plan.module';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { MailModule } from '../../infrastructure/mail/mail.module';
import { WhatsappModule } from '../../infrastructure/whatsapp/whatsapp.module';

@Module({
  imports: [PrismaModule, PlanModule, MailModule, WhatsappModule],
  controllers: [PublicationController],
  providers: [PublicationService],
})
export class PublicationModule {}
