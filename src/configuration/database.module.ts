import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        url:
          configService.get<string>('NODE_ENV') === 'test'
            ? configService.get('TEST_DATABASE_URI')
            : configService.get('DATABASE_URI'),
        retryAttempts: 2,
        useUTC: true,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
