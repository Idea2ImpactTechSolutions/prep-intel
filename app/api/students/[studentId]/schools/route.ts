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
 *     summary: Retrieve a list of schools a student is interested in
 *     description: >
 *       Fetches a list of schools that a student, identified by their student ID, has expressed interest in. This list includes,
 *       but is not limited to, school IDs and names. The response is filtered to include only schools where the student’s interest
 *       is marked as true. This endpoint assumes the existence of an internal mechanism to flag student interest in particular schools.
 *     tags:
 *       - student
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique identifier of the student whose school interests are being queried.
 *     responses:
 *       200:
 *         description: School interests returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   schoolId:
 *                     type: integer
 *                     description: The unique identifier of the school.
 *                   schoolName:
 *                     type: string
 *                     description: The name of the school.
 *                   interested:
 *                     type: boolean
 *                     description: Indicates whether the student is interested in the school.
 *       404:
 *         description: No schools found or student not found. This can occur if the student does not exist or if none of the schools match the query criteria.
 *       500:
 *         description: A server error occurred while processing the request.
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
 * @openapi
 * /api/students/{studentId}/schools:
 *   post:
 *     summary: Add or renew schools of interest for a student
 *     description: |
 *       Adds new schools to a student’s list of interests if they are not already interested in them and renews interest in previously added schools.
 *       This endpoint differentiates between adding new interests versus renewing existing ones based on the student's current interests.
 *       Only schools that exist in the database can be added or renewed.
 *     tags:
 *       - student
 *       - school
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The student's ID
 *     requestBody:
 *       required: true
 *       description: An array of school IDs that the student is interested in
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: integer
 *             description: School IDs
 *     responses:
 *       201:
 *         description: Schools of interest added or renewed
 *       200:
 *         description: Request was successful but no content was processed (e.g., empty input list)
 *       400:
 *         description: Invalid input data (e.g., invalid school IDs)
 *       404:
 *         description: |
 *           One or more of the following not found:
 *           - The student with the provided ID
 *           - One or more schools in the input data
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
 * @openapi
 * /api/students/{studentId}/schools:
 *   patch:
 *     summary: Update a student's schools of interest
 *     description: Updates the list of schools a student is interested in
 *     tags:
 *       - student
 *       - school
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