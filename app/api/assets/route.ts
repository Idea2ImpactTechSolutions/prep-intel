import { apiResponse } from "app/config/helpers";
import { S3Client } from "@aws-sdk/client-s3";
const { Upload } = require("@aws-sdk/lib-storage");
const { models } = require("@/app/models");
const { Assets, School, Users } = models;
import logger from "lib/logger";
import { type NextRequest } from "next/server";

/**
 * @openapi
 * /api/assets:
 *   get:
 *     summary: Retrieves a list of assets
 *     tags:
 *       - Assets
 *     parameters:
 *       - in: query
 *         name: schoolId
 *         schema:
 *           type: string
 *         required: false
 *         description: Unique identifier of the school
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: false
 *         description: Unique identifier of the user
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         required: false
 *         description: Category of the assets to retrieve
 *     responses:
 *       '200':
 *         description: A JSON array of assets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   first_name:
 *                     type: string
 *               examples:
 *                 One Sample:
 *                   value: '[{"id": 1, "first_name": "John"}]'
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const school_id = searchParams.get("schoolId");
    const user_id = searchParams.get("userId");
    const category = searchParams.get("category");

    const constraint = school_id ? { school_id } : { user_id };

    const assets = await Assets.findAll({
      where: {
        ...constraint,
        category,
      },
    });
    return apiResponse("Success", 200, assets);
  } catch (error: any) {
    return apiResponse("An unknown error occurred", 500, {
      error: error.message,
    });
  }
}

/**
 * @openapi
 * /api/assets:
 *   post:
 *     description: Upload an asset
 *     tags:
 *       - asset
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File to be uploaded
 *               category:
 *                 type: string
 *                 description: Category of the asset
 *               schoolId:
 *                 type: string
 *                 description: Unique identifier for the school (required for school-related assets)
 *               userId:
 *                 type: string
 *                 description: Unique identifier for the user (required for user-related assets)
 *             required:
 *               - file
 *               - category
 *     responses:
 *       200:
 *         description: Asset uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 assetId:
 *                   type: string
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const assetType = formData.get("category");

    switch (assetType) {
      case "logo":
        return uploadLogo(
          formData.get("file") as File,
          formData.get("schoolId") as string
        );
      case "user-document":
      case "recruiter-profile-image":
        return uploadUserDocument(
          formData.get("file") as File,
          formData.get("userId") as string,
          assetType
        );
      case "school-document":
        return uploadSchoolDocument(
          formData.get("file") as File,
          formData.get("schoolId") as string
        );
    }
  } catch (error: any) {
    return apiResponse("An unknown error occurred", 500, {
      error: error.message,
    });
  }
}

async function getBufferedView(assetFile: File) {
  const buffer = await assetFile.arrayBuffer();
  return new Uint8Array(buffer);
}

async function uploadSchoolDocument(assetFile: File, schoolId: string) {
  const school = await School.findByPk(schoolId);
  if (!school) {
    return apiResponse("No school found", 404);
  }

  return await uploadDocument(assetFile, `user/${assetFile.name}`, {
    category: "user-document",
    school_id: schoolId,
  });
}

async function uploadUserDocument(
  assetFile: File,
  userId: string,
  category: string
) {
  const user = await Users.findByPk(userId);
  if (!user) {
    return apiResponse("No user found", 404);
  }

  // Currently only 'recruiter-profile-image' is singular, revise/expand as needed
  const singleInstance = category === "recruiter-profile-image";

  return await uploadDocument(
    assetFile,
    `user/${userId}/${  singleInstance ? category : assetFile.name}`,
    singleInstance,
    {
      user_id: userId,
      category,
    }
  );
}

async function uploadDocument(
  assetFile: File,
  documentPath: string,
  singleInstance: boolean,
  assetFields
) {
  try {
    const bufferedView = await getBufferedView(assetFile);
    const response = await uploadFileToS3({
      Bucket: "prep-bucket-upload",
      Key: documentPath,
      Body: bufferedView,
    });

    let existingAsset:any = null

    if (singleInstance)
    {
      existingAsset = await Assets.findOne({where: assetFields});

      if (existingAsset) {
        existingAsset.location = response.location;
        existingAsset.save();
      }
    }

    // In the singleinstance case, if no record exist to update, create - otherwise always create
    if (!existingAsset) {
      // Create a new asset for the upload
      await Assets.create({
        description: assetFile.name,
        location: response.Location,
        fileName: assetFile.name,
        is_active: true,
        ...assetFields,
      });
    }

    return apiResponse("uploaded successfully", 201, {
      assetUrl: response.Location,
    });
  } catch (error: any) {
    logger.error(error);
    return apiResponse("An unexpected error occurred", 500, {
      error: error.message,
    });
  }
}

async function uploadLogo(imageFile: File, schoolId: string) {
  const assetType = "logo";
  const school = await School.findByPk(schoolId);
  if (!school) {
    return apiResponse("school with id not found", 404);
  }

  const buff = await imageFile.arrayBuffer();
  const buffView = new Uint8Array(buff);

  try {
    const data = await uploadFileToS3({
      Bucket: "prep-bucket-upload",
      Key: `school/${schoolId}/logo`,
      Body: buffView,
    });

    let assetExists = await Assets.findOne({
      where: { school_id: schoolId, category: assetType },
    });

    if (assetExists) {
      // Set active to false on all existing records with schoolId & category
      await Assets.update(
        { is_active: false },
        { where: { school_id: schoolId, category: assetType } }
      );
    }

    // Create a new asset, for the upload, with path and active set
    await Assets.create({
      description: "logo",
      school_id: schoolId,
      category: assetType,
      location: data.Location,
      is_active: true,
    });

    return apiResponse("image uploaded successfully", 201, {
      assetUrl: data.Location,
    });
  } catch (error: any) {
    logger.error(error);
    return apiResponse("An unexpected error occurred", 500, {
      error: error.message,
    });
  }
}

async function uploadFileToS3(params: any) {
  const uploader = new Upload({
    client: new S3Client({}),
    params,
  });

  return await uploader.done();
}
