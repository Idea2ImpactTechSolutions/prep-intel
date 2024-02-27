import { responseBody } from "../../../../app/config/helpers";
import { NextApiRequest, NextApiResponse } from "next";
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
  region: "us-east-1",
  credentials: {
    accessKeyId: "",
    secretAccessKey: "",
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

    //onsole.log({ fData });

    const imageFile = fData.files.image as any;

    // Respond with the school details or null if no school_id is provided
    const params = {
      Bucket: "prep-bucket-upload",
      Key: imageFile[0].newFilename,
      Body: imageFile[0].filepath,
      conntentType: "image/jpg",
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
