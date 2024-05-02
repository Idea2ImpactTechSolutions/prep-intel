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
 *       summary: Retrieves a list of recruiters or a specific recruiter by ID
 *       tags:
 *           - recruiter
 *       responses:
 *           '200':
 *               content:
 *                    application/json:
 *                       schema:
 *                           type: array
 *                           items: {}
 *                       examples:
 *                           One Sample:
 *                               value: '[{id: 1, first_name: "John"}]'
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const school_id = searchParams.get("schoolId");
    const user_id = searchParams.get("userId");

    const constraint = school_id ? { school_id } : { user_id };

    const assets = await Assets.findAll({
      where: {
        ...constraint,
        category: searchParams.get("category"),
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
 *     summary: na
 *     tags:
 *       - asset
 *     responses:
 *       200:
 *         description:
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

async function getBufferedViewFromFile(assetFile: File) {
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

  return await uploadDocument(assetFile, `user/${userId}/${assetFile.name}`, {
    user_id: userId,
    category,
  });
}

async function uploadDocument(
  assetFile: File,
  documentPath: string,
  assetFields
) {
  try {
    const bufferedView = await getBufferedViewFromFile(assetFile);
    const data = await uploadFileToS3({
      Bucket: "prep-bucket-upload",
      Key: documentPath,
      Body: bufferedView,
    });

    // Create a new asset for the upload
    await Assets.create({
      description: assetFile.name,
      location: data.Location,
      fileName: assetFile.name,
      is_active: true,
      ...assetFields,
    });

    return apiResponse("uploaded successfully", 201, {
      assetUrl: data.Location,
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
