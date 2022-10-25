import { DatabaseModule } from './../../database/database.module';
import { ConfigModule } from './../../configs/configs.module';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';

@Module({
  imports: [DatabaseModule, ConfigModule],
  controllers: [UsersController]
})
export class UsersModule {}
