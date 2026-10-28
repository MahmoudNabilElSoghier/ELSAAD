// Pluggable object storage used by the documents module (Phase 8).
// - "minio": S3-compatible object storage with signed download URLs (production).
// - "local":  plain files under STORAGE_UPLOAD_DIR, served by StorageController
//            (dependency-free dev fallback — same API surface).
export interface StoredObject {
  key: string;
  size: number;
  contentType: string;
}

export interface ObjectLockOptions {
  // WORM protection: when set, the object cannot be overwritten or deleted
  // until retainUntilDate (MinIO/S3 object lock, COMPLIANCE mode).
  retainUntilDate: Date;
}

export interface StorageProvider {
  readonly driver: "minio" | "local";
  putObject(
    key: string,
    data: Buffer,
    contentType: string,
    lock?: ObjectLockOptions,
  ): Promise<StoredObject>;
  // Signed URL (minio, TTL) or public local path (local driver).
  getDownloadUrl(key: string, expiresInSeconds?: number): Promise<string>;
  deleteObject(key: string): Promise<void>;
  healthCheck(): Promise<boolean>;
}
