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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    CatalogModule,
    EstablishmentModule,
    SegmentModule,
    OfferModule,
    PublicationModule,
    FollowsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
