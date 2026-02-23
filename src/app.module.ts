import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CatalogModule } from './application/catalog/catalog.module';
import { EstablishmentModule } from './application/establishment/establishment.module';
import { SegmentModule } from './application/segment/segment.module';
import { OfferModule } from './application/offer/offer.module';
import { PublicationModule } from './application/publication/publication.module';
import { FollowsModule } from './application/follows/follows.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MailModule } from './infrastructure/mail/mail.module';
import { UploadModule } from './application/upload/upload.module';
import { PlanModule } from './application/plans/plan.module';
import { SubscriptionModule } from './application/subscriptions/subscription.module';
import { AnalyticsModule } from './application/analytics/analytics.module';
import { ShareTokenModule } from './application/share-token/share-token.module';
import { LeadModule } from './application/lead/lead.module';
import { QrCodesModule } from './application/qr-codes/qr-codes.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),
    PrismaModule,
    MailModule,
    UsersModule,
    AuthModule,
    CatalogModule,
    EstablishmentModule,
    SegmentModule,
    OfferModule,
    PublicationModule,
    FollowsModule,
    UploadModule,
    PlanModule,
    SubscriptionModule,
    AnalyticsModule,
    ShareTokenModule,
    LeadModule,
    QrCodesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
