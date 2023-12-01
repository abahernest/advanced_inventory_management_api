import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import EnvironmentSchema from './environment.schema';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: false,
      isGlobal: true,
      validationSchema: EnvironmentSchema,
    }),
  ],
  providers: [],
  exports: [],
})
export class ConfigurationModule {}
