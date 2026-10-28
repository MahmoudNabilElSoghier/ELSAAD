import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

class HealthResponse {
  status!: string;
  service!: string;
  timestamp!: string;
}

@ApiTags("health")
@Controller("health")
export class HealthController {
  @Get()
  @ApiOperation({ summary: "Liveness probe" })
  @ApiOkResponse({ type: HealthResponse })
  getHealth(): HealthResponse {
    return {
      status: "ok",
      service: "elsaad-api",
      timestamp: new Date().toISOString(),
    };
  }
}
