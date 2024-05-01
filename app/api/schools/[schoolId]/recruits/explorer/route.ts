import * as yup from 'yup';
import type { NextRequest } from "next/server";
import { apiResponse } from "app/config/helpers";
import { models } from "@/app/models";
import { col, Op } from 'sequelize';

const {
  ConnectionRequest,
  Recruiters,
  Recruits,
  School,
  Students,
} = models;

const GET_VALIDATION_SCHEMA = yup.object({
  sat_score: yup.number().notRequired(),
  act_score: yup.number().notRequired(),
  gpa: yup.number().notRequired(),
  state: yup.array().of(yup.string().matches(/^[A-Z][A-Z]$/, {
    excludeEmptyString: true,
  })).notRequired()
});

const POST_VALIDATION_SCHEMA = yup.object({
    studentId: yup.number().required(),
    recruiterId: yup.number().required(),
    requestMessage: yup.string().notRequired()
  });

const GET_FIELDS = [
  [ 'id', 'studentId'],
  [ 'act_score', 'studentActScore' ],
  [ 'sat_score', 'studentSatScore' ],
  [ 'gpa', 'studentGpa' ],
  [ 'graduation_year', 'studentGradYear' ],
  [ 'high_school', 'studentHighSchool' ],
  [ col('connection_requests.id'), 'connectionRequestId' ],
  [
    col('connection_requests.connection_accepted'),
    'connectionRequestAccepted'
  ],
  [ col('connection_requests.create_date'), 'requestData' ]
];

/**
 * @openapi
 * /api/schools/{schoolId}/recruits/explorer:
 *   get:
 *     summary: Find students to recruit based on filters
 *     description: |
 *         Returns students based on filters such as GPA, ACT score, SAT score, and state.
 *         If no filters are provided, default filters based on the school's minimum requirements
 *         are applied. Filters for GPA, ACT, and SAT scores return students with scores greater
 *         than or equal to the provided values. The state filter supports a comma-separated list
 *         of state abbreviations.
 *     tags:
 *       - school
 *       - recruit
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         description: Unique identifier of the school
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         description: The page to fetch
 *         schema:
 *           type: integer
 *       - in: query
 *         name: minGpa
 *         description: Minimum GPA of students to filter
 *         schema:
 *           type: number
 *           format: float
 *       - in: query
 *         name: minAct
 *         description: Minimum ACT score of students to filter
 *         schema:
 *           type: number
 *           format: float
 *       - in: query
 *         name: minSat
 *         description: Minimum SAT score of students to filter
 *         schema:
 *           type: number
 *           format: float
 *       - in: query
 *         name: states
 *         description: Comma-separated list of state abbreviations to filter students by location
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Students found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/student-recruit-response'
 *       '400':
 *         description: Bad request due to invalid request parameters
 *       '404':
 *         description: School not found
 *       '500':
 *         description: Internal server error
 */
export async function GET(
    req: NextRequest,
    { params }: { params: { schoolId: number } }
  ) {
  try {
    // Collect
    const school = await School.findByPk(params.schoolId)

    if (!school) {
      return apiResponse("Not Found", 404);
    }

    const searchParams = req.nextUrl.searchParams
    const filters = getFilters(searchParams);

    if (filters) {
      const validFilters = validateRequestBody(req.method, filters);
      if ( !validFilters ) {
        return apiResponse("Bad Request", 400);
      }
    }

    const whereConditions = prepareQueryFilters(
      filters,
      school
    );

    // Pagination parameters
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("pageSize") || "10", 10);
    const offset = (page - 1) * limit;

    const {count, rows} : any = await Students.findAndCountAll({
      where: whereConditions,
      limit: limit,
      offset: offset,
      order: ['connectionRequestId'],
      attributes: GET_FIELDS,
      include: [
        {
          model: ConnectionRequest,
          where: {
            school_id: params.schoolId,
          },
          attributes: [],
          required: false
        },
      ],
      subQuery: false,
      raw: true
    });

    const totalItems = count;
    const totalPages = Math.ceil(totalItems / limit);

    return apiResponse(
      "Students retrieved successfully",
      200,
      {
        students: rows,
        totalItems,
        totalPages,
        currentPage: page,
        pageSize: limit
      });
  } catch (error: any) {
    return apiResponse("Internal Server Error", 500, { error: error.message });
  }
}

