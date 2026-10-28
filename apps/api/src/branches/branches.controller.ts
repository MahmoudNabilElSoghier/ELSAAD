import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiHeader, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { createBranchSchema, type CreateBranchInput } from "@elsaad/shared";
import { AdminApiKeyGuard } from "../common/guards/admin-api-key.guard";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { BranchesService } from "./branches.service";

@ApiTags("branches")
@Controller("branches")
export class BranchesController {
  constructor(private readonly branches: BranchesService) {}

  @Get()
  @ApiOperation({ summary: "List branches (ordered, with counts)" })
  getBranches() {
    return this.branches.getBranches();
  }

  @Get(":slug")
  @ApiParam({ name: "slug" })
  @ApiOperation({ summary: "Branch by slug with its inventory" })
  async getBySlug(@Param("slug") slug: string) {
    const result = await this.branches.getBranchBySlug(slug);
    if (!result.data) throw new NotFoundException(`Branch "${slug}" not found`);
    return result;
  }

  @Post()
  @UseGuards(AdminApiKeyGuard)
  @ApiHeader({ name: "x-admin-api-key", required: false })
  @ApiOperation({ summary: "Create branch (admin, requires x-admin-api-key)" })
  create(
    @Body(new ZodValidationPipe(createBranchSchema)) body: CreateBranchInput,
  ) {
    return this.branches.create(body);
  }
}
