import { models } from "app/models";
const { School, Managers, Users } = models;
import { responseBody, getAuthCode } from "app/config/helpers";
import { type NextRequest } from "next/server";

/**
 * @openapi
 * /api/schools/{schoolId}/manager:
 *   get:
 *     summary: Allow creation of school manager
 *     description: ""
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the school to you want to create manager
 *     body:
 *         schema:
 *               type: object
 *               items:
 *                     {"first_name": "First Name", "last_name": "Last Name", "email": "john@example.com"}
 *
 *     responses:
 *       '201':
 *         description: a string stating the status of the request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *                 properties:
 *                   response_code:
 *                     type: integer
 *                   message:
 *                     type: string
 *             examples:
 *               One Sample:
 *                 value: '[{"id": 1, "first_name": "John"}]'
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { schoolId: string } }
) {
  try {
    const { email, first_name, last_name } = await req.json();
    let school_id = params.schoolId;

    const { message, code, data } = await createManager({
      email,
      first_name,
      last_name,
      school_id,
    });
    return Response.json(
      responseBody(message, code, { school: data }),
      {
        status: code
      }
    );
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

let createManager = async ({ email, first_name, last_name, school_id }) => {
  let schoolExists = await School.findOne({ where: { id: school_id } });

  if (!schoolExists) {
    return {
      code: 404,
      message: "School not found",
      data: [],
    };
  }

  let checkIfManagerAlreadyExists = await Users.findOne({
    where: { email: email },
  });

  if (checkIfManagerAlreadyExists) {
    return {
      code: 404,
      message: "Manager with email already exists",
      data: [],
    };
  }

  const {authCode, expiresAt } = getAuthCode();

  let user = await Users.create({
    school_id: school_id,
    first_name: first_name,
    last_name: last_name,
    email: email,
    notification_method: '{"email"}',
    account_claimed: false,
    role: "manager",
    auth_code_expiration: expiresAt,
    is_active: false,
    auth_code: authCode,
    status: "pending",
  });

  await Managers.create({
    user_id: user.id,
  });

  return {
    code: 201,
    message: "Manager created successfully",
    data: [{ auth_code: user.auth_code }],
  };
};
