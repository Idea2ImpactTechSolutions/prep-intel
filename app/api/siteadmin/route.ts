import { NextRequest } from "next/server";
import { models } from "app/models";
const {  Users } = models;
import { responseBody, getAuthCode } from "app/config/helpers";

/**
 * @openapi
 * /api/siteadmin:
 *   post:
 *     summary: Creates a new site admin
 *     tags:
 *       - account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the new site admin.
 *               first_name:
 *                 type: string
 *                 description: The first name of the new site admin.
 *               last_name:
 *                 type: string
 *                 description: The last name of the new site admin.
 *             required:
 *               - email
 *               - first_name
 *               - last_name
 *     responses:
 *       201:
 *         description: Admin account created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       auth_code:
 *                         type: string
 *       409:
 *         description: Manager account with email already created for this school.
 *       500:
 *         description: Unknown error.
 */
export async function POST(req: NextRequest) {
  try {
    const { email, first_name, last_name } = await req.json();

    let managerChecker = await Users.findOne({
      where: {
        email: email,
      },
    });

    if (managerChecker) {
      return Response.json(
        responseBody(
          "admin account already exists",
          409
        ),
        {
          status: 409,
        }
      );
    }

    const { authCode, expiresAt } = getAuthCode();

    let user = await Users.create({
      email: email,
      auth_code: authCode,
      account_claimed: false,
      first_name: first_name,
      last_name: last_name,
      role: "admin",
      auth_code_expiration: expiresAt,
      is_active: false,
    });

    return Response.json(
      responseBody("Admin account created successfully", 201, [
        { auth_code: user.auth_code },
      ]),
      {
        status: 201
      });
  } catch (error: any) {
    return Response.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
