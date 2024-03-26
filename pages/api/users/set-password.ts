import { NextApiRequest, NextApiResponse } from "next";
import { models } from "../../../app/models";
const { Managers, School, Recruiters, Users } = models;
import { responseBody } from "../../../app/config/helpers";
import { v4 } from "uuid";
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
  const { auth_code, password, repeat_password } = req.body;

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
  if (password !== repeat_password) {
    return {
      code: 400,
      message: "password mismatch",
      data: [],
    };
  }

  const harsh = bcrypt.hashSync(password);
  // Create a new Date object representing the current date and time

  await Users.update({ password: harsh }, { where: { auth_code: auth_code } });
  return {
    code: 200,
    message: "Password successfully updated",
    data: [],
  };
}
