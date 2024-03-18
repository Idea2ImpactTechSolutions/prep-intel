import { responseBody } from "../../../app/config/helpers";
const { models } = require("../../../app/models");
const { School, Recruiters, Users } = models;
const { v4 } = require("uuid");

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      return handlePostRequest(req, res);
    case "GET":
      return res
        .status(405)
        .json(responseBody("Method Not Allowed", 405, null));
    case "PATCH":
      return res
        .status(405)
        .json(responseBody("Method Not Allowed", 405, null));
    default:
      return res
        .status(405)
        .json(responseBody("Method Not Allowed", 405, null));
  }
}

async function handlePostRequest(req, res) {
  try {
    const createRecruiter: any = await createRecruiterProfile(req);
    return res.status(createRecruiter.code).json(
      responseBody(createRecruiter.message, createRecruiter.code, {
        school: createRecruiter.data,
      })
    );
  } catch (error: any) {
    return res
      .status(500)
      .json(responseBody("Error occurred", 400, { error: error.message }));
  }
}

async function createRecruiterProfile(req: any) {
  try {
    // Extract data from request body

    const { first_name, last_name, email, school_id } = req.body;
    // const { invitation_subject, invitation_message } = invitation_info;

    let checkUserExists = await Users.findOne({
      where: {
        first_name: first_name,
        last_name: last_name,
      },
    });

    if (checkUserExists) {
      return {
        message: "recruiter with first name and last name already exists",
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

    const currentDate = new Date();
    // Add 30 minutes to the current date
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
      id: v4(),
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
