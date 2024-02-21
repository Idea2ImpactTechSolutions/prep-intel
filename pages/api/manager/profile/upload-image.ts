import { sendSuccess } from "../../../../app/config/helpers";
import { NextApiRequest, NextApiResponse } from "next";
const fs = require("fs");
import { IncomingForm, Fields, Files } from "formidable";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// pages/api/manager/profile/academic-info.js
const { models } = require("../../../../app/models");
const {
  School,
  SchoolAddress,
  SchoolContact,
  SchoolSocialMedia,
  SchoolDepartment,
  SchoolAccreditation,
  SchoolResearchProgram,
} = models;
const { v4 } = require("uuid");

export const config = { api: { bodyParser: false } };

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

const parseFormData = (
  req: NextApiRequest
): Promise<{ fields: Fields; files: Files }> =>
  new Promise((resolve, reject) => {
    const form = new IncomingForm({ multiples: false });
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

async function uploadFileToS3(params: any) {
  const command = new PutObjectCommand(params);
  return await s3Client.send(command);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const fData = await parseFormData(req);

    const imageFile = fData.files.image as any;

    const buffer = Buffer.from(
      await fs.promises.readFile(imageFile[0].filepath)
    ); // Read file contents
    // Respond with the school details or null if no school_id is provided
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: imageFile[0].newFilename,
      Body: buffer,
      conntentType: "image/jpg",
    };

    try {
      const data = await uploadFileToS3(params);
      if (data.$metadata.httpStatusCode == 200) {
        return res
          .status(200)
          .json(
            sendSuccess("image uploaded successfully", 201, [{ data: "" }])
          );
      } else {
        return res
          .status(200)
          .json(
            sendSuccess("upload error kkindly try again", 400, [{ data: "" }])
          );
      }
    } catch (error: any) {
      res.status(500).json(sendSuccess(error.message, 400, [{ data: "" }]));
    }
  } catch (error: any) {
    res.status(500).json(error.message);
  }
}
