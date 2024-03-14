import { responseBody } from "../../../app/config/helpers";
const { models } = require("../../../app/models");
const { School, Recruiters, Users } = models;
const { v4 } = require("uuid");

export default async function handler(req, res) {
  try {
    // Extract data from request body

    const { first_name, last_name, email, school_id } = req.body;
    console.log({ first_name, last_name, email, school_id });
    // const { invitation_subject, invitation_message } = invitation_info;

    let checkUserExists = await Users.findOne({
      where: {
        first_name: first_name,
        last_name: last_name,
      },
    });

    if (checkUserExists) {
      return res
        .status(409)
        .json(
          responseBody(
            "recruiter with first name and last name already exists",
            409,
            []
          )
        );
    }

    let school = await School.findOne({ where: { id: school_id } });

    if (!school) {
      return res
        .status(201)
        .json(responseBody("school does not exist", 404, []));
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
    return res
      .status(201)
      .json(
        responseBody("recruiter created successfully", 201, [
          { auth_code: user.auth_code },
        ])
      );
  } catch (error: any) {
    // Handle any errors
    return res
      .status(400)
      .json(responseBody("error occurred", 400, [{ message: error.message }]));
  }
}
