import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "../prisma/prisma.module";
import { JwtService } from "./jwt.service";
import { RateLimitService } from "./rate-limit.service";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";

@Global()
@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [AuthController],
  providers: [JwtService, RateLimitService, AuthService],
  exports: [JwtService, AuthService],
})
export class AuthModule {}
