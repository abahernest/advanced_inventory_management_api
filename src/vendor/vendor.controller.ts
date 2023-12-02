import { Controller, Post, Body, Inject, Query, Get } from '@nestjs/common';
import { VendorService } from './vendor.service';
import {
  CreateVendorDto,
  PaginatedResponseDto,
  PaginationDto,
  SortDirection,
  SortIndex,
} from './dto/create-vendor.dto';
import { ErrorLogger } from '../utils/error';
import { VendorEntity } from './entities/vendor.entity';

@Controller('vendor')
export class VendorController {
  private readonly logger: ErrorLogger;

  constructor(
    @Inject(VendorService)
    private readonly vendorService: VendorService,
  ) {
    this.logger = new ErrorLogger('VendorController');
  }

  @Post()
  async create(
    @Body() createVendorDto: CreateVendorDto,
  ): Promise<VendorEntity[]> {
    try {
      // bulk insert vendor information
      const vendorIds = await this.vendorService.create(
        createVendorDto.vendors,
      );

      // crate array of vendor ids that was successfully
      // create array of vendor names that weren't created
      const filter = { ids: [], names: [] };
      for (let i = 0; i < vendorIds.length; i += 1) {
        const newVendor = vendorIds[i];
        if (newVendor.id) {
          filter.ids.push(newVendor.id);
        } else {
          // safe from sql injection. The names that failed to insert are already in the database
          filter.names.push(createVendorDto.vendors[i].name.toLowerCase());
        }
      }
      return this.vendorService.findManyByIdOrName(filter.ids, filter.names);
    } catch (e) {
      console.log(e)
      this.logger.handleError('an error occurred while creating vendors', e);
    }
  }

  @Get()
  async findAll(
    @Query('page_number') page_number: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search: string,
    @Query('sort_direction') sort_direction: SortDirection = SortDirection.DESC,
    @Query('sort_index') sort_index: SortIndex = SortIndex.createdAt,
  ): Promise<PaginatedResponseDto> {
    try {
      const paginationDto: PaginationDto = {
        limit: Number(limit),
        page_number: Number(page_number),
        sort_direction,
        sort_index,
      };

      const output: PaginatedResponseDto = {
        meta: {
          limit: paginationDto.limit,
          page_number: paginationDto.page_number,
        },
        data: [],
      };

      if (search) {
        output.data = await this.vendorService.searchVendor(search);
      } else {
        output.data = await this.vendorService.findAll(paginationDto);
      }

      return output;
    } catch (e) {
      this.logger.handleError(
        'an error occurred while fetching all vendors',
        e,
      );
    }
  }
}
