import {
  CreateBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  PutObjectRetentionCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { ObjectLockOptions, StoredObject, StorageProvider } from "./storage.types";

@Injectable()
export class MinioStorageProvider implements StorageProvider, OnModuleInit {
  readonly driver = "minio" as const;
  private readonly logger = new Logger(MinioStorageProvider.name);
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor(config: ConfigService) {
    const endpoint = config.get<string>("MINIO_ENDPOINT", "localhost");
    const port = config.get<number>("MINIO_PORT", 9000);
    const useSsl = config.get<string>("MINIO_USE_SSL", "false") === "true";
    this.bucket = config.get<string>("MINIO_BUCKET", "elsaad-documents");
    this.client = new S3Client({
      endpoint: `${useSsl ? "https" : "http"}://${endpoint}:${port}`,
      region: "us-east-1",
      forcePathStyle: true, // required by MinIO
      credentials: {
        accessKeyId: config.get<string>("MINIO_ACCESS_KEY", "minioadmin"),
        secretAccessKey: config.get<string>("MINIO_SECRET_KEY", "minioadmin"),
      },
    });
  }

  async onModuleInit(): Promise<void> {
    await this.ensureBucket();
  }

  private async ensureBucket(): Promise<void> {
    try {
      await this.client.send(new HeadBucketCommand({ Bucket: this.bucket }));
    } catch {
      try {
        await this.client.send(
          new CreateBucketCommand({
            Bucket: this.bucket,
            // Enable object lock at bucket creation (cannot be added later) so
            // specific documents can be made immutable via COMPLIANCE retention.
            ObjectLockEnabledForBucket: true,
          }),
        );
        this.logger.log(`created bucket "${this.bucket}" (object lock enabled)`);
      } catch (error) {
        // Another replica may have created it concurrently — re-check.
        try {
          await this.client.send(new HeadBucketCommand({ Bucket: this.bucket }));
        } catch {
          this.logger.warn(
            `bucket "${this.bucket}" unavailable: ${error instanceof Error ? error.message : String(error)}`,
          );
        }
      }
    }
  }

  async putObject(
    key: string,
    data: Buffer,
    contentType: string,
    lock?: ObjectLockOptions,
  ): Promise<StoredObject> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: data,
        ContentType: contentType,
        ...(lock
          ? {
              ObjectLockMode: "COMPLIANCE",
              ObjectLockRetainUntilDate: lock.retainUntilDate,
            }
          : {}),
      }),
    );
    return { key, size: data.length, contentType };
  }

  async getDownloadUrl(key: string, expiresInSeconds = 300): Promise<string> {
    return getSignedUrl(
      this.client,
      new GetObjectCommand({ Bucket: this.bucket, Key: key }),
      { expiresIn: expiresInSeconds },
    );
  }

  async setRetention(key: string, lock: ObjectLockOptions): Promise<void> {
    await this.client.send(
      new PutObjectRetentionCommand({
        Bucket: this.bucket,
        Key: key,
        Retention: {
          Mode: "COMPLIANCE",
          RetainUntilDate: lock.retainUntilDate,
        },
      }),
    );
  }

  async deleteObject(key: string): Promise<void> {
    // NOTE: throws AccessDenied for objects under active COMPLIANCE retention —
    // that is the WORM guarantee working as designed (Phase 8 purge semantics).
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.client.send(new HeadBucketCommand({ Bucket: this.bucket }));
      return true;
    } catch {
      return false;
    }
  }
}
