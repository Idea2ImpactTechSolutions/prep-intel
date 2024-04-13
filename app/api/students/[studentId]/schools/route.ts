import type { NextRequest } from "next/server";
import { responseBody } from "app/config/helpers";
import { models } from "@/app/models";
const { Recruits, School, Students, Users } = models;

const RECRUITS_SCHOOLS_FIELDS = ['school_id', 'school.name']

/**
 * @openapi
 * /api/students/{studentId}/schools:
 *   get:
 *    summary: Find schools of interest by student ID
 *    description: Returns all schools a student has indicated interest in
 *       responses:
 *            200:
 *             description: Schools found
 *             content:
 *               application/json:
 *                 schema:
 *                   type: array
 *                     items:
 *                       type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: Unique ID of a school
 *                           name:
 *                             type: string
 *                             description: Name of a school
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
    const userRole : {role: string} = await Students.findOne({ 
      where: {
        id: params.studentId,
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
 *      description: A list of schools a student is interested in
 *      content:
 *        application/json:
 *          schema:
 *            type: array
 *              items: 
 *                type: string 
 *     responses:
 *       201:
 *        description: Schools added
 *       200:
 *        description: Successful request
 *       400:
 *        description: Bad request
 *       500:
 *        description: Internal server error
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { studentId: string } },
) {
  try {
    // Collect
    const userRole : {role: string} = await Students.findOne({ 
      where: {
        id: params.studentId,
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

    if (userRole.role !== 'student') {
      return Response.json(responseBody("Not Found", 404), { status: 404 });
    }

    const inputData : string[] = await req.json();
    if (inputData.length == 0) {
      return Response.json(responseBody("No Content", 204), { status: 200 });
    }

    const { count, rows } : any = await Recruits.findAndCountAll({
       where: { 
        student_id: params.studentId, 
      }
    });

    if (count > 0 && rows.some(row => row.interested == true)) {
      return Response.json(responseBody("Bad Request", 400), { status: 400 });
    }

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
 *      description: A list of schools a student is interested in
 *      content:
 *        application/json:
 *          schema:
 *            type: array
 *              items: 
 *                type: string 
 *     responses:
 *       200:
 *         description: Schools of interest updated
 *       304:
 *         description: No change to schools of interest
 *       404:
 *        description: Schools of interest not found
 *       500:
 *        description: Internal server error
 */
export async function PATCH(
    req: NextRequest,
    { params }: { params: { studentId: string } }
  ) {
  try {
    // Collect
    const userRole : {role: string} = await Students.findOne({ 
      where: {
        id: params.studentId,
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

    if (userRole.role !== 'student') {
      return Response.json(responseBody("Not Found", 404), { status: 404 });
    }

    const inputData : string[] = await req.json();
    const inputDataRecords = inputData.length;

    if (inputDataRecords == 0) {
      await Recruits.update(
        { interested : false }, 
        { where : {student_id: params.studentId} }
      );
      return Response.json(responseBody("No Content", 204), { status: 200 });
    }

    let studentSchools = await Recruits.findAll({
      where: { student_id: params.studentId }
    });

    if (studentSchools.length == 0) {
      return Response.json(responseBody("Not Found", 404), { status: 404 });
    }

    const studentSchoolIds = studentSchools.map(school => school.school_id);

    if (studentSchoolIds.length == inputDataRecords &&
        studentSchoolIds.every((schoolId) => inputData.includes(schoolId)) &&
        studentSchools.every((school) => school.interested == true)
    ) {
      return Response.json(responseBody("Not Modified", 304), { status: 304 });
    }
    
    // Create or Update
    let newSchoolInterests = inputData.filter(
      (schoolId) => studentSchoolIds.indexOf(schoolId) === -1
    );
    await addNewSchoolInterests(newSchoolInterests, params.studentId);

    const schoolInterestsStatus = Object.assign(
      {},
      ...studentSchools.map(school => ({
        [school.school_id]: school.interested
      }))
    );
    let renewedSchoolInterests = studentSchoolIds.filter(
      (schoolId) => inputData.includes(schoolId)
      && schoolInterestsStatus[schoolId] == false
    );
    await renewSchoolInterests(renewedSchoolInterests, params.studentId);

    let formerSchoolInterests = studentSchoolIds.filter(
      (schoolId) => inputData.indexOf(schoolId) === -1
    );
    if (formerSchoolInterests.length > 0) {
      await Recruits.update(
        { interested: false },
        { where: { 
          student_id: params.studentId, 
          school_id: formerSchoolInterests
        } }
      );
    }

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

function prepareNewRecruits(schoolIds, studentId) {
  return schoolIds.map((schoolId) => ({
    student_id: studentId,
    school_id: schoolId,
    criteria: 'INTERESTED',
    interested: true
  }));
}

async function addNewSchoolInterests(schoolInterests, studentId) {
  if (schoolInterests.length > 0) {
    let newRecruitsData = prepareNewRecruits(
      schoolInterests,
      studentId
    );
    await Recruits.bulkCreate(newRecruitsData);
  }
}

async function renewSchoolInterests(schoolInterests, studentId) {
  if (schoolInterests.length > 0) {
    await Recruits.update(
      { interested: true },
      { where: { 
        student_id: studentId, 
        school_id: schoolInterests
      } }
    );
  }
}
