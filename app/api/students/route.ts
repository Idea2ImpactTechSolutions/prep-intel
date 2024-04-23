const { models } = require("app/models");
import { responseBody } from "app/config/helpers";
const { Users, Students } = models;
import bcrypt from "bcryptjs";

/**
 * @openapi
 * /api/students:
 *   post:
 *     summary: Creates a new student with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *           examples:
 *             One Sample:
 *               value:
 *                 email: "abelkelly6022@gmail.com"
 *                 password: "abelkelly"
 *     responses:
 *       200:
 *         description: Successfully created new student
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *             examples:
 *               One Sample:
 *                 value:
 *                   email: "abelkelly6022@gmail.com"
 *                   password: "abelkelly"
 */
export async function POST(req: Request) {
  try {
    const jsonBody = await req.json();
    const { message, code, data } = await createStudents(jsonBody);
    return Response.json(responseBody(message, code, { student: data }), {
      status: code,
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

async function createStudents(json) {
  try {
    const { email, password } = json;

    let existingUserInDb = await Users.findOne({ where: { email: email } });
    if (existingUserInDb) {
      return {
        message: `Account for a ${existingUserInDb.role} already exists using that email`,
        code: 409,
        data: [],
      };
    }
    const hash = bcrypt.hashSync(password);

    let user = await Users.create({
      email: email,
      password: hash,
      is_active: true,
      notification_method: '{"email"}',
      account_claimed: true,
      role: "student",
    });

    await Students.create({ user_id: user.id });

    // Send a successful response
    return {
      message: "student created successfully",
      code: 201,
      data: [{}],
    };
  } catch (error: any) {
    // Handle any errors
    return {
      message: error.message,
      code: 500,
      data: [],
    };
  }
}
