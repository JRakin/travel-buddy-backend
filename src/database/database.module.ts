import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigService } from '../configs/configs.service'

export const DatabaseModule = TypeOrmModule.forRootAsync({
  useFactory: async (configService: ConfigService) => ({
    ...configService.databaseConfig,
    name: `Connection_${Date.now()}`,
  }),
  inject: [ConfigService],
})
