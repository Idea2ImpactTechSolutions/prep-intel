import { responseBody, getAuthCode } from "@/app/config/helpers";
import { models } from "@/app/models";
const { School, Recruiters, Users } = models;

/**
 * @openapi
 * /api/recruiters:
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
export async function GET() {
  return Response.json(await Recruiters.findAll());
}

/**
 * @openapi
 * /api/recruiters:
 *   post:
 *     description: Returns the hello world
 *     summary: Creates a new recruiter
 *     tags:
 *       - recruiter
 *     responses:
 *       200:
 *         description:
 */
export async function POST(req: Request) {
  try {
    const jsonBody = await req.json();
    const { message, code, data } = await createRecruiter(jsonBody);
    return Response.json(
      responseBody(message, code, { school: data }), {
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

async function createRecruiter(json) {
  try {
    const { first_name, last_name, email, school_id } = json;

    let checkUserExists = await Users.findOne({ where: { email: email } });
    if (checkUserExists) {
      return {
        message: "Recruiter already exists",
        code: 409,
        data: [],
      };
    }

    let school = await School.findOne({ where: { id: school_id } });
    if (!school) {
      return {
        message: "school does not exist",
        code: 404,
        data: [],
      };
    }

    const {authCode, expiresAt } = getAuthCode();

    let user = await Users.create({
      school_id: school.id,
      first_name: first_name,
      last_name: last_name,
      email: email,
      notification_method: '{"email"}',
      account_claimed: false,
      role: "recruiter",
      create_date: new Date(),
      auth_code_expiration: expiresAt,
      is_active: false,
      auth_code: authCode,
      status: "pending",
    });

    await Recruiters.create({
      school_id: school.id,
      user_id: user.id,
    });

    // Send a successful response
    return {
      message: "recruiter created successfully",
      code: 201,
      data: [{ auth_code: user.auth_code }],
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
