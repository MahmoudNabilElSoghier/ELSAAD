import { Body, Controller, Get, Inject, Post, UseGuards } from "@nestjs/common";
import { ApiHeader, ApiOperation, ApiTags } from "@nestjs/swagger";
import { createEmployeeSchema, type CreateEmployeeInput } from "@elsaad/shared";
import { AdminApiKeyGuard } from "../common/guards/admin-api-key.guard";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { EmployeesService } from "./employees.service";

@ApiTags("employees")
@Controller("employees")
export class EmployeesController {
  constructor(@Inject(EmployeesService) private readonly employees: EmployeesService) {}

  @Get()
  @ApiOperation({ summary: "List employees (ordered by employee number)" })
  getEmployees() {
    return this.employees.getEmployees();
  }

  @Post()
  @UseGuards(AdminApiKeyGuard)
  @ApiHeader({ name: "x-admin-api-key", required: false })
  @ApiOperation({ summary: "Create employee (admin, requires x-admin-api-key)" })
  create(
    @Body(new ZodValidationPipe(createEmployeeSchema)) body: CreateEmployeeInput,
  ) {
    return this.employees.create(body);
  }
}
