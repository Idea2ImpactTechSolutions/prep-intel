import * as yup from 'yup';
import type { NextRequest } from "next/server";
import { apiResponse, responseBody } from "app/config/helpers";
import { models } from "@/app/models";
import { ApplicationStatus } from '@/app/enums/application-status';
import { ApplicantStatus } from '@/app/enums/applicant-status';
const { Recruiters, Recruits, School, SchoolAddress, Students, Users } = models;

const POST_VALIDATION_SCHEMA = yup.array().of(
  yup.number().required()
);

const PATCH_VALIDATION_SCHEMA = yup.object({
  school_id: yup.number().required(),
  criteria: yup.string().oneOf(['INTERESTED']).notRequired(),
  interested: yup.boolean().notRequired(),
  is_viewable: yup.boolean().notRequired(),
  application_status: yup.string().oneOf(Object.values(ApplicationStatus)).notRequired(),
  applicant_status: yup.string().oneOf(Object.values(ApplicantStatus)).notRequired()
});

/**
 * @openapi
 * /api/students/{studentId}/schools:
 *   get:
 *     summary: Retrieve a list of schools a student is interested in or recruiters a student is connected with
 *     description: >
 *       Fetches a list of schools that a student, identified by their student ID, has expressed interest in, or a list of recruiters
 *       the student is connected to. The list of schools includes, but is not limited to, school IDs and names. The list of recruiter
 *       connections includes recruiter ids, names, and emails. The response is filtered to include only schools where the student’s interest
 *       is marked as true. This endpoint assumes the existence of an internal mechanism to flag student interest in particular schools.
 *     tags:
 *       - student
 *       - school
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique identifier of the student whose school interests are being queried.
 *       - in: query
 *         name: view
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - connections
 *         description: The name of the page to query results for
 *     responses:
 *       200:
 *         description: School interests or recruiter connections returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   interested:
 *                     type: boolean
 *                     description: Student school interest status.
 *                   school:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The unique identifier of the school.
 *                       name:
 *                         type: string
 *                         description: Name of the school.
 *                       school_address:
 *                         type: object
 *                         properties:
 *                           state:
 *                             type: string
 *                             description: Two letter state code
 *                   recruiter:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The unique identifier of the recruiter.
 *                       user:
 *                         type: object
 *                         properties:
 *                           first_name:
 *                             type: string
 *                             description: The first name of the recruiter.
 *                           last_name:
 *                             type: string
 *                             description: The last name of the recruiter.
 *                           email:
 *                             type: string
 *                             description: The email of the recruiter.
 *       400:
 *         description: Bad request.
 *       404:
 *         description: No schools found or student not found. This can occur if the student does not exist or if none of the schools match the query criteria.
 *       500:
 *         description: A server error occurred while processing the request.
 */
export async function GET(
    req: NextRequest,
    { params }: { params: { studentId: number } }
  ) {
  try {
    // Collect
    const student = Students.findByPk(params.studentId);
    if (!student) {
      return apiResponse("Not Found", 404);
    }

    const searchParams = req.nextUrl.searchParams;

    let modelsToInclude: object[] = [{
      model: School,
      attributes: ['id', 'name'],
      include: {
        model: SchoolAddress,
        as: 'school_address',
        attributes: ['state'],
      },
      required: true
    }];

    let recruitsAttributes = [
      'interested',
      'application_status',
      'applicant_status'
    ];

    if (searchParams.size > 1) {
      return apiResponse("Bad request", 400);
    } else if (searchParams.size === 1) {
      const connectionsRequested = checkSearchParams(searchParams);

      if ( !connectionsRequested ) {
        return apiResponse("Bad request", 400);
      } else {
        modelsToInclude.push({
          model: Recruiters,
          attributes: ['id'],
          include: {
            model: Users,
            attributes: ['first_name', 'last_name', 'email', 'phone', 'profile_image'],
            required: true
          },
          required: true
        });

        recruitsAttributes = ['interested'];
      }
    }

    const studentSchoolsData = await Recruits.findAll({
      where: {
        student_id: params.studentId,
        interested: true
      },
      attributes: recruitsAttributes,
      include: modelsToInclude,
    });

    return apiResponse(
        "School interests retrieved successfully",
        200,
        studentSchoolsData
    );
  } catch (error: any) {
    return apiResponse("Internal Server Error", 500, { error: error.message });
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
    const student = await Students.findByPk(params.studentId);
    if (!student) {
      return apiResponse("Not Found", 404);
    }

    const requestBody = await req.json();

    // Check if the request body is an object, and if so, extract the school IDs
    // to make a connection for
    if (!Array.isArray(requestBody)) {
      await Recruits.findOrCreate({
        where: {
          student_id: params.studentId,
          school_id: requestBody.school_id
        },
        defaults: {
          student_id: params.studentId,
          school_id: requestBody.school_id,
          criteria: 'INTERESTED',
          interested: true,
          is_viewable: true,
        },
      });

      return apiResponse("Connection Created", 201);
    }

    // Otherwise, original case of array of school IDs
    const inputData : number[] = requestBody;
    if (inputData.length == 0) {
      return apiResponse("No Content", 204);
    }

    const validInputData = validateRequestBody(req.method, inputData);
    if (!validInputData) {
      return apiResponse("Bad Request", 400);
    }

    const schoolsCount : number = await School.count({
      where: { id: inputData }
    });
    if (schoolsCount < inputData.length) {
      return apiResponse("Not Found", 404);
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
    return apiResponse("Created", 201);
  } catch (error: any) {
    // Report
    return apiResponse("Internal Server Error", 500, { error: error.message });
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
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The student's ID
 *     requestBody:
 *       description: An object with the school ID a student is interested in, and other fields to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               school_id:
 *                 type: integer
 *                 description: The unique identifier of the school.
 *               interested:
 *                 type: boolean
 *                 description: Student school interest status
 *               application_status:
 *                 type: string
 *                 description: Student-supplied school application status.
 *                 example: Accepted
 *               applicant_status:
 *                 type: string
 *                 description: Student-supplied school applicant status.
 *                 example: Yes
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
    const student = await Students.findByPk(params.studentId);
    if (!student) {
      return apiResponse("Not Found", 404);
    }

    const inputData : any = await req.json();

    const validInputData = await validateRequestBody(req.method, inputData);
    if (!validInputData) {
      return apiResponse("Bad Request", 400);
    }

    const { school_id, ...updateAttributes } = Object.assign({}, inputData);

    let studentSchool = await Recruits.findOne({
      where: {
        student_id: params.studentId,
        school_id: school_id
      }
    });
    if (studentSchool === null) {
      return apiResponse("Not Found", 404);
    }

    // Update
    await studentSchool.update(updateAttributes);

    //Report
    return Response.json(responseBody("No Content", 204), { status: 200 });
  } catch (error: any) {
    // Report
    return apiResponse("Internal Server Error", 500, { error: error.message });
  }
}

function checkSearchParams(searchParams) {
  if (searchParams.has('view') && searchParams.get('view') === 'connections') {
    return true;
  }
  return false;
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