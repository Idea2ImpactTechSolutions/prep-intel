import { NextApiRequest, NextApiResponse } from "next";
import { models } from "../../../app/models";
const { Managers, School, Users } = models;
import { responseBody } from "../../../app/config/helpers";
import { v4 } from "uuid";

export default async function AuthHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { school_name, email, first_name, last_name } = req.body;

    let school = await School.findOne({
      where: {
        name: school_name,
      },
    });

    if (school) {
      return res
        .status(409)
        .json(responseBody("school account already exists", 409, []));
    }

    let managerChecker = await Users.findOne({
      where: {
        email: email,
      },
    });

    if (managerChecker) {
      return res
        .status(409)
        .json(
          responseBody(
            "manager account with email already created for this school",
            409,
            []
          )
        );
    }

    // Create a new Date object representing the current date and time
    const currentDate = new Date();
    // Add 30 minutes to the current date
    const newDate = new Date(currentDate.getTime() + 60 * 600000); // 30 minutes * 60 seconds/minute * 1000 milliseconds/second

    const schoolId = v4();

    let createSch = await School.create({
      id: schoolId,
      name: school_name,
    });

    let user = await Users.create({
      email: email,
      auth_code: v4(),
      account_claimed: false,
      first_name: first_name,
      last_name: last_name,
      school_id: schoolId,
      role : 'manager',
      auth_code_expiration: newDate,
      is_active : false
    });

    let manager = await Managers.create({
      user_id : user.id
    });

    return res
      .status(200)
      .json(
        responseBody("manager account created successfully", 200, [
          { auth_code: user.auth_code },
        ])
      );
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
