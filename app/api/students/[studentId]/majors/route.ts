import { responseBody } from "app/config/helpers";
import { NextRequest } from "next/server";
import { models } from "@/app/models";
const { Students } = models;

/**
 * @openapi
 * /api/students/{studentId}/majors:
 *   get:
 *     summary: Retrieves a list of student major interests
 *     tags:
 *       - student
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
 * @openapi
 * /api/students/{studentId}/majors:
 *   patch:
 *     summary: Update students record with list of majors
 *     description: Takes studentId and majors as params and updates "majors" field of students record.
 *     tags:
 *       - student
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
 *       200:
 *         description: Student table updated successfully.
 *       404:
 *         description: Student not found.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { studentId: string } }
) {
  let responseCode = 404;
  let responseMessage = "Student not found.";
  let responseData: any;
  const student = await Students.findOne({
    where: {
      id: params.studentId
    }
  });
  if (!student) {
    return Response.json(
      responseBody(
        responseMessage,
        responseCode
      ),
      {
        status: responseCode,
      }
    );
  }
  const majors = await req.json()
  responseCode = 200
  const studentMajorInterests = await updateStudentMajors(student, majors);
  if (!studentMajorInterests) {
    responseMessage = "No majors selected"
  }
  else{
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
  const student = await Students.findOne({
    where: {
      id: studentId
    }
  });
  if (!student){
    return null;
  }
  return student.majors;
}

async function updateStudentMajors(student, majors) {
  if (!majors) {
    return null;
  }
  return await student.update({
    majors: majors
  });
}
