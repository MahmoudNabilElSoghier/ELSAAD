import { mkdir, readFile, unlink, writeFile, access } from "node:fs/promises";
import { constants } from "node:fs";
import { dirname, normalize, resolve, sep } from "node:path";
import { ConflictException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { ObjectLockOptions, StoredObject, StorageProvider } from "./storage.types";

// Dev fallback: files on local disk. Keys always map under UPLOAD_DIR; any
// traversal attempt (../) is rejected. Served read-only by StorageController.
@Injectable()
export class LocalStorageProvider implements StorageProvider {
  readonly driver = "local" as const;
  private readonly root: string;

  constructor(config: ConfigService) {
    this.root = resolve(
      process.cwd(),
      config.get<string>("STORAGE_UPLOAD_DIR", "./uploads"),
    );
  }

  private resolveKey(key: string): string {
    const target = resolve(this.root, normalize(key));
    if (target !== this.root && !target.startsWith(this.root + sep)) {
      throw new ConflictException("invalid storage key");
    }
    return target;
  }

  async putObject(
    key: string,
    data: Buffer,
    contentType: string,
    lock?: ObjectLockOptions,
  ): Promise<StoredObject> {
    void lock; // local driver: write-once below is the immutability stand-in
    const path = this.resolveKey(key);
    try {
      await access(path, constants.F_OK);
      throw new ConflictException(`object already exists: ${key} (immutable)`);
    } catch (error) {
      if ((error as { status?: number }).status !== undefined) throw error;
      // ENOENT — good, the key is fresh
    }
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, data);
    return { key, size: data.length, contentType };
  }

  async getDownloadUrl(key: string, expiresInSeconds = 300): Promise<string> {
    void expiresInSeconds; // local URLs do not expire — MinIO driver signs TTLs
    const base =
      process.env.STORAGE_PUBLIC_BASE_URL ??
      `http://localhost:${process.env.API_PORT ?? 4000}/api`;
    return `${base}/storage/local/${key.split("/").map(encodeURIComponent).join("/")}`;
  }

  async deleteObject(key: string): Promise<void> {
    try {
      await unlink(this.resolveKey(key));
    } catch {
      // already gone — idempotent delete
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await mkdir(this.root, { recursive: true });
      return true;
    } catch {
      return false;
    }
  }

  async readFile(key: string): Promise<Buffer> {
    return readFile(this.resolveKey(key));
  }
}
