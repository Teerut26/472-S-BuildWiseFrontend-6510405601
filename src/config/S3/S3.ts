import { S3Client } from "@aws-sdk/client-s3";

export interface S3Interface {
  url: string;
  accessKey: string;
  secretKey: string;
  api: string;
  path: string;
}

const S3_ENV = JSON.parse(process.env.S3!) as S3Interface;

const s3 = new S3Client({
  credentials: {
    accessKeyId: S3_ENV.accessKey,
    secretAccessKey: S3_ENV.secretKey,
  },
  endpoint: S3_ENV.url,
  forcePathStyle: true,
  region: "ap-southeast-1",
});

export default s3;
