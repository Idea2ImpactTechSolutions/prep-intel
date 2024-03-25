import { NextApiRequest, NextApiResponse } from "next";
import { models } from "../../../../app/models";
const { Managers, School, Recruits, Applicants, Recruiters, Students, Users } =
  models;
import { responseBody } from "../../../../app/config/helpers";
import { v4 } from "uuid";

export default async function AuthHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return handleGetRecruits(req, res);
    case "POST":
      return res
        .status(501)
        .json(responseBody("Method Not Implemented", 501, null));
    default:
      return res
        .status(405)
        .json(responseBody("Method Not Allowed", 405, null));
  }
}

async function handleGetRecruits(req, res) {
  try {
    const getRecruitsRequest: any = await getRecruits(req);
    return res.status(getRecruitsRequest.code).json(
      responseBody(getRecruitsRequest.message, getRecruitsRequest.code, {
        data: getRecruitsRequest,
      })
    );
  } catch (error: any) {
    return res
      .status(400)
      .json(responseBody("Error occurred", 400, { error: error.message }));
  }
}

async function getRecruits(req: any) {
  const { schoolId, include_applicants } = req.query;

  let recruits = await Recruits.findAll({
    where: { school_id: schoolId },
    include: [
      { model: School },
      { model: Students, include: {model: Users }  },
      { model: Recruiters, include: {model: Users } },
    ],
  });



  return {
     code: 200,
     data: {
      recruits,
     },
     message: "data fetched successfully" };

}
