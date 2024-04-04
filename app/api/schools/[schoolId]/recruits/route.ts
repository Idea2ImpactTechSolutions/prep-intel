import { models } from "app/models";
import { Op } from "sequelize";
const { Recruits, Recruiters, Students, Users } = models;
import { responseBody } from "app/config/helpers";

/**
 * @openapi
 * /api/schools/{schoolId}/recruits:
 *   get:
 *     summary: Retrieves a list of recruits for the given school
 *     description: ""
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the school to retrieve recruits for.
 *     responses:
 *       '200':
 *         description: A list of recruits
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   first_name:
 *                     type: string
 *             examples:
 *               One Sample:
 *                 value: '[{"id": 1, "first_name": "John"}]'
 */
export async function GET(
  req: Request,
  { params }: { params: { schoolId: string } }
) {
  try {
    const schoolId = params.schoolId;
    const json = await req.json();
    const getRecruitsRequest = await getRecruits({...json, schoolId });
    return Response.json(
      responseBody("Recruits successfully retrieved", 200, getRecruitsRequest)
    );
  } catch (error: any) {
    // Report
    return Response.json(
      responseBody("Error occurred", 400, { error: error.message }),
      { status: 400 }
    );
  }
}

async function getRecruits(json) {
  const {
    schoolId,
    accepted_connection,
    applicants,
    recruiterId,
    /* include_applicants, -- unused -- */
  } = json;

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
