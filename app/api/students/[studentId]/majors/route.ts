import { apiResponse } from "app/config/helpers";
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
      return apiResponse("Major interests not found", 404);
    }

    return apiResponse("Major interests retrieved successfully", 200, studentMajors);
  } catch (error: any) {
    return apiResponse("Internal Server Error", 500, { error: error.message });
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
  const student = await Students.findOne({
    where: {
      id: params.studentId
    }
  });
  if (!student) {
    return apiResponse("Student not found.", 404);
  }
  const majors = await req.json()
  const studentMajorInterests = await updateStudentMajors(student, majors);
  if (!studentMajorInterests) {
    return apiResponse("No majors selected", 200)
  }
  else{
    return apiResponse("Student Major Interests updated successfully.", 200)
  }
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
