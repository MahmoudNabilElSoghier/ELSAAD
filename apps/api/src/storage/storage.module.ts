import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LocalStorageProvider } from "./local.provider";
import { MinioStorageProvider } from "./minio.provider";
import { StorageController } from "./storage.controller";
import { STORAGE_PROVIDER, StorageService } from "./storage.service";
import type { StorageProvider } from "./storage.types";

@Global()
@Module({
  controllers: [StorageController],
  providers: [
    StorageService,
    {
      provide: STORAGE_PROVIDER,
      inject: [ConfigService],
      useFactory: (config: ConfigService): StorageProvider => {
        const driver = config.get<string>("STORAGE_DRIVER", "local");
        return driver === "minio"
          ? new MinioStorageProvider(config)
          : new LocalStorageProvider(config);
      },
    },
  ],
  exports: [StorageService],
})
export class StorageModule {}
