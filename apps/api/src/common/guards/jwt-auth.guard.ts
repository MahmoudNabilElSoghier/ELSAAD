import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "../../auth/jwt.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(JwtService) private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers["authorization"];
    if (!authHeader || typeof authHeader !== "string") {
      throw new UnauthorizedException("Authentication required (missing Authorization header)");
    }

    const [type, token] = authHeader.split(" ");
    if (type !== "Bearer" || !token) {
      throw new UnauthorizedException("Invalid Authorization header format (expected Bearer <token>)");
    }

    try {
      const payload = this.jwtService.verify(token);
      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException(`Invalid or expired token: ${error instanceof Error ? error.message : "unknown"}`);
    }
  }
}
