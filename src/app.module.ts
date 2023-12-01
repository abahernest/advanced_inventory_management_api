import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigurationModule } from './configuration/configuration.module';

@Module({
  imports: [ConfigurationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
