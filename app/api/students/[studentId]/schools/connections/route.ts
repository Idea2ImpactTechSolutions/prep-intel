import * as yup from 'yup';
import type { NextRequest } from "next/server";
import { responseBody } from "app/config/helpers";
import { models } from "@/app/models";
import { fn, col, Op } from 'sequelize';
const { ConnectionRequest, Recruits, School, Students, Users } = models;

// TODO: Change type in POST schema to string instead of number 
const POST_VALIDATION_SCHEMA = yup.array().of(
  yup.number().required()
);

const PATCH_VALIDATION_SCHEMA = yup.object({    
  id: yup.number().required(),
  connection_accepted: yup.boolean().required(),
});

const GET_FIELDS = [
  'id', 
  ['school_id', 'schoolId'],
  ['school.name', 'schoolName'],
  [ fn('CONCAT', 
    col('initiator.first_name'), ' ', col('initiator.last_name')
     ), 'initiatorName'
  ],
  ['initiator_role', 'initiatorRole'],
  [ fn('CONCAT', 
      col('recipient.first_name'), ' ', col('recipient.last_name')
    ), 'recipientName'
  ],
  ['create_date', 'requestDate']
]

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
 *                           initiatorName:
 *                             type: string
 *                             description: Name of connection request sender
 *                           initiatorRole:
 *                             type: string
 *                             description: Role of connection request sender
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
    { params }: { params: { studentId: string } }
  ) {
  try {
    // Collect
    const userData : {role: string, id: number} = await getUserData(
      params.studentId
    );

    if (userData.role !== 'student') {
      return Response.json(responseBody("Not Found", 404), { status: 404 });
    }
    
    const studentConnectionRequests: any = await ConnectionRequest.findAll({
      where: {
        [Op.or]: {
          initiator_id: userData.id,
          recipient_id: userData.id
        },
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
          model: Users,
          as: 'initiator',
          attributes: [],
          required: true
        },
        {
          model: Users,
          as: 'recipient',
          attributes: [],
          required: false
        }
      ],
      raw: true,
    });

    return Response.json(
      responseBody(
        "School interests retrieved successfully",
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
 * /api/students/{studentId}/schools/connections:
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
  { params }: { params: { studentId: string } },
) {
  try {
    // Collect
    const userData : {role: string, id: number} = await getUserData(
      params.studentId
    );
    if (userData.role !== 'student') {
      return Response.json(responseBody("Not Found", 404), { status: 404 });
    }

    const inputData : string[] = await req.json();
    if (inputData.length == 0) {
      return Response.json(responseBody("No Content", 204), { status: 200 });
    }

    const validInputData = validateRequestBody(req.method, inputData);
    if (!validInputData) {
      return Response.json(responseBody("Bad Request", 400), { status: 400 });
    }

    const schoolsCount : number = await School.count({
      where: { id: inputData }
    });
    if (schoolsCount < inputData.length) {
      return Response.json(responseBody("Not Found", 404), { status: 404 });
    }

    const { count, rows } : any = await ConnectionRequest.findAndCountAll({
      where: { 
       initiator_id: userData.id, 
     }
    });
    
    // Create
    if (count == 0) {
      await addNewConnections(inputData, params.studentId);
    } else {
      const connectionRequests = rows.map(row => row.school_id);

      let newConnections = inputData.filter(
        (schoolId) => connectionRequests.indexOf(schoolId) === -1
      );
      await addNewConnections(newConnections, params.studentId);
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
    { params }: { params: { studentId: string } }
  ) {
  try {
    // Collect
    const userData : {role: string, id: number} = await getUserData(
      params.studentId
    );
    if (userData.role !== 'student') {
      return Response.json(responseBody("Not Found", 404), { status: 404 });
    }

    const inputData : any = await req.json();

    const validInputData = await validateRequestBody(req.method, inputData);
    if (!validInputData) {
      return Response.json(responseBody("Bad Request", 400), { status: 400 });
    }

    const { connectionRequestId, ...updateAttributes } = Object.assign({}, inputData);

    let connectionRequest = await ConnectionRequest.findOne({
      where: {
        id: connectionRequestId,
        recipient_id: userData.id,
        initiator_role: 'recruiter'
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

async function getUserData(studentId) {
  return await Students.findOne({ 
    where: {
      id: studentId,
    },
    attributes: ['user.role', 'user.id'],
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

function prepareNewConnections(schoolIds, studentId) {
  return schoolIds.map((schoolId) => ({
    school_id: schoolId,
    initiator_id: studentId,
    initiator_role: 'student',
  }));
}

async function addNewConnections(schoolInterests, studentId) {
  if (schoolInterests.length > 0) {
    let newConnections = prepareNewConnections(
      schoolInterests,
      studentId
    );
    await Recruits.bulkCreate(newConnections);
  }
}

function validateRequestBody(method: string, requestBody) {
  switch (method) {
    case 'POST':
      return POST_VALIDATION_SCHEMA.isValidSync(requestBody, { strict: true });
    case 'PATCH':
      return PATCH_VALIDATION_SCHEMA.isValidSync(
        requestBody,
        { strict: true }
      );
    default:
      return false;
  }
}

async function addStudentResponse(connectionRequest, updateAttributes) {
  ConnectionRequest.afterUpdate(connectionRequest => {
    if (connectionRequest.connection_accepted == true) {
      let newRecruitData : object = {
        school_id: connectionRequest.dataValues.school_id,
        student_id: connectionRequest.dataValues.recipient_id,
        recruiter_id: connectionRequest.dataValues.initiator_id
      }
      Recruits.Create(newRecruitData);
    }
  });
  await connectionRequest.update(updateAttributes);
}