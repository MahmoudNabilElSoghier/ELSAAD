import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Res,
  StreamableFile,
} from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import type { Response } from "express";
import { StorageService } from "./storage.service";

// TODO: add authentication before production — local driver URLs are public by
// design (dev convenience); the MinIO driver is preferred in production because
// its signed URLs carry the TTL instead of relying on this route.
@ApiTags("storage")
@Controller("storage")
export class StorageController {
  constructor(@Inject(StorageService) private readonly storage: StorageService) {}

  @Get("local/*")
  @ApiOperation({ summary: "Stream a stored file (local driver only)" })
  @ApiOkResponse({ description: "Raw file bytes" })
  async serveLocal(
    @Param() params: Record<string, string>,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    if (this.storage.driver !== "local") {
      throw new NotFoundException("local file serving is disabled (storage driver is minio)");
    }
    const key = params[0];
    if (!key) throw new NotFoundException();
    let data: Buffer;
    try {
      data = await this.storage.readFile(key);
    } catch {
      throw new NotFoundException(`file not found: ${key}`);
    }
    res.setHeader("content-type", this.guessContentType(key));
    res.setHeader("cache-control", "private, max-age=300");
    return new StreamableFile(data);
  }

  private guessContentType(key: string): string {
    const ext = key.slice(key.lastIndexOf(".") + 1).toLowerCase();
    switch (ext) {
      case "pdf":
        return "application/pdf";
      case "txt":
        return "text/plain; charset=utf-8";
      case "png":
        return "image/png";
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "webp":
        return "image/webp";
      default:
        return "application/octet-stream";
    }
  }
}
