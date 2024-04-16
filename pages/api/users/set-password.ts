import { NextApiRequest, NextApiResponse } from "next";
import { models } from "../../../app/models";
const { Users } = models;
import { responseBody } from "../../../app/config/helpers";
import bcrypt from "bcryptjs";

export default async function AuthHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      return handleSetPassword(req, res);
    default:
      return res
        .status(405)
        .json(responseBody("Method Not Allowed", 405, null));
  }
}

async function handleSetPassword(req, res) {
  try {
    const setPasswordResponse: any = await setPassword(req);
    return res.status(setPasswordResponse.code).json(
      responseBody(setPasswordResponse.message, setPasswordResponse.code, {
        data: setPasswordResponse.data,
      })
    );
  } catch (error: any) {
    return res
      .status(400)
      .json(responseBody("Error occurred", 400, { error: error.message }));
  }
}

async function setPassword(req: any) {

  // TODO: we should perform the same validation of the auth_code that we do on the claim url
  const { auth_code, password, confirm_password } = req.body;
  let userExists = await Users.findOne({
    where: {
      auth_code: auth_code,
    },
  });

  if (!userExists) {
    return {
      code: 404,
      message: "no user with email and auth code found",
      data: [],
    };
  }
  if (password !== confirm_password) {
    return {
      code: 400,
      message: "password mismatch",
      data: [],
    };
  }

  const hash = bcrypt.hashSync(password);
  await Users.update({ password: hash }, { where: { auth_code: auth_code } });

  return {
    code: 200,
    message: "Password successfully updated",
    data: [],
  };
}
