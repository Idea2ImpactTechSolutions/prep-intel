import { models } from "app/models";
import { Op } from "sequelize";
const { ConnectionRequest, Recruits, Recruiters, Students, Users } = models;
import { responseBody } from "app/config/helpers";
import { type NextRequest } from 'next/server'
import logger from 'lib/logger';

const STUDENT_STATS = [
  "act_score",
  "sat_score",
  "graduation_year",
  "high_school"
];

const USERS_MODEL_AND_ATTRIBUTES = { 
  model: Users,
  attributes: ["first_name", "last_name"],
  required: true
};

/**
 * @openapi
 * /api/schools/{schoolId}/recruits:
 *   get:
 *     summary: Retrieves a list of recruits for the given school
 *     tags:
 *       - school
 *       - recruit
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
          attributes: STUDENT_STATS,
          include: USERS_MODEL_AND_ATTRIBUTES,
        },
        {
          model: Recruiters,
          where: { id: Number(recruiterId) },
          required: true,
          attributes: [],
          include: USERS_MODEL_AND_ATTRIBUTES,
        },
      ],
      raw: true,
      nest: true,
    }); 
  } else if (accepted_connection) {
      recruits = await Recruits.findAll({
        where: { school_id: schoolId },
        include: [
          {
            model: Students,
            attributes: STUDENT_STATS,
            required: true,
            include: [
              USERS_MODEL_AND_ATTRIBUTES,
              { 
                model: ConnectionRequest, 
                attributes: [], 
                required: true,
                where: { connection_accepted: true } 
              }
            ],
          },
          {
            model: Recruiters,
            attributes: [],
            include: USERS_MODEL_AND_ATTRIBUTES,
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
          attributes: STUDENT_STATS,
          required: true,
          include: USERS_MODEL_AND_ATTRIBUTES,
        },
        {
          model: Recruiters,
          attributes: [],
          include: USERS_MODEL_AND_ATTRIBUTES,
        },
      ],
      raw: true,
      nest: true,
    });
  } else {
    recruits = await Recruits.findAll({
      where: { 
        school_id: schoolId, 
        [Op.or]: [
          { is_applicant: null},
          { contacted: null }
        ]
      },
      include: [
        {
          model: Students,
          attributes: STUDENT_STATS,
        },
        {
          model: Recruiters,
          attributes: [],
          include: USERS_MODEL_AND_ATTRIBUTES
        }
      ],
      raw: true,
      nest: true,
    });
  }
  return recruits;
}
