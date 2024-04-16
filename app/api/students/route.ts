const { models } = require("app/models");
import { responseBody } from "app/config/helpers";
const { Users, Students } = models;
import bcrypt from "bcryptjs";

/**
 * @openapi
 * /api/recruiters:
 *   get:
 *       summary: Retrieves a list of recruiters or a specific recruiter by ID
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
export async function GET() {
  return Response.json(await Students.findAll());
}

/**
 * @swagger
 * /api/recruiters:
 *   post:
 *     description: Returns the hello world
 *     summary: Creates a new recruiter
 *     responses:
 *       200:
 *         description:
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

    let checkUserExists = await Users.findOne({ where: { email: email } });
    if (checkUserExists) {
      return {
        message: "Student already exists",
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
      code: 400,
      data: [],
    };
  }
}
