import { NextApiRequest, NextApiResponse } from "next";
import { models } from "app/models";
const { Managers, School, Users } = models;
import { responseBody, getAuthCode, getBaseUrl } from "app/config/helpers";
import {sendEmail} from "../users/aws-ses-email-service"

export default async function AuthHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { school_name, email, first_name, last_name } = req.body;
    console.log('We are in the school entity')
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

    school =   await School.create({
      name: school_name,
    });

    const {authCode, expiresAt } = getAuthCode();
    const baseUrl = getBaseUrl(req);
    const claimUrl = `${baseUrl}/users/claim?auth_code=${authCode}`;

    let user = await Users.create({
      claimUrl,
      email: email,
      auth_code: authCode,
      account_claimed: false,
      first_name: first_name,
      last_name: last_name,
      school_id: school.id,
      role : 'manager',
      auth_code_expiration: expiresAt,
      is_active : false
    });

    await Managers.create({
      user_id : user.id
    });
  
    sendEmail({
        to: email,
        subject: "Claim your PrepIntel account",
        text: `Claim your PrepIntel account today\n ${claimUrl}`
    })
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
