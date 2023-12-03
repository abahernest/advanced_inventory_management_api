import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorEntity } from '../vendor/entities/vendor.entity';
import { ProductEntity } from '../product/entities/product.entity';
import { InventoryEntity } from '../inventory/entities/inventory.entity';
import { SalesEntity } from '../sales/entities/sales.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const [, username, password, host, database] = [
          configService.get<string>('NODE_ENV'),
          configService.get<string>('DATABASE_USER'),
          configService.get<string>('DATABASE_PASSWORD'),
          configService.get<string>('DATABASE_HOST'),
          configService.get<string>('DATABASE_NAME'),
        ];

        return {
          type: 'postgres',
          url: `postgres://${username}:${password}@${host}:5432/${database}`,
          retryAttempts: 2,
          useUTC: true,
          entities: [VendorEntity, ProductEntity, InventoryEntity, SalesEntity],
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
