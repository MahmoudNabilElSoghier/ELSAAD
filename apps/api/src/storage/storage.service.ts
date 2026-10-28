import { Inject, Injectable } from "@nestjs/common";
import { buildDocumentKey } from "./key-builder";
import type { LocalStorageProvider } from "./local.provider";
import type { ObjectLockOptions, StoredObject, StorageProvider } from "./storage.types";

export const STORAGE_PROVIDER = "STORAGE_PROVIDER";

// Thin façade so callers (documents module) depend on one injectable, never on
// the concrete driver. Driver selection happens in StorageModule's factory.
@Injectable()
export class StorageService {
  constructor(
    @Inject(STORAGE_PROVIDER) private readonly provider: StorageProvider,
  ) {}

  get driver(): StorageProvider["driver"] {
    return this.provider.driver;
  }

  putObject(
    key: string,
    data: Buffer,
    contentType: string,
    lock?: ObjectLockOptions,
  ): Promise<StoredObject> {
    return this.provider.putObject(key, data, contentType, lock);
  }

  getDownloadUrl(key: string, expiresInSeconds?: number): Promise<string> {
    return this.provider.getDownloadUrl(key, expiresInSeconds);
  }

  deleteObject(key: string): Promise<void> {
    return this.provider.deleteObject(key);
  }

  healthCheck(): Promise<boolean> {
    return this.provider.healthCheck();
  }

  buildKey(input: { entityType: string; entityId: string; fileName: string }): string {
    return buildDocumentKey(input);
  }

  // Local driver only — used by StorageController to stream files.
  readFile(key: string): Promise<Buffer> {
    if (this.provider.driver !== "local") {
      return Promise.reject(new Error("readFile is only available for the local driver"));
    }
    return (this.provider as LocalStorageProvider).readFile(key);
  }
}
