import { sendSuccess } from "../../../../app/config/helpers";
import { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm, Fields, Files } from "formidable";
import fs from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
const { Upload } = require("@aws-sdk/lib-storage");

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

// const s3Client = new S3Client({
//   region: "us-east-1",
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
//   },
// });

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
  const client = new Upload({ client: new S3Client({}), params: params });
  const res = await client.done();

  console.log({ res });
  return res;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const fData = await parseFormData(req);

    const imageFile = fData.files.image as any;

    let buffer = Buffer.from(fs.readFileSync(imageFile[0].filepath));

    // Respond with the school details or null if no school_id is provided
    const params = {
      Bucket: "prep-bucket-upload",
      Key: imageFile[0].newFilename,
      Body: buffer,
      conntentType: "image/png",
    };

    try {
      const data = await uploadFileToS3(params);
      res.status(200).json({ imageUrl: data });
    } catch (error) {
      res.status(500).json({ error: "Failed to upload file to S3" });
    }
  } catch (error: any) {
    // onsole.log("error", error);
    res.status(500).json(error.message);
  }
}
