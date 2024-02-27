import { responseBody } from "../../../../app/config/helpers";
import { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm, Fields, Files } from "formidable";
import fs from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
const { Upload } = require("@aws-sdk/lib-storage");
const { models } = require("../../../../app/models");
const { Assets, School } = models;

export const config = { api: { bodyParser: false } };

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
  return res;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const fData = await parseFormData(req);

    const imageFile = fData.files.image as any;
    const schoolId: any = fData.fields.school_id;

    let buffer = Buffer.from(fs.readFileSync(imageFile[0].filepath));

    const params = {
      Bucket: "prep-bucket-upload",
      Key: imageFile[0].newFilename,
      Body: buffer,
      conntentType: "image/png",
    };

    try {
      let school = await School.findByPk(schoolId[0]);
      if (school) {
        const data = await uploadFileToS3(params);
        let createAsset = await Assets.create({
          name: "logo",
          school_id: schoolId[0],
          description: data.Location,
        });

        return res.status(200).json(
          responseBody("image uplooaded successfully", 201, {
            image_url: data.Location,
          })
        );
      }
      return res.status(200).json(
        responseBody("school with id not found", 201, {
          image_url: "",
        })
      );
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } catch (error: any) {
    // onsole.log("error", error);
    res.status(500).json(error.message);
  }
}
