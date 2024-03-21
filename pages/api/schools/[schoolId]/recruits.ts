import { NextApiRequest, NextApiResponse } from "next";
import { models } from "../../../../app/models";
const { Managers, School, Recruits, Applicants, Recruiters, Students } = models;
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

  let school = await School.findOne({
    where: {
      id: schoolId,
    },
    include: [
      { model: Recruits, where: { is_viewable: true }, as: "new_recruits" },
      { model: Applicants, as: "new_applicants" },
      {model: Students}
      { model: Recruiters, as: "new_recruiters" },
    ],
  });

  if (!school) {
    return { code: 404, message: "Recruiters not found", data: [] };
  }

  const data = {
    recruiters: school.new_recruiters,
    applicants: parseInt(include_applicants) ? school.new_applicants : [],
    recruits: school.new_recruits,
  };

  return { code: 200, data: data, message: "data fetched successfully" };
}
