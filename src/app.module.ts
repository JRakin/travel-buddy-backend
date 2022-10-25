import { DatabaseModule } from './database/database.module';
import { Module } from '@nestjs/common';
import { UsersModule } from './domains/users/users.module';

@Module({
  imports: [DatabaseModule, UsersModule],
})
export class AppModule {}
