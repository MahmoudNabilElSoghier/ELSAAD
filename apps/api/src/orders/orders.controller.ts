import { Controller, Get, NotFoundException, Param, Query } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { OrdersService, type OrderFilter } from "./orders.service";

@ApiTags("orders")
@Controller("orders")
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Get()
  @ApiQuery({ name: "status", required: false })
  @ApiQuery({ name: "page", required: false })
  @ApiQuery({ name: "pageSize", required: false })
  @ApiOperation({ summary: "Paginated order list (newest first)" })
  getOrders(
    @Query("status") status?: string,
    @Query("page") page?: string,
    @Query("pageSize") pageSize?: string,
  ) {
    const filter: OrderFilter = {
      status: status || undefined,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    };
    return this.orders.getOrders(filter);
  }

  @Get(":id")
  @ApiParam({ name: "id" })
  @ApiOperation({ summary: "Order detail with items" })
  async getById(@Param("id") id: string) {
    const result = await this.orders.getOrderById(id);
    if (!result.data) throw new NotFoundException(`Order "${id}" not found`);
    return result;
  }
}
