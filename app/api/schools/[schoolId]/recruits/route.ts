import { models } from "app/models";
import { Op } from "sequelize";
const { Recruits, Recruiters, Students, Users } = models;
import { responseBody } from "app/config/helpers";
import { type NextRequest } from 'next/server'
import logger from 'lib/logger';

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
 *       - in: query
 *         name: recruiterId
 *         schema:
 *           type: string
 *         description: The search query to filter recruits who are connected with a given recruiter.
 *         required: false
 *       - in: query
 *         name: accepted_connection
 *         schema:
 *           type: string
 *         description: The search query to filter for students that have accepted a connection with the school.
 *         required: false
 *       - in: query
 *         name: applicants
 *         schema:
 *           type: string
 *         description: The search query to filter recruiters by who have applied to the school.
 *         required: false
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
  req: NextRequest,
  { params }: { params: { schoolId: string } }
) {
  try {
    const schoolId = params.schoolId;
    const searchParams = req.nextUrl.searchParams
    const requestData = {
      schoolId,
      accepted_connection :searchParams.get('accepted_connection') === 'true',
      applicants : searchParams.get('applicants') === 'true',
      recruiterId : searchParams.get('recruiterId')
    }

    const getRecruitsRequest = await getRecruits(requestData);
    return Response.json(
      responseBody("Recruits successfully retrieved", 200, getRecruitsRequest)
    );
  } catch (error: any) {
    // Report
    logger.error(error.message);
    return Response.json(
      responseBody("Error occurred", 400, { error: error.message }),
      { status: 400 }
    );
  }
}

async function getRecruits(requestData) {

  let recruits;
  const {
    schoolId,
    accepted_connection,
    applicants,
    recruiterId,
  } = requestData;

  if (recruiterId) {
    recruits = await Recruits.findAll({
      include: [
        {
          model: Students,
          attributes: ["act_score","sat_score","graduation_year","high_school"],
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
          attributes: ["act_score","sat_score","graduation_year","high_school"],
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
          attributes: ["act_score","sat_score","graduation_year","high_school"],
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
