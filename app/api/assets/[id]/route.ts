import { S3, S3Client, GetObjectCommand} from "@aws-sdk/client-s3";
import { getToken } from "next-auth/jwt";
import { Role } from "@/nextauth.d";

const { models } = require("@/app/models");
const { Assets, School, Users, Recruits,Students} = models;
import logger from "lib/logger";
import { USER_DOCUMENT } from "types/assetTypes";
import { NextRequest, NextResponse } from "next/server";

const client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const s3 = new S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});




/**
 * @openapi
 * /api/assets/{id}:
 *   get:
 *     summary: Gets a given site asset
 *     tags:
 *       - asset
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const asset = await Assets.findByPk(params.id);
    if (!asset) {
      return new NextResponse("No asset found", {
        status: 404,
      });
    }

    // Authorize Request
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const schoolId = token?.schoolID as string;
    const role = token?.role as Role;

    // If the asset category is one that has authorization and the
    // user is of a Role that requires authorization, validate the request
    if (asset.category === USER_DOCUMENT &&
        [Role.manager, Role.recruiter, Role.student].includes(role)) {
      switch(token?.role){
        // *****************************************************************************
        // For the two cases defined below, we need to:
        //   1. Lookup the asset
        //   2. Using details from the asset, validate the requesting user is authorized
        // *****************************************************************************
        case Role.manager:
        case Role.recruiter:
          // Verify school connection - look up recruits record and verify student exists for school
          if (await !verifySchoolConnection(schoolId, asset.userID)) {
            return new NextResponse("Access Denied", { status: 403 });
          };
        case Role.student:
          if (asset.userID != token.id) {
            return new NextResponse("Access Denied", { status: 403 });
          }
          // Verify asset ownership - compare requesting assets userID to ensure students can only view their documents
          break;
      }
    }

    const command = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key:  asset.s3_key,
    });

    const sthreeResponse = await client.send(command);

    // Set headers
    const headers = new Headers();
    headers.set('Content-Type', sthreeResponse.ContentType || 'application/octet-stream');
    headers.set('Content-Length', sthreeResponse.ContentLength?.toString() || '0');
    headers.set('Cache-Control', 'max-age=3600'); // Cache for 1 hour
    
    const segments = asset.s3_key.split('/');
    const filename = segments[segments.length - 1];
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);

    return new NextResponse(sthreeResponse.Body as ReadableStream, {
      status: 200,
      headers: headers,
    });

  }
  catch (error) {
    logger.error(error);
    return new NextResponse("", {
      status: 500,
    });
  }
}

// A school is connected if it has a recruit record for the given student
async function verifySchoolConnection(schoolId, assetUserId) {
  // The student with the given userID who owns the given asset
  const student = await Students.findOne({
    where:  {
      user_id: assetUserId
    }
  });

  if (!student) {
    return false;
  }

  const recruit = await Recruits.findOne({
    where: { 
      student_id: student.id,
      school_id: schoolId,
    },
  });

  // School connections exist if the student for the given userId exists, 
  // and the school has a valid recruit record
  return student && recruit;
}