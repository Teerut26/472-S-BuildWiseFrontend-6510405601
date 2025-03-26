/* eslint-disable @typescript-eslint/no-unsafe-argument */
import fileUpload from "express-fileupload";
import { type NextApiRequest, type NextApiResponse } from "next";
import nc from "next-connect";
import s3 from "../../config/S3/S3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
export interface FileUploadRequest extends NextApiRequest {
  files: File1;
}

type File1 = Record<string, unknown>;

const handler = nc<FileUploadRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found");
  },
})
  .use(fileUpload())
  .post(async (req, res) => {
    const file = req.files.file as fileUpload.UploadedFile;
    
    const extName = file.name.substring(file.name.lastIndexOf(".") + 1).includes('pdf');
    if (!extName) {
      res.status(400).end("Only image files are allowed!");
      return;
    }

    try {
      const fle_path = file.md5 + "." + file.name.split(".")[1];
      const bucket = "build-wise";

      await s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: fle_path,
          Body: file.data,
        }),
      );

      const url = await getSignedUrl(
        s3,
        new GetObjectCommand({
          Bucket: bucket,
          Key: `${fle_path}`,
        }),
      );

      res.status(200).json({
        url: url.split("?")[0],
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  });

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
