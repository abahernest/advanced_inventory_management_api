import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigurationModule } from './configuration/configuration.module';
import { VendorModule } from './vendor/vendor.module';
import { ProductModule } from './product/product.module';
import { InventoryModule } from './inventory/inventory.module';

@Module({
  imports: [ConfigurationModule, VendorModule, ProductModule, InventoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
