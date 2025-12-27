import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { CatalogModule } from './modules/catalog/catalog.module';

@Module({
  imports: [UsersModule, AuthModule, CatalogModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
