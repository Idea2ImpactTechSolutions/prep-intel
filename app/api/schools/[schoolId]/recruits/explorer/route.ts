import * as yup from 'yup';
import type { NextRequest } from "next/server";
import { responseBody } from "app/config/helpers";
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
  [ col('connection_requests.connection_accepted'), 'connectionRequestAccepted' ],
  [ col('connection_requests.create_date'), 'requestData' ]
];

/**
 * @openapi
 * /api/schools/{schoolId}/recruits/explorer:
 *   get:
 *    summary: Find students to recruit
 *    description: Returns students
 *       responses:
 *            200:
 *             description: Students found
 *             content:
 *               application/json:
 *                 schema:
 *                   type: array
 *                     items:
 *                       type: object
 *                         properties:
 *                           studentId:
 *                              type: number
 *                              description: Unique ID of a student
 *                           studentActScore:
 *                              type: number
 *                              description: Student ACT score
 *                           studentSatScore:
 *                              type: number
 *                              description: Student SAT Score
 *                           studentGpa:
 *                              type: number
 *                              description: Student GPA
 *                           studentGradYear:
 *                              type: number
 *                              description: Student expected graduation year
 *                           studentHighSchool:
 *                              type: string
 *                              description: Name of high school student attends
 *                           connectionRequestId:
 *                              type: string
 *                              description: Unique ID of a connection request
 *                           connectionRequestStatus:
 *                              type: boolean
 *                              description: Connection request status
 *                           requestDate:
 *                              type: date
 *                              description: Connection request date
 *             404:
 *              description: Student not found
 *             500:
 *              description: Internal server error       
 */
export async function GET(
    req: NextRequest,
    { params }: { params: { schoolId: number } }
  ) {
  try {
    // Collect
    const school = await School.findByPk(params.schoolId)

    if (!school) {
      return Response.json(responseBody("Not Found", 404), { status: 404 });
    }

    const searchParams = req.nextUrl.searchParams
    const filters = getFilters(searchParams);

    if (filters) {
      const validFilters = validateRequestBody(req.method, filters);
      if ( !validFilters ) {
        return Response.json(responseBody("Bad Request", 400), { status: 400 });
      }
    }

    const whereConditions = prepareQueryFilters(
      filters, 
      school
    );
    
    const students: any = await Students.findAll({
      where: whereConditions,
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
      raw: true
    });

    return Response.json(
      responseBody(
        "Students retrieved successfully",
        200,
        students
      ),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return Response.json(
      responseBody("Internal Server Error", 500, { error: error.message }),
      {
        status: 500,
      }
    );
  }
}

/**
 * @swagger
 * /api/schools/{schoolId}/recruits/explorer:
 *   post:
 *     summary: Add new connection requests
 *     description: Creates a new connection request
 *     requestBody:
 *      description: An list of schools a student wants to connect with
 *      content:
 *        application/json:
 *          schema:
 *            type: array
 *              items: 
 *                type: string 
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
        return Response.json(responseBody("Not Found", 404), { status: 404 });
      }
  
      const inputData = await req.json();
      if (Object.keys(inputData).length == 0) {
        return Response.json(responseBody("No Content", 204), { status: 200 });
      }
  
      const validInputData = validateRequestBody(req.method, inputData);
      if ( !validInputData ) {
        return Response.json(responseBody("Bad Request", 400), { status: 400 });
      }
  
      const student = await Students.findByPk(inputData.studentId);
      const recruiter = await Recruiters.findByPk(inputData.recruiterId);
      
      if ( !student || !recruiter ) {
        return Response.json(responseBody("Not Found", 404), { status: 404 });
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
        return Response.json(responseBody("Conflict", 409), { status: 409 });
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
      return Response.json(responseBody("Created", 201), { status: 201 });
    } catch (error: any) {
      // Report
      return Response.json(
        responseBody("Internal Server Error", 500, { error: error.message }),
        {
          status: 500,
        }
      );
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
    let filters : object = {};
    for (const [key, value] of searchParams.entries()) {
      if ( value !== null) {
        if (key !== 'states') {
          filters[searchParamsMappings[key]] = Number(value);
        } else {
          filters[searchParamsMappings[key]] = value.toUpperCase().split(",");
        }
      }
    }
    return filters;
  }
  return false;
}

function prepareQueryFilters(filters, school) {
  let filterConditions: object = {};

  if ( filters ) {
    Object.entries(filters).forEach(([key, value]) => {
      if (key !== 'state') {
        filterConditions[key] = { [Op.gte]: value }
      } else {
        filterConditions[key] = value;
      }
    });
  } else {
    filterConditions = {
      sat_score: { [Op.gte]: school.min_sat_score },
      act_score: { [Op.gte]: school.min_act_score },
      gpa: { [Op.gte]: school.gpa_requirement },
    };
  }

  Object.assign(filterConditions, {
    '$connection_requests.connection_accepted$' : { [Op.or]: [null, false] }
  });

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