import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { BrandsModule } from "./brands/brands.module";
import { CategoriesModule } from "./categories/categories.module";
import { HealthModule } from "./health/health.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,
    BrandsModule,
    CategoriesModule,
  ],
})
export class AppModule {}
