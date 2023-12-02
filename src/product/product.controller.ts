import { Controller, Post, Body } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ErrorLogger } from '../utils/error';

@Controller('product')
export class ProductController {
  logger: ErrorLogger;
  constructor(private readonly productService: ProductService) {
    this.logger = new ErrorLogger('ProductController');
  }

  @Post()
  async bulkCreate(@Body() createProductDto: CreateProductDto) {
    try {
      const productIds = await this.productService.create(
        createProductDto.products,
      );

      // crate array of product ids that was successful
      const idArray = productIds.map((product) => product.id);

      return this.productService.findByIds(idArray);
    } catch (e) {
      this.logger.handleError(`an error occurred while creating products`, e);
    }
  }
}
