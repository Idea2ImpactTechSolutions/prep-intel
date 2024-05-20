import { responseBody } from "app/config/helpers";
import { NextRequest } from "next/server";
import { models } from "@/app/models";
const { Students } = models;

/**
 * @openapi
 * /api/students/{studentId}/extracurriculars:
 *   get:
 *     summary: Retrieves a list of a student's extracurriculars
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
 *         description: A list of extracurricular interests for the specified student
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       '404':
 *         description: Extracurricular interests not found for the specified student
 *       '500':
 *         description: Internal Server Error
 */
export async function GET(
  request: NextRequest,
  { params }: {params: {studentId: string}}
) {
  try {
    const { studentId } = params;

    const studentExtracurriculars: any = await getStudentExtracurriculars(studentId);
    if (studentExtracurriculars === null) {
      return Response.json(
        responseBody("Student not found", 404, null),
        {
          status: 404,
        }
      );
    }
    return Response.json(
      responseBody(
        "Extracurricular interests retrieved successfully",
        200,
        studentExtracurriculars
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
 * /api/students/{studentId}/extracurriculars:
 *   patch:
 *     summary: Update students record with list of extracurriculars
 *     description: Takes studentId and extracurriculars as params and updates "extracurriculars" field of students record.
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
 *             type: array
 *             items: 
 *              type: string
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
  const extracurriculars = await req.json()
  responseCode = 200
  const studentMajorInterests = await updateStudentExtracurriculars(student, extracurriculars);
  if (!studentMajorInterests) {
    responseMessage = "No extracurriculars selected"
  }
  else{
    responseMessage = "Student Extracurricular Interests created successfully."
    responseData = studentMajorInterests
  }

  return Response.json(
    responseBody(responseMessage, responseCode, responseData),
    {
      status: responseCode,
    }
  );
}

async function getStudentExtracurriculars(studentId) {
  const student = await Students.findOne({
    where: {
      id: studentId
    }
  });
  if (!student){
    return null;
  }
  return student.extracurriculars;
}

async function updateStudentExtracurriculars(student, extracurriculars) {
  if (!extracurriculars) {
    return null;
  }
  return await student.update({
    extracurriculars: extracurriculars
  });
}