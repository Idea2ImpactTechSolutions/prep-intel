import { NextApiRequest, NextApiResponse } from "next";
import { models } from "app/models";
const { Users } = models;
import { responseBody, getAuthCode, getBaseUrl } from "app/config/helpers";
import {sendEmail} from "@/app/config/email-service";


export default async function AuthHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      return handleResetPassword(req, res);
    default:
      return res
        .status(405)
        .json(responseBody("Method Not Allowed", 405, null));
  }
}

async function handleResetPassword(req, res) {
  try {

    let { email } = req.body;

    let user = await Users.findOne({
      where: {
        email
      },
    });

    const {authCode, expiresAt } = getAuthCode();
    user.set({
      auth_code: authCode,
      auth_code_expiration: expiresAt,
    });

    user.save();

    const claimUrl = `${getBaseUrl()}/users/set-password?auth_code=${authCode}`;

    sendEmail({
      to: email,
      subject: "Password Reset",
      text: `Reset your PrepIntel password: \n ${claimUrl}`
    })

    return res.status(200).json(
      responseBody("Success", 200, claimUrl)
    );
  } catch (error: any) {
    return res
      .status(400)
      .json(responseBody("Error occurred", 400, { error: error.message }));
  }
}
