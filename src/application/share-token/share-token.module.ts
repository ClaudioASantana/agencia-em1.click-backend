import { Module } from '@nestjs/common';
import { ShareTokenController } from './share-token.controller';
import { ShareTokenService } from './share-token.service';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ShareTokenController],
  providers: [ShareTokenService],
  exports: [ShareTokenService],
})
export class ShareTokenModule {}
