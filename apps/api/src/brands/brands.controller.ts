import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import {
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { brandFormSchema, type BrandFormValues } from "@elsaad/shared";
import { AdminApiKeyGuard } from "../common/guards/admin-api-key.guard";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { BrandsService } from "./brands.service";

const brandBody = () => new ZodValidationPipe(brandFormSchema);

@ApiTags("brands")
@Controller("brands")
export class BrandsController {
  constructor(private readonly brands: BrandsService) {}

  @Get()
  @ApiOperation({ summary: "List brands (ordered, with model/product counts)" })
  getBrands() {
    return this.brands.getBrands();
  }

  @Get(":slug")
  @ApiParam({ name: "slug", description: "Brand slug" })
  @ApiOperation({ summary: "Brand by slug with its models" })
  async getBySlug(@Param("slug") slug: string) {
    const result = await this.brands.getBrandBySlug(slug);
    if (!result.data) throw new NotFoundException(`Brand "${slug}" not found`);
    return result;
  }

  @Post()
  @UseGuards(AdminApiKeyGuard)
  @ApiHeader({ name: "x-admin-api-key", required: false })
  @ApiOperation({ summary: "Create brand (admin, requires x-admin-api-key)" })
  create(@Body(brandBody()) body: BrandFormValues) {
    return this.brands.create(body);
  }

  @Put(":id")
  @UseGuards(AdminApiKeyGuard)
  @ApiHeader({ name: "x-admin-api-key", required: false })
  @ApiParam({ name: "id" })
  @ApiOperation({ summary: "Update brand (admin, requires x-admin-api-key)" })
  update(@Param("id") id: string, @Body(brandBody()) body: BrandFormValues) {
    return this.brands.update(id, body);
  }

  @Delete(":id")
  @UseGuards(AdminApiKeyGuard)
  @ApiHeader({ name: "x-admin-api-key", required: false })
  @ApiParam({ name: "id" })
  @ApiOperation({ summary: "Delete brand (admin, requires x-admin-api-key)" })
  remove(@Param("id") id: string) {
    return this.brands.remove(id);
  }
}
