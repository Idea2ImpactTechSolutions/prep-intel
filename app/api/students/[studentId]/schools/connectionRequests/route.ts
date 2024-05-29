import * as yup from 'yup';
import type { NextRequest } from "next/server";
import { apiResponse } from "@/app/config/helpers";
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

const POST_VALIDATION_SCHEMA = yup.object({
  studentId: yup.number().required(),
  recruiterId: yup.number().required(),
  schoolId: yup.number().notRequired(),
  requestMessage: yup.string().notRequired()
});

const GET_FIELDS = [
  'id',
  [ col('school.name'), 'schoolName'],
  [ fn('CONCAT',
       col('recruiter->user.first_name'), ' ', col('recruiter->user.last_name')
    ), 'recruiterName'
  ],
  [ 'create_date', 'requestDate' ],
  ['connection_accepted', 'requestStatus']
];

/**
 * @openapi
 * /api/students/{studentId}/schools/connectionRequests:
 *   get:
 *     summary: Find open connection requests
 *     description: Returns open connection requests sent to a student
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the student to retrieve.
 *     tags:
 *       - student
 *       - recruit
 *     responses:
 *       '200':
 *         description: Connection requests found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/student-connection-response'
 *       '404':
 *         description: Student not found
 *       '500':
 *         description: Internal server error
 */
export async function GET(
    req: Request,
    { params }: { params: { studentId: number } }
  ) {
  try {
    const student = await Students.findByPk(params.studentId);
    if (!student) {
      return apiResponse("Not Found", 404);
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

    return apiResponse(
        "Recruiter connection requests retrieved successfully",
        200,
        studentConnectionRequests
      );
  } catch (error: any) {
    return apiResponse("Internal Server Error", 500, { error: error.message });
  }
}

/**
 * @openapi
 * /api/students/{studentId}/schools/connectionRequests:
 *   patch:
 *     summary: Update a connection request with a student's response
 *     description: Updates a connection request initiated by a recruiter
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the student to retrieve.
 *     tags:
 *       - student
 *       - school
 *     requestBody:
 *      description: An object with a connection request ID and response
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              connectionReqId:
 *                type: integer
 *              connection_accepted:
 *                type: boolean
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
    const student = await Students.findByPk(params.studentId);
    if (!student) {
      return apiResponse("Not Found", 404);
    }

    const inputData : any = await req.json();

    if (!validateRequestBody(req.method, inputData)) {
      return apiResponse("Bad Request", 400);
    }

    const { connectionReqId, ...updateAttributes } = Object.assign({}, inputData);

    let connectionRequest = await ConnectionRequest.findOne({
      where: {
        id: connectionReqId,
        student_id: params.studentId
      }
    });
    if (connectionRequest === null) {
      return apiResponse("Not Found", 404);
    }

    // Update
    await addStudentResponse(connectionRequest, updateAttributes);

    //Report
    return apiResponse("No Content", 204);
  } catch (error: any) {
    // Report
    return apiResponse("Internal Server Error", 500, { error: error.message });
  }
}

/**
 * @openapi
 * /api/students/{studentId}/schools/connectionRequests:
 *   post:
 *     summary: Add new connection requests
 *     description: Creates a new connection request
 *     tags:
 *       - school
 *       - recruit
 *       - recruiter
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         description: Unique identifier of the student
 *         schema:
 *           type: integer
 *     requestBody:
 *      description: An object with a recruiter ID and their affiliated school ID
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              recruiterId:
 *                type: integer
 *              schoolId:
 *                type: integer
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
  { params }: { params: { studentId: number } },
) {
  try {
    const student = await Students.findByPk(params.studentId);
    if ( !student ) {
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

    const school = await School.findByPk(inputData.schoolId);
    const recruiter = await Recruiters.findByPk(inputData.recruiterId);

    if ( !school || !recruiter ) {
      return apiResponse("Not Found", 404);
    }

    const whereConditions = {
      student_id: params.studentId,
      school_id: inputData.schoolId,
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


function validateRequestBody(method: string, requestBody) {
  switch (method) {
    case "PATCH":
      return PATCH_VALIDATION_SCHEMA.isValidSync(requestBody, { strict: true });
    case "POST":
      return POST_VALIDATION_SCHEMA.isValidSync(requestBody, { strict: true });
    default:
      return false;
  }
}

async function addStudentResponse(connectionRequest, updateAttributes) {
  ConnectionRequest.afterUpdate( async (connectionRequest) => {
    if (connectionRequest.connection_accepted == true) {
      let newRecruitData : object = {
        interested: true,
        is_viewable: true
      }
      let [resultingRecruit, isNew] = await Recruits.findOrCreate({
        where: {
          school_id: connectionRequest.dataValues.school_id,
          student_id: connectionRequest.dataValues.student_id,
          recruiter_id: connectionRequest.dataValues.recruiter_id
        },
        defaults: newRecruitData,
      });
      if (!isNew) {
        await resultingRecruit.update(newRecruitData);
      }
    }
  });
  await connectionRequest.update(updateAttributes, { individualHooks: true });
}