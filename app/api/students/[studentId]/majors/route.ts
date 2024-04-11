import { responseBody } from "app/config/helpers";
import { NextRequest } from "next/server";
import { models } from "@/app/models";
const { Department, StudentDepartmentInterest, Students } = models;

/**
 * @openapi
 * /api/students/{studentId}/majors:
 *   get:
 *     summary: Retrieves a list of student major interests
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the student
 *     responses:
 *       '200':
 *         description: A list of major interests for the specified student
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   majorName:
 *                     type: string
 *                     description: The name of the major
 *                   interestLevel:
 *                     type: integer
 *                     description: The level of interest in the major
 *       '404':
 *         description: Major interests not found for the specified student
 *       '500':
 *         description: Internal Server Error
 */
export async function GET(
  request: NextRequest,
  { params }: {params: {studentId: string}}
) {
  try {
    const { studentId } = params;

    const studentMajors: any = await getStudentMajors(studentId);
    if (!studentMajors) {
      return Response.json(
        responseBody("Major interests not found", 404, null),
        {
          status: 404,
        }
      );
    }
    return Response.json(
      responseBody(
        "Major interests retrieved successfully",
        200,
        studentMajors
      )
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
 * /api/students/{studentId}/majors:
 *   post:
 *     summary: Create student major interests
 *     description: Takes studentId and majors as params and create records of student major interests.
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the student to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Student major interests created successfully.
 *       200:
 *         description: No input data.
 *       404:
 *         description: Student not found.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { studentId: string } }
) {
  let responseCode = 400;
  let responseMessage = "Bad Request";
  let responseData: any;
  const studentChecker = await Students.findOne({
    where: {
      id: params.studentId
    }
  });
  if (!studentChecker) {
    return Response.json(
      responseBody(
        "Student not found.",
        404
      ),
      {
        status: 404,
      }
    );
  }
  const {majors} = await req.json()

  const recordsToCreate = majors.map(major => ({
    student_id: params.studentId,
    department_id: major
  }));
  let studentMajorInterests = await updateStudentMajors(recordsToCreate);
  if (!studentMajorInterests) {
    responseCode = 200
    responseMessage = "No majors selected"
  }
  else{
    responseCode = 201
    responseMessage = "Student Major Interests created successfully."
    responseData = studentMajorInterests
  }

  return Response.json(
    responseBody(responseMessage, responseCode, responseData),
    {
      status: responseCode,
    }
  );
}

async function getStudentMajors(studentId) {
  return await StudentDepartmentInterest.findAll({
    where: {
      student_id: studentId,
    },
    include: [
      {
        model: Department, // Make sure to import the Department model
        as: 'department',
      },
    ],
  });
}

async function updateStudentMajors(studentMajorInterests) {
  if (!studentMajorInterests) {
    return null;
  }
  return StudentDepartmentInterest.bulkCreate(studentMajorInterests);
}
