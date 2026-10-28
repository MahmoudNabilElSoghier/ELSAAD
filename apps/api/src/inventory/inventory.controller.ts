import { Controller, Get, Inject, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { InventoryService } from "./inventory.service";

@ApiTags("inventory")
@Controller("inventory")
export class InventoryController {
  constructor(@Inject(InventoryService) private readonly inventory: InventoryService) {}

  @Get()
  @ApiQuery({ name: "branchId", required: false })
  @ApiOperation({ summary: "Branch inventory rows (optionally one branch)" })
  getInventory(@Query("branchId") branchId?: string) {
    return this.inventory.getInventory(branchId || undefined);
  }

  @Get("low-stock")
  @ApiQuery({ name: "branchId", required: false })
  @ApiOperation({ summary: "Inventory rows at or below their reorder level" })
  getLowStock(@Query("branchId") branchId?: string) {
    return this.inventory.getLowStock(branchId || undefined);
  }
}
