import { models } from "app/models";
const { ConnectionRequest, Recruits, Recruiters, Students, Users } = models;
import { apiResponse } from "app/config/helpers";
import { type NextRequest } from 'next/server'
import logger from 'lib/logger';

const STUDENT_DETAILS = [
  "act_score",
  "sat_score",
  "gpa",
  "graduation_year",
  "high_school",
  "majors",
  "extracurriculars"
];

const STUDENT_USERS_INCLUSION = {
  model: Users,
  attributes: ["first_name", "last_name"],
  required: true,
};

const RECRUITERS_MODEL_INCLUSION = {
  model: Recruiters,
  attributes: ["id"],
  include: {
    model: Users,
    attributes: ["first_name", "last_name"],
  }
};

const VALID_QUERY_PARAMS = [
  "applicants", 
  "recruiterId", 
  "accepted_connection"
];

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

    if (searchParams.size > 0) {
      const validParams = checkQueryParams(searchParams)
      if (!validParams) {
        return apiResponse("Bad request", 400);
      }
    }

    const requestData = {
      schoolId,
      accepted_connection :searchParams.get('accepted_connection') === 'true',
      applicants : searchParams.get('applicants') === 'true',
      recruiterId : searchParams.get('recruiterId')
    }

    const getRecruitsRequest = await getRecruits(requestData);
    return apiResponse("Recruits successfully retrieved", 200, getRecruitsRequest);
  } catch (error: any) {
    // Report
    logger.error(error.message);
    return apiResponse("Error occurred", 400, { error: error.message });
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
          attributes: STUDENT_DETAILS,
          include: STUDENT_USERS_INCLUSION
        },
        {...RECRUITERS_MODEL_INCLUSION, where: { id: Number(recruiterId) }},
      ],
    }); 
  } else if (accepted_connection) {
      recruits = await Recruits.findAll({
        where: { 
          school_id: schoolId,
         },
        include: [
          {
            model: Students,
            attributes: STUDENT_DETAILS,
            required: true,
            include: [
              STUDENT_USERS_INCLUSION,
              { 
                model: ConnectionRequest, 
                attributes: [], 
                required: true,
                where: { connection_accepted: true } 
              },
            ],
          },
          RECRUITERS_MODEL_INCLUSION,
        ],
      });
  } else if (applicants) {
    recruits = await Recruits.findAll({
      where: { school_id: schoolId, is_applicant: true },
      include: [
        {
          model: Students,
          attributes: STUDENT_DETAILS,
          required: true,
          include: STUDENT_USERS_INCLUSION,
        },
        RECRUITERS_MODEL_INCLUSION,
      ],
      raw: true,
      nest: true,
    });
  } else {
    recruits = await Recruits.findAll({
      where: { 
        school_id: schoolId, 
      },
      include: [
        {
          model: Students,
          attributes: STUDENT_DETAILS,
          include: STUDENT_USERS_INCLUSION
        },
        RECRUITERS_MODEL_INCLUSION
      ],
      raw: true,
      nest: true,
    });
  }
  return recruits;
}

function checkQueryParams(searchParams) {
  for (const key of searchParams.keys()) {
    if (!VALID_QUERY_PARAMS.includes(key)) {
      return false;
    }
  }
  return true;
}
