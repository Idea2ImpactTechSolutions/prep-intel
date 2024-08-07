import { apiResponse } from "app/config/helpers";
import { S3Client } from "@aws-sdk/client-s3";
const { Upload } = require("@aws-sdk/lib-storage");
const { models } = require("@/app/models");
const { Assets, School, Users } = models;
import logger from "lib/logger";
import { type NextRequest } from "next/server";
import {
  SCHOOL_PROFILE_IMAGE,
  SCHOOL_BANNER_IMAGE,
  SCHOOL_IMAGE,
  SCHOOL_DOCUMENT,
  USER_DOCUMENT,
  RECRUITER_PROFILE_IMAGE,
  STUDENT_PROFILE_IMAGE,
} from "types/assetTypes";

/**
 * @openapi
 * /api/assets:
 *   get:
 *     summary: Retrieves a list of assets
 *     tags:
 *       - asset
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
      attributes: ['id', 'category', 'description', 'is_active', 'school_id', 'user_id'],
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
    const category = formData.get("category") as string;
    const file = formData.get("file") as File;
    const singleInstanceTypes = [
      RECRUITER_PROFILE_IMAGE,
      STUDENT_PROFILE_IMAGE,
      SCHOOL_PROFILE_IMAGE,
      SCHOOL_BANNER_IMAGE,
    ];
    const singleInstanceAsset = singleInstanceTypes.includes(category);

    switch (category) {
      case USER_DOCUMENT:
      case STUDENT_PROFILE_IMAGE:
      case RECRUITER_PROFILE_IMAGE: {
        const userId = formData.get("userId") as string;
        const user = await Users.findByPk(userId);
        if (!user) {
          return apiResponse("No user found", 404);
        }

        return await uploadDocument(
          file,
          `user/${userId}/${singleInstanceAsset ? category : file.name}`,
          singleInstanceAsset,
          {
            user_id: userId,
            category,
          },
          async (location) => {
            // After upload, set the user's profile image to the uploaded image S3 url
            user.profile_image = location;
            await user.save()
          }
        );
      }

      case SCHOOL_IMAGE:
      case SCHOOL_BANNER_IMAGE:
      case SCHOOL_PROFILE_IMAGE:
      case SCHOOL_DOCUMENT: {
        const schoolId = formData.get("schoolId") as string;
        const school = await School.findByPk(schoolId);
        if (!school) {
          return apiResponse("No school found", 404);
        }

        return await uploadDocument(
          file,
          `school/${schoolId}/${singleInstanceAsset ? category : file.name}`,
          singleInstanceAsset,
          {
            category,
            school_id: schoolId,
          },
        );
      }
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

async function uploadDocument(
  assetFile: File,
  documentPath: string,
  singleInstanceAsset: boolean,
  assetFields,
  onUploadSuccess?: (location: string) => void,
) {
  try {
    const bufferedView = await getBufferedView(assetFile);
    const response = await uploadFileToS3({
      Bucket: process.env.BUCKET_NAME,
      Key: documentPath,
      Body: bufferedView,
    });

    if (onUploadSuccess) {
      onUploadSuccess(response.Location);
    }

    let existingAsset: any = null;

    if (singleInstanceAsset) {
      existingAsset = await Assets.findOne({ where: assetFields });

      if (existingAsset) {
        existingAsset.location = response.Location;
        existingAsset.save();
      }
    }

    // In the single-instance case, if no record exist to update, create - otherwise always create
    if (!existingAsset) {
      // Create a new asset for the upload
      await Assets.create({
        description: assetFile.name,
        location: response.Location,
        fileName: assetFile.name,
        is_active: true,
        s3_key : documentPath,
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

async function uploadFileToS3(params: any) {
  const uploader = new Upload({
    client: new S3Client({}),
    params,
  });

  return await uploader.done();
}
