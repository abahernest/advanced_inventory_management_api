import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import EnvironmentSchema from './environment.schema';
import { DatabaseModule } from './database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: false,
      isGlobal: true,
      validationSchema: EnvironmentSchema,
    }),
    DatabaseModule,
  ],
  providers: [],
  exports: [ConfigModule, DatabaseModule],
})
export class ConfigurationModule {}
