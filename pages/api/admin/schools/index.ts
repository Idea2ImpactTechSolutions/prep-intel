import { NextApiRequest, NextApiResponse } from "next";
import { models } from "../../../../app/models";
const { Managers, School, Users } = models;
import { responseBody } from "../../../../app/config/helpers";
import { v4 } from "uuid";

export default async function AuthHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    try {

    let school = await School.findAll({attributes: ['id','name', "is_active", "publish_date"]});
   
    return res
      .status(200)
      .json(
        responseBody("schools data returned successfully", 200, [
          { school },
        ])
      );
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
