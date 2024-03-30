import { NextApiRequest, NextApiResponse } from "next";
import { models } from "../../../../app/models";
const { Recruits, Recruiters, Students, Users } = models;
import { responseBody } from "../../../../app/config/helpers";

export default async function AuthHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return await handleGetRecruits(req, res);
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
    return res
      .status(200)
      .json(
        responseBody("Recruits successfully retrieved", 200, getRecruitsRequest)
      );
  } catch (error: any) {
    return res
      .status(400)
      .json(responseBody("Error occurred", 400, { error: error.message }));
  }
}

async function getRecruits(req: any) {
  const {
    schoolId,
    accepted_connection,
    applicants,
    recruiterId,
    /* include_applicants, -- unused -- */
  } = req.query;

  let recruits;

  if (recruiterId) {
    recruits = await Recruits.findAll({
      include: [
        {
          model: Students,
          attributes: ["high_school"],
          include: { model: Users, attributes: ["first_name", "last_name"] },
        },
        {
          model: Recruiters,
          where: { id: recruiterId.toString() },
          required: true,
          attributes: [],
          include: { model: Users, attributes: ["first_name", "last_name"] },
        },
      ],
      raw: true,
      nest: true,
    });
  } else if (accepted_connection) {
    recruits = await Recruits.findAll({
      where: { school_id: schoolId, connection_date: { [Op.not]: null } },
      include: [
        {
          model: Students,
          attributes: ["high_school"],
          include: { model: Users, attributes: ["first_name", "last_name"] },
        },
        {
          model: Recruiters,
          attributes: [],
          include: { model: Users, attributes: ["first_name", "last_name"] },
        },
      ],
      raw: true,
      nest: true,
    });
  } else if (applicants) {
    recruits = await Recruits.findAll({
      where: { school_id: schoolId, is_applicant: true },
      include: [
        {
          model: Students,
          attributes: ["high_school"],
          include: { model: Users, attributes: ["first_name", "last_name"] },
        },
        {
          model: Recruiters,
          attributes: [],
          include: { model: Users, attributes: ["first_name", "last_name"] },
        },
      ],
      raw: true,
      nest: true,
    });
  } else {
    recruits = await Recruits.findAll({
      where: { school_id: schoolId, connection_date: null },
      include: [
        {
          model: Students,
          attributes: ["high_school"],
        },
      ],
      raw: true,
      nest: true,
    });
  }
  return recruits;
}
