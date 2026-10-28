import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { BrandsModule } from "./brands/brands.module";
import { BranchesModule } from "./branches/branches.module";
import { CategoriesModule } from "./categories/categories.module";
import { DocumentsModule } from "./documents/documents.module";
import { EmployeesModule } from "./employees/employees.module";
import { HealthModule } from "./health/health.module";
import { InventoryModule } from "./inventory/inventory.module";
import { ModelsModule } from "./models/models.module";
import { OrdersModule } from "./orders/orders.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ProductsModule } from "./products/products.module";
import { StorageModule } from "./storage/storage.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    StorageModule,
    HealthModule,
    BrandsModule,
    BranchesModule,
    CategoriesModule,
    DocumentsModule,
    EmployeesModule,
    InventoryModule,
    ModelsModule,
    OrdersModule,
    ProductsModule,
  ],
})
export class AppModule {}
