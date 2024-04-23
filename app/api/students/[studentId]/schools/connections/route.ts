import * as yup from 'yup';
import type { NextRequest } from "next/server";
import { responseBody } from "app/config/helpers";
import { models } from "@/app/models";
import { fn, col } from 'sequelize';
const { 
  ConnectionRequest, 
  Recruiters, 
  Recruits, 
  School, 
  Students, 
  Users 
} = models;

const PATCH_VALIDATION_SCHEMA = yup.object({    
  connectionReqId: yup.number().required(),
  connection_accepted: yup.boolean().required(),
});

const GET_FIELDS = [
  'id', 
  [ 'school_id', 'schoolId' ],
  [ col('school.name'), 'schoolName'],
  [ fn('CONCAT',
       col('recruiter->user.first_name'), ' ', col('recruiter->user.last_name')
    ), 'recruiterName'
  ],
  [ 'create_date', 'requestDate' ]
];

/**
 * @openapi
 * /api/students/{studentId}/schools/connections:
 *   get:
 *    summary: Find open connection requests
 *    description: Returns open connection requests a student has sent or received
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
 *                             type: number
 *                             description: Unique ID of a connection request
 *                           schoolId:
 *                             type: string
 *                             description: Unique ID of a school
 *                           schoolName:
 *                             type: string
 *                             description: School name
 *                           recruiterName:
 *                             type: string
 *                             description: Name of recruiter who sent request
 *                           requestDate:
 *                             type: date
 *                             description: Connection request date
 *             404:
 *              description: Student not found
 *             500:
 *              description: Internal server error       
 */
export async function GET(
    req: Request,
    { params }: { params: { studentId: number } }
  ) {
  try {
    // Collect
    const userRole : {role: string} = await getUserRole(
      params.studentId
    );

    if (userRole.role !== 'student') {
      return Response.json(responseBody("Not Found", 404), { status: 404 });
    }
    
    const studentConnectionRequests: any = await ConnectionRequest.findAll({
      where: {
        student_id: params.studentId,
        connection_accepted: null
      },
      attributes: GET_FIELDS,
      include: [
        {
          model: School,
          attributes: [],
          required: true,
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
        "Recruiter connection requests retrieved successfully",
        200,
        studentConnectionRequests
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
 * /api/students/{studentId}/schools:
 *   patch:
 *     summary: Update a connection request with a student's response
 *     description: Updates a connection request initiated by a recruiter
 *     requestBody:
 *      description: An object with a connection request id and response
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *              properties:
 *                id:
 *                  type: string
 *                response:
 *                  type: boolean
 *     responses:
 *       200:
 *         description: Connection request updated
 *       400:
 *        description: Bad request
 *       404:
 *        description: Not found
 *       500:
 *        description: Internal server error
 */
export async function PATCH(
    req: NextRequest,
    { params }: { params: { studentId: number } }
  ) {
  try {
    // Collect
    const userRole : {role: string} = await getUserRole(
      params.studentId
    );
    if (userRole.role !== 'student') {
      return Response.json(responseBody("Not Found", 404), { status: 404 });
    }

    const inputData : any = await req.json();

    const validInputData = validateRequestBody(req.method, inputData);
    if (!validInputData) {
      return Response.json(responseBody("Bad Request", 400), { status: 400 });
    }

    const { connectionReqId, ...updateAttributes } = Object.assign({}, inputData);

    let connectionRequest = await ConnectionRequest.findOne({
      where: {
        id: connectionReqId,
        student_id: params.studentId
      }
    });
    if (connectionRequest === null) {
      return Response.json(responseBody("Not Found", 404), { status: 404 });
    }

    // Update
    await addStudentResponse(connectionRequest, updateAttributes);

    //Report
    return Response.json(responseBody("No Content", 204), { status: 200 });
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

async function getUserRole(studentId) {
  return await Students.findOne({ 
    where: {
      id: studentId,
    },
    attributes: ['user.role'],
    include: [{
      model: Users,
      required: true,
      attributes: [],
      where: {
        role: 'student'
      }
    }],
    raw: true
  });
}

function validateRequestBody(method: string, requestBody) {
  return PATCH_VALIDATION_SCHEMA.isValidSync(
    requestBody,
    { strict: true }
  );
}

async function addStudentResponse(connectionRequest, updateAttributes) {
  ConnectionRequest.afterUpdate(connectionRequest => {
    if (connectionRequest.connection_accepted == true) {
      let newRecruitData : object = {
        school_id: connectionRequest.dataValues.school_id,
        student_id: connectionRequest.dataValues.student_id,
        recruiter_id: connectionRequest.dataValues.recruiter_id
      }
      Recruits.create(newRecruitData);
    }
  });
  await connectionRequest.update(updateAttributes);
}