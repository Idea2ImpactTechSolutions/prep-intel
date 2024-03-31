import { responseBody } from "@/app/config/helpers";
const { models } = require("app/models");
const { School, Recruiters, Users } = models;
const { v4 } = require("uuid");

/**
 * @openapi
 * /api/recruiter:
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
  return Response.json(await Recruiters.findAll());
}

/**
 * @swagger
 * /api/recruiter:
 *   post:
 *     description: Returns the hello world
 *     summary: Creates a new recruiter
 *     responses:
 *       200:
 *         description: Hello World!
 */
export async function POST(req: Request) {
  try {
    const { message, code, data } = await createRecruiterProfile(req);
    return Response.json(
      responseBody(message, code, data),
      {
        status: code,
      }
    );
  } catch (error: any) {
    return Response.json(
      {
        //error: 'Internal Server Error'
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

async function createRecruiterProfile(req: any) {
  try {
    const { first_name, last_name, email, school_id } = req.body;

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

    // Add 30 minutes to the current date
    const currentDate = new Date();
    const newDate = new Date(currentDate.getTime() + 60 * 60000); // 30 minutes * 60 seconds/minute * 1000 milliseconds/second

    let user = await Users.create({
      school_id: school.id,
      first_name: first_name,
      last_name: last_name,
      email: email,
      notification_method: '{"email"}',
      account_claimed: false,
      role: "recruiter",
      create_date: new Date(),
      auth_code_expiration: newDate,
      is_active: false,
      auth_code: v4(),
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
