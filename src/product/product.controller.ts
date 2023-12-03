import { Controller, Post, Body, Param, Patch, Get, Query } from "@nestjs/common";
import { ProductService } from './product.service';
import {
  CreateProductDto,
  ProductIdDto,
  UpdateSingleProductDto,
} from './dto/create-product.dto';
import { ErrorLogger } from '../utils/error';
import { PaginatedResponseDto, PaginationDto, SortDirection, SortIndex } from "./dto/create-product.dto";
import { Currency } from './entities/product.entity';

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

  @Patch(':product_id')
  async updateSingleProduct(
    @Param() productIdDto: ProductIdDto,
    @Body() updateProductDto: UpdateSingleProductDto,
  ): Promise<UpdateSingleProductDto> {
    try {
      await this.productService.updateOne(
        productIdDto.product_id,
        updateProductDto,
      );

      return updateProductDto;
    } catch (e) {
      this.logger.handleError(
        `an error occurred while modifying product with id ${productIdDto.product_id}`,
        e,
      );
    }
  }

  @Get()
  async findAll(
    @Query('page_number') page_number: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search: string,
    @Query('sort_direction') sort_direction: SortDirection = SortDirection.DESC,
    @Query('sort_index') sort_index: SortIndex = SortIndex.createdAt,
    @Query('min_price') min_price: string = '0',
    @Query('max_price') max_price: string,
    @Query('currency') currency: Currency = Currency.USD,
  ): Promise<PaginatedResponseDto> {
    try {
      const paginationDto: PaginationDto = {
        limit: Number(limit),
        page_number: Number(page_number),
        sort_direction,
        sort_index,
        min_price: Number(min_price),
        max_price: Number(max_price),
        currency,
      };

      const output: PaginatedResponseDto = {
        meta: {
          limit: paginationDto.limit,
          page_number: paginationDto.page_number,
        },
        data: [],
      };

      if (search) {
        output.data = await this.productService.searchProducts(search);
      } else {
        output.data = await this.productService.findAll(paginationDto);
      }

      return output;
    } catch (e) {
      this.logger.handleError(
        'an error occurred while fetching all products',
        e,
      );
    }
  }
}
