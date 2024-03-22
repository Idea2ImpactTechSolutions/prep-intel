import { NextApiRequest, NextApiResponse } from "next";
import { models } from "../../../app/models";
const { Managers, School, Recruiters, Users } = models;
import { responseBody } from "../../../app/config/helpers";
import { v4 } from "uuid";
import Students from "../../../app/models/Students";
import Applicants from "../../../app/models/Applicants";

export default async function AuthHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      return handleClaimRequest(req, res);
    case "GET":
      return res
        .status(405)
        .json(responseBody("Method Not Implemented", 405, null));
    default:
      return res
        .status(405)
        .json(responseBody("Method Not Allowed", 405, null));
  }
}

async function handleClaimRequest(req, res) {
  try {
    const claimResponse: any = await claimAccount(req);
    return res.status(claimResponse.code).json(
      responseBody(claimResponse.message, claimResponse.code, {
        data: claimResponse.data,
      })
    );
  } catch (error: any) {
    return res
      .status(400)
      .json(responseBody("Error occurred", 400, { error: error.message }));
  }
}

async function claimAccount(req: any) {
  const { auth_code, email } = req.body;

  let recruiterChecker = await Users.findOne({
    where: {
      email: email,
      auth_code: auth_code,
    },
  });

  if (!recruiterChecker) {
    return {
      code: 404,
      message: "no manager with email and auth code found",
      data: [],
    };
  }
  if (recruiterChecker.account_claimed) {
    return {
      code: 200,
      message: "manager account already claimed",
      data: [],
    };
  }
  // Create a new Date object representing the current date and time
  const currentDate = new Date();
  if (recruiterChecker.auth_code_expiration < currentDate) {
    const newDate = new Date(currentDate.getTime() + 30 * 60000); // 30 minutes * 60 seconds/minute * 1000 milliseconds/second
    let recruiter = await Users.update(
      {
        auth_code: v4(),
        auth_code_expiration: newDate,
      },
      { where: { email: email } }
    );
    return {
      code: 409,
      message: "Otp expired kindly check your mail for another otp",
      data: [{ auth_code: recruiter.auth_code }],
    };
  }

  await Users.update(
    {
      account_claimed: true,
      date_claimed: new Date(),
    },
    { where: { email: email } }
  );
  return {
    code: 200,
    message: "manager account claimed successfully",
    data: [
      {
        role: "recruier",
        email: email,
        school: recruiterChecker.school_id,
      },
    ],
  };
}
