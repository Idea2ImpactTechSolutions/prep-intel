import { responseBody } from "@/app/config/helpers";
const { models } = require("@/app/models");
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
    const {code, message, data} = await createRecruiterProfile(req);
    return res.status(code).json(
      responseBody(message, code, { school: data })
    );
  } catch (error: any) {
    return res
      .status(500)
      .json(responseBody("Error occurred", 400, { error: error.message }));
  }
}

async function createRecruiterProfile(req: any) {
  try {
    const { first_name, last_name, email, school_id } = req.body;

    let checkUserExists = await Users.findOne({ where: { email: email }});
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
