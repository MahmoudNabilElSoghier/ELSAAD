import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { BrandsModule } from "./brands/brands.module";
import { BranchesModule } from "./branches/branches.module";
import { CategoriesModule } from "./categories/categories.module";
import { EmployeesModule } from "./employees/employees.module";
import { HealthModule } from "./health/health.module";
import { InventoryModule } from "./inventory/inventory.module";
import { ModelsModule } from "./models/models.module";
import { OrdersModule } from "./orders/orders.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ProductsModule } from "./products/products.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,
    BrandsModule,
    BranchesModule,
    CategoriesModule,
    EmployeesModule,
    InventoryModule,
    ModelsModule,
    OrdersModule,
    ProductsModule,
  ],
})
export class AppModule {}
