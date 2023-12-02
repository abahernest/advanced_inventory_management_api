import { Controller, Post, Body, Inject } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from './dto/create-vendor.dto';

@Controller('vendor')
export class VendorController {
  constructor(
    @Inject(VendorService)
    private readonly vendorService: VendorService,
  ) {}

  @Post()
  async create(@Body() createVendorDto: CreateVendorDto) {
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
        filter.names.push(createVendorDto.vendors[i].name);
      }
    }

    return this.vendorService.findManyByIdOrName(filter.ids, filter.names);
  }
}
