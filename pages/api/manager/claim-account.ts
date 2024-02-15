import { NextApiRequest, NextApiResponse } from "next";
import { models } from "../../../app/models";
const { Managers, School } = models;
import { sendSuccess } from "../../../app/config/helpers";
import { v4 } from "uuid";

export default async function AuthHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { auth_code, email } = req.body;

    let managerChecker = await Managers.findOne({
      where: {
        email: email,
        auth_code: auth_code,
      },
    });

    if (!managerChecker) {
      return res
        .status(409)
        .json(
          sendSuccess("no manager with email and auth code found", 409, [])
        );
    }

    if (managerChecker.account_claimed) {
      return res
        .status(200)
        .json(sendSuccess("manager account already claimed", 200, []));
    }
    // Create a new Date object representing the current date and time
    const currentDate = new Date();
    if (managerChecker.auth_code_expiration < currentDate) {
      const newDate = new Date(currentDate.getTime() + 30 * 60000); // 30 minutes * 60 seconds/minute * 1000 milliseconds/second
      let managers = await Managers.update(
        {
          auth_code: v4(),
          auth_code_expiration: newDate,
        },
        { where: { email: email } }
      );
      return res
        .status(409)
        .json(
          sendSuccess(
            "Otp expired kindly check your mail for another otp",
            409,
            [{ auth_code: managers.auth_code }]
          )
        );
    }

    await Managers.update(
      {
        account_claimed: true,
      },
      { where: { email: email } }
    );
    return res
      .status(200)
      .json(sendSuccess("manager account claimed successfully", 200, []));
  } catch (error: any) {
    console.log({
      error: error.message,
    });
    res.status(500).json({ error: error.message });
  }
}
