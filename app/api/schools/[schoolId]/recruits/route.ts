import { models } from "app/models";
const { Recruits, Recruiters, Students, Users } = models;
import { apiResponse } from "app/config/helpers";
import { type NextRequest } from 'next/server'
import logger from 'lib/logger';
import { Op } from "sequelize";

const VALID_QUERY_PARAMS = [
  "applicants",
  "recruiterId",
  "accepted_connection",
  "searchTerm",
  "page",
  "pageSize",
  ""
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
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: The search query to filter first/last names by.
 *         required: false
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: The page index
 *         required: false
 *     responses:
 *       '200':
 *         description: A list of matching recruits
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { schoolId: string } }
) {
  try {
    const schoolId = params.schoolId;
    const searchParams = req.nextUrl.searchParams

    if (searchParams.size > 0) {
      if (!validParams(searchParams)) {
        return apiResponse("Bad request", 400);
      }
    }

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("pageSize") || "10", 10);

    const requestData = {
      schoolId,
      accepted_connection :searchParams.get('accepted_connection') === 'true',
      applicants : searchParams.get('applicants') === 'true',
      recruiterId : searchParams.get('recruiterId'),
      searchTerm: searchParams.get('searchTerm'),
      // Pagination parameters
      page,
      limit,
      offset: (page - 1) * limit,
    }

    const recruits = await getRecruits(requestData);
    return apiResponse("Recruits successfully retrieved", 200, recruits);
  } catch (error: any) {
    // Report
    logger.error(error.message);
    return apiResponse("Error occurred", 400, { error: error.message });
  }
}

async function getRecruits({
  schoolId,
  accepted_connection,
  applicants,
  recruiterId,
  searchTerm,
  page,
  limit,
  offset
}) {
  // Find Recruits by schoolId, conditionally limiting to:
  //   1. student applicants
  //   2. students who accepted connection requests
  //   3. specific recruiter ids
  const {count: totalItems, rows: results} = await Recruits.findAndCountAll({
    where: {
      school_id: schoolId,
      // Conditionally add applicants only constraint
      ...(applicants ? { is_applicant: true } : {}),
    },
    limit: limit,
    offset: offset,
    //order: ['connectionRequestId'],
    raw: true,
    include: [
      {
        model: Students,
        required: true,
        attributes: [
          "act_score",
          "sat_score",
          "gpa",
          "graduation_year",
          "high_school",
          "majors",
          "extracurriculars"
        ],
        include: [{
          model: Users,
          required: true,
          attributes: ["id", "first_name", "last_name"],
          ...(searchTerm ? {
            where: {
              [Op.or]: [
                {
                  first_name: {
                    [Op.iLike]: `%${searchTerm}%`,
                  },
                },
                {
                  last_name: {
                    [Op.iLike]: `%${searchTerm}%`,
                  },
                },
              ],
            }
          } : {}),
        },
        ]
      },
      {
        model: Recruiters,
        attributes: ["id"],
        include: {
          model: Users,
          attributes: ["id", "first_name", "last_name"],
        },
        // Conditionally add  recruiters constraint
        ...(recruiterId ? { where: { id: Number(recruiterId) } } : {}),
      },
    ],
    nest: true,
  });

  // Return results enumeration with additional paging variables
  return {
    recruits: results,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
    currentPage: page,
    pageSize: limit
  };
}

function validParams(searchParams) {
  for (const key of searchParams.keys()) {
    if (!VALID_QUERY_PARAMS.includes(key)) {
      return false;
    }
  }
  return true;
}