/**
 * @openapi
 * /api/schools/{schoolId}/recruits/explorer:
 *   post:
 *     summary: Add new connection requests
 *     description: Creates a new connection request
 *     tags:
 *       - school
 *       - recruit
 *     requestBody:
 *      description: An list of schools a student wants to connect with
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/string-array'
 *     responses:
 *       201:
 *        description: Created
 *       200:
 *        description: Successful request
 *       400:
 *        description: Bad request
 *       404:
 *        description: Not found
 *       409:
 *        description: Conflict
 *       500:
 *        description: Internal server error
 */
export async function POST(
    req: NextRequest,
    { params }: { params: { schoolId: number } },
  ) {
    try {
      // Collect
      const school = await School.findByPk(params.schoolId);

      if ( !school ) {
        return apiResponse("Not Found", 404);
      }

      const inputData = await req.json();
      if (Object.keys(inputData).length == 0) {
        return apiResponse("No Content", 204);
      }

      const validInputData = validateRequestBody(req.method, inputData);
      if ( !validInputData ) {
        return apiResponse("Bad Request", 400);
      }

      const student = await Students.findByPk(inputData.studentId);
      const recruiter = await Recruiters.findByPk(inputData.recruiterId);

      if ( !student || !recruiter ) {
        return apiResponse("Not Found", 404);
      }

      const whereConditions = {
        school_id: params.schoolId,
        student_id: inputData.studentId,
        recruiter_id: inputData.recruiterId
      };

      const existingRecruit = await Recruits.findOne({
        where: whereConditions
      });
      if (existingRecruit) {
        return apiResponse("Conflict", 409);
      }

      // Create
      const [connectionRequest, newRequest] : any = await ConnectionRequest.findOrCreate({
        where: whereConditions
      });

      if (!newRequest) {
        await connectionRequest.update({
            connection_accepted: null
        });
      }
      // Report
      return apiResponse("Created", 201);
    } catch (error: any) {
      // Report
      return apiResponse("Internal Server Error", 500, { error: error.message });
    }
  }

function getFilters(searchParams) {
  if (searchParams.size > 0) {
    const searchParamsMappings = {
      'minGpa': 'gpa',
      'minAct': 'act_score',
      'minSat': 'sat_score',
      'states': 'state'
    };
    const ignoreList = ['page', 'pageSize'];
    let filters : object = {};

    for (const [key, value] of searchParams.entries()) {
      if ( value !== null) {
        if (ignoreList.includes(key)) {
          continue;
        }
        else if (key !== 'states') {
          filters[searchParamsMappings[key]] = Number(value);
        } else {
          filters[searchParamsMappings[key]] = value.toUpperCase().split(",");
        }
      }
    }
    if (Object.keys(filters).length === 0) {
      return false;
    }
    return filters;
  }
  return false;
}

function prepareQueryFilters(filters, school) {
  let schoolMins: object = {};

  if ( filters ) {
    Object.entries(filters).forEach(([key, value]) => {
      if (key !== 'state') {
        schoolMins[key] = { [Op.gte]: value }
      } else {
        schoolMins[key] = value;
      }
    });
  } else {
    schoolMins = {
      sat_score: { [Op.gte]: school.min_sat_score },
      act_score: { [Op.gte]: school.min_act_score },
      gpa: { [Op.gte]: school.gpa_requirement },
    };
  }

  const filterConditions: object = {
    [Op.or]: [
      schoolMins,
      {
        [Op.not]: { '$connection_requests.id$': null },
        '$connection_requests.connection_accepted$' : {
          [Op.or]: [null, false]
        }
      }
    ]
  };
  return filterConditions;
}

function validateRequestBody(method: string, testObject) {
  switch (method) {
    case "GET":
      return GET_VALIDATION_SCHEMA.isValidSync(testObject, { strict: true });
    case "POST":
      return POST_VALIDATION_SCHEMA.isValidSync(testObject, { strict: true });
    default:
      return false;
  }
}