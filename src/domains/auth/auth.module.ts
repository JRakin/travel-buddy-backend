import { ConfigModule } from './../../configs/configs.module';
import { DatabaseModule } from './../../database/database.module';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';

@Module({
  imports: [DatabaseModule, ConfigModule],
  controllers: [AuthController]
})
export class AuthModule {}
