import { NextApiRequest, NextApiResponse } from "next";
import { models } from "../../../app/models";
const { Managers, School } = models;
import { responseBody } from "../../../app/config/helpers";
import bcrypt from "bcryptjs";

export default async function AuthHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { password, email } = req.body;

    let managerChecker = await Managers.findOne({
      where: {
        email: email,
      },
    });

    if (!managerChecker) {
      return res
        .status(409)
        .json(responseBody("manager account with email does not exit", 409, []));
    }

    if (managerChecker.password) {
      return res
        .status(409)
        .json(responseBody("manager password already added", 409, []));
    }

    const harsh = bcrypt.hashSync(password);

    let updateManager = await Managers.update(
      { password: harsh },
      { where: { email: email } }
    );

    return res
      .status(200)
      .json(responseBody("manager password added successfully", 200, []));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
