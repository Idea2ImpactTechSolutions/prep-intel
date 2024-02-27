import { responseBody } from "../../../../app/config/helpers";

const { models } = require("../../../../app/models");
const { School, Recruiters } = models;
const { v4 } = require("uuid");

export default async function handler(req, res) {
  try {
    // Extract data from request body

    const { first_name, last_name, email, school_id } = req.body;
    // const { invitation_subject, invitation_message } = invitation_info;

    let recruiterCheck = await Recruiters.findOne({ where: { email: email } });

    if (recruiterCheck) {
      return res
        .status(201)
        .json(responseBody("recruiter already added", 400, []));
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

    await Recruiters.create({
      id: v4(),
      school_id: school.id,
      first_name: first_name,
      last_name: last_name,
      email: email,
      notification_method: '{"email"}',
      account_claimed: false,
      create_date: new Date(),
      auth_code_expiration: newDate,
      is_active: false,
      auth_code: v4(),
      status: "pending",
    });

    // Send a successful response
    return res
      .status(201)
      .json(responseBody("recruiter created successfully", 201, []));
  } catch (error: any) {
    // Handle any errors
    return res
      .status(400)
      .json(responseBody("error occurred", 400, [{ school: error.message }]));
  }
}
