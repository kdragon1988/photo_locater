import { S3Client } from "@aws-sdk/client-s3";

/**
 * AWS S3クライアントの設定
 */
export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

/**
 * S3バケット名
 */
export const BUCKET_NAME = process.env.AWS_S3_BUCKET!; 