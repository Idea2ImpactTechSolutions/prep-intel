import { apiResponse, buildAssetUrl } from "app/config/helpers";
import { S3Client } from "@aws-sdk/client-s3";
const { Upload } = require("@aws-sdk/lib-storage");
const { models } = require("@/app/models");
const { Assets, School, Users } = models;
import mime from "mime-types";
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

const SINGLE_INSTANCE_TYPES = [
  RECRUITER_PROFILE_IMAGE,
  STUDENT_PROFILE_IMAGE,
  SCHOOL_PROFILE_IMAGE,
  SCHOOL_BANNER_IMAGE,
];

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
      attributes: ['id', 'category', 'description', 'is_active', 'school_id', 'user_id', 'bytes'],
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
    const isSingleInstanceAssetType = SINGLE_INSTANCE_TYPES.includes(category);

    switch (category)
    {
      case USER_DOCUMENT:
      case STUDENT_PROFILE_IMAGE:
      case RECRUITER_PROFILE_IMAGE: {
        // Validate the given user exists
        return await uploadUserDocument(formData.get("userId") as string, category, isSingleInstanceAssetType, file);
      }

      case SCHOOL_IMAGE:
      case SCHOOL_BANNER_IMAGE:
      case SCHOOL_PROFILE_IMAGE:
      case SCHOOL_DOCUMENT: {
        // Validate the given school exists
        return await uploadSchoolDocument(formData.get("schoolId") as string, category, isSingleInstanceAssetType, file);
      }
    }
  } catch (error: any) {
    return apiResponse("An unknown error occurred", 500, {
      error: error.message,
    });
  }
}

async function uploadUserDocument(userId: string, category: string, isSingleInstanceAssetType:boolean, file: File) {
  const user = await Users.findByPk(userId);
  if (!user) {
    return apiResponse("No user found", 404);
  }

  const asset = await uploadDocument(
    file,
    `user/${userId}/${isSingleInstanceAssetType ? category : file.name}`,
    isSingleInstanceAssetType,
    {
      user_id: userId,
      category,
    });

  const assetLocation = buildAssetUrl(asset.id);

  // When profile images are uploaded, update the user object with the new image
  if (category === STUDENT_PROFILE_IMAGE || category === RECRUITER_PROFILE_IMAGE) {
    // After upload, set the user's profile image to the uploaded image S3 url
    user.profile_image = assetLocation;
    await user.save()
  }

  return apiResponse("uploaded successfully", 201, {
    assetUrl: assetLocation,
  });
}

async function uploadSchoolDocument(schoolId: string, category: string, isSingleInstanceAssetType:boolean, file: File) {
  const school = await School.findByPk(schoolId);
  if (!school) {
    return apiResponse("No school found", 404);
  }

  const asset = await uploadDocument(
    file,
    `school/${schoolId}/${isSingleInstanceAssetType ? category : file.name}`,
    isSingleInstanceAssetType,
    {
      category,
      school_id: schoolId,
    });

  return apiResponse("uploaded successfully", 201, {
    assetUrl: buildAssetUrl(asset.id),
  });
}

async function getBufferedView(assetFile: File) {
  const buffer = await assetFile.arrayBuffer();
  return new Uint8Array(buffer);
}

async function uploadDocument(
  assetFile: File,
  documentPath: string,
  isSingleInstanceAssetType: boolean,
  assetFields,
) {
    const bufferedView = await getBufferedView(assetFile);

    // Infer the content type from the file extension
    const contentType = mime.lookup(assetFile.name) || "application/octet-stream";

    const uploadResponse = await uploadFileToS3({
      Bucket: process.env.BUCKET_NAME,
      Key: documentPath,
      Body: bufferedView,
      ContentType: contentType,
    });

    let asset: any = null;

    if (isSingleInstanceAssetType) {
      asset = await Assets.findOne({ where: assetFields });

      if (asset) {
        asset.bytes = bufferedView.length;
        asset.location = uploadResponse.Location;
        asset.save();
      }
    }

    // In the single-instance case, if no record exist to update, create - otherwise always create
    if (!asset) {
      // Create a new asset for the upload
      asset = await Assets.create({
        description: assetFile.name,
        bytes: bufferedView.length,
        location: uploadResponse.Location,
        fileName: assetFile.name,
        is_active: true,
        s3_key : documentPath,
        ...assetFields,
      });
    }

    return asset;
}

async function uploadFileToS3(params: any) {
  const uploader = new Upload({
    client: new S3Client({}),
    params,
  });

  return await uploader.done();
}
