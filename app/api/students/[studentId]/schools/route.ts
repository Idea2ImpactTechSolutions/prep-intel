import * as yup from 'yup';
import type { NextRequest } from "next/server";
import { responseBody } from "../../../../../app/config/helpers";
import { models } from "../../../../../app/models";
const { Recruits, School, Students, Users } = models;

const POST_VALIDATION_SCHEMA = yup.array().of(
  yup.number().required()
);

const PATCH_VALIDATION_SCHEMA = yup.object({    
  school_id: yup.number().required(),
  criteria: yup.string().oneOf(['INTERESTED']).notRequired(),
  interested: yup.boolean().notRequired(),
  is_viewable: yup.boolean().notRequired(),
});

const RECRUITS_SCHOOLS_FIELDS = ['school_id', 'interested', 'school.name']

/**
 * @openapi
 * /api/students/{studentId}/schools:
 *   get:
 *     summary: Find schools of interest by student ID
 *     description: Returns all schools a student has indicated interest in
 *     responses:
 *       200:
 *         description: Schools found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Unique ID of a school
 *                   name:
 *                     type: string
 *                     description: Name of a school
 *       404:
 *         description: Student not found
 *       500:
 *         description: Internal server error
 */
export async function GET(
    req: Request,
    { params }: { params: { studentId: number } }
  ) {
  try {
    // Collect
    const userRole : {role: string} = await getUserRole(params.studentId);

    if (userRole.role !== 'student') {
      return Response.json(responseBody("Not Found", 404), { status: 404 });
    }

    const studentSchools: any = await Recruits.findAll({
      where: {
        student_id: params.studentId,
        interested: true
      },
      attributes: RECRUITS_SCHOOLS_FIELDS,
      include: {
          model: School,
          attributes: [],
          required: true,
      },
      raw: true,
    });

    return Response.json(
      responseBody(
        "School interests retrieved successfully",
        200,
        studentSchools
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
 *   post:
 *     summary: Add new schools of interest by student ID
 *     description: Sets a student as a recruit for each school of interest
 *     requestBody:
 *       description: A list of schools a student is interested in
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: string
 *     responses:
 *       201:
 *         description: Schools added
 *       200:
 *         description: Successful request
 *       400:
 *         description: Bad request
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { studentId: number } },
) {
  try {
    // Collect
    const userRole : { role: string } = await getUserRole(params.studentId);

    if (userRole.role !== 'student') {
      return Response.json(responseBody("Not Found", 404), { status: 404 });
    }

    const inputData : number[] = await req.json();
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

    const { count, rows } : any = await Recruits.findAndCountAll({
      where: {
       student_id: params.studentId,
     }
   });

    // Create or Update
    if (count == 0) {
      await addNewSchoolInterests(inputData, params.studentId);
    } else {
      const studentSchoolIds = rows.map(row => row.school_id);

      let newStudentSchools = inputData.filter(
        (schoolId) => studentSchoolIds.indexOf(schoolId) === -1
      );
      await addNewSchoolInterests(newStudentSchools, params.studentId);

      let renewedSchoolInterests = studentSchoolIds.filter(
        (schoolId) => inputData.includes(schoolId)
      );
      await renewSchoolInterests(renewedSchoolInterests, params.studentId);
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
 *     summary: Update a student's schools of interest
 *     description: Updates the list of schools a student is interested in
 *     requestBody:
 *       description: A list of schools a student is interested in
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: string
 *     responses:
 *       200:
 *         description: Schools of interest updated
 *       400:
 *         description: Bad request
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
export async function PATCH(
    req: NextRequest,
    { params }: { params: { studentId: number } }
  ) {
  try {
    // Collect
    const userRole : { role: string } = await getUserRole(params.studentId);

    if (userRole.role !== 'student') {
      return Response.json(responseBody("Not Found", 404), { status: 404 });
    }

    const inputData : any = await req.json();

    const validInputData = await validateRequestBody(req.method, inputData);
    if (!validInputData) {
      return Response.json(responseBody("Bad Request", 400), { status: 400 });
    }

    const { schoolId, ...updateAttributes } = Object.assign({}, inputData);

    let studentSchool = await Recruits.findOne({
      where: {
        student_id: params.studentId,
        school_id: schoolId
      }
    });
    if (studentSchool === null) {
      return Response.json(responseBody("Not Found", 404), { status: 404 });
    }

    // Update
    if (updateAttributes.hasOwnProperty('connection_initiator')) {
      updateAttributes['connection_date'] = new Date();
    }
    await studentSchool.update(updateAttributes);

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

function prepareNewRecruits(schoolIds: number[], studentId: number) {
  return schoolIds.map((schoolId) => ({
    student_id: studentId,
    school_id: schoolId,
    criteria: 'INTERESTED',
    interested: true,
    is_viewable: true
  }));
}

async function addNewSchoolInterests(
  schoolInterests: number[], 
  studentId: number
) {
  if (schoolInterests.length > 0) {
    let newRecruitsData = prepareNewRecruits(
      schoolInterests,
      studentId
    );
    await Recruits.bulkCreate(newRecruitsData);
  }
}

async function renewSchoolInterests(
  schoolInterests: number[], 
  studentId : number
) {
  if (schoolInterests.length > 0) {
    await Recruits.update(
      {
        criteria: 'INTERESTED',
        interested: true,
        is_viewable: true,
      },
      { where: {
        student_id: studentId,
        school_id: schoolInterests
      } }
    );
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