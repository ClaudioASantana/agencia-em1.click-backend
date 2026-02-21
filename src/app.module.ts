import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
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

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ConfigModule.forRoot({ isGlobal: true }),
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
