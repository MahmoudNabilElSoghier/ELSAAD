import { Controller, Get, NotFoundException, Param, Query } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ModelsService } from "./models.service";

@ApiTags("models")
@Controller("models")
export class ModelsController {
  constructor(private readonly models: ModelsService) {}

  @Get()
  @ApiQuery({ name: "brandSlug", required: false })
  @ApiOperation({ summary: "Machine models (optionally filtered by brand slug)" })
  getModels(@Query("brandSlug") brandSlug?: string) {
    return this.models.getModels(brandSlug || undefined);
  }

  @Get(":brandSlug/:modelSlug")
  @ApiParam({ name: "brandSlug" })
  @ApiParam({ name: "modelSlug" })
  @ApiOperation({ summary: "Model detail with compatible products" })
  async getModel(
    @Param("brandSlug") brandSlug: string,
    @Param("modelSlug") modelSlug: string,
  ) {
    const result = await this.models.getModelBySlug(brandSlug, modelSlug);
    if (!result.data) {
      throw new NotFoundException(`Model "${brandSlug}/${modelSlug}" not found`);
    }
    return result;
  }
}
