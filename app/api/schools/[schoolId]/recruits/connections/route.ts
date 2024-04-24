import * as yup from 'yup';
import type { NextRequest } from "next/server";
import { responseBody } from "app/config/helpers";
import { models } from "@/app/models";
import { fn, col } from 'sequelize';
const { 
  ConnectionRequest, 
  Recruiters, 
  School, 
  Students, 
  Users 
} = models;

const POST_VALIDATION_SCHEMA = yup.object({    
    studentId: yup.number().required(),
    recruiterId: yup.number().required(),
    requestMessage: yup.string().notRequired()
  });

const GET_FIELDS = [
  'id', 
  [ col('student.act_score'), 'studentActScore' ],
  [ col('student.sat_score'), 'studentSatScore' ],
  [ col('student.gpa'), 'studentGpa' ],
  [ col('student.graduation_year'), 'studentGradYear' ],
  [ col('student.high_school'), 'studentHighSchool' ],
  [ fn('CONCAT',
       col('recruiter->user.first_name'), ' ', col('recruiter->user.last_name')
    ), 'recruiterName'
  ],
  [ 'create_date', 'requestDate' ]
];

/**
 * @openapi
 * /api/schools/{schoolId}/recruits/connections:
 *   get:
 *    summary: Find open connection requests
 *    description: Returns open connection requests sent to students
 *       responses:
 *            200:
 *             description: Connection requests found
 *             content:
 *               application/json:
 *                 schema:
 *                   type: array
 *                     items:
 *                       type: object
 *                         properties:
 *                           id:
 *                              type: number
 *                              description: Unique ID of a connection request
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
 *                           recruiterName:
 *                              type: string
 *                              description: Name of recruiter who sent request
 *                           requestDate:
 *                              type: date
 *                              description: Connection request date
 *             404:
 *              description: Student not found
 *             500:
 *              description: Internal server error       
 */
export async function GET(
    req: Request,
    { params }: { params: { schoolId: number } }
  ) {
  try {
    // Collect
    const school = await School.findByPk(params.schoolId)

    if (!school) {
      return Response.json(responseBody("Not Found", 404), { status: 404 });
    }
    
    const openConnectionRequests: any = await ConnectionRequest.findAll({
      where: {
        school_id: params.schoolId,
        connection_accepted: null
      },
      attributes: GET_FIELDS,
      include: [
        {
            model: Students,
            attributes: [],
            required: true
        },
        {
            model: Recruiters,
            attributes: [],
            include: [{
                model: Users,
                attributes: [],
                required: true,
            }],
            required: true,
        },
      ],
      raw: true,
    });

    return Response.json(
      responseBody(
        "Open connection requests retrieved successfully",
        200,
        openConnectionRequests
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
 * /api/schools/{schoolId}/recruits/connections:
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
 *       500:
 *        description: Internal server error
 */
export async function POST(
    req: NextRequest,
    { params }: { params: { schoolId: number } },
  ) {
    try {
      // Collect
      const school = await School.getByPk(params.schoolId);

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
      
      // Create
      const [connectionRequest, newRequest] : any = await ConnectionRequest.findOrCreate({
        where: { 
         school_id: params.schoolId,
         student_id: inputData.studentId,
         recruiter_id: inputData.recruiterId
       }
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


function validateRequestBody(method: string, requestBody) {
  return POST_VALIDATION_SCHEMA.isValidSync(
    requestBody,
    { strict: true }
  );
}