import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigurationModule } from './configuration/configuration.module';
import { VendorModule } from './vendor/vendor.module';

@Module({
  imports: [
    ConfigurationModule,
    VendorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
