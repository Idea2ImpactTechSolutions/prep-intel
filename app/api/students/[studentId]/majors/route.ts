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
    const student = await Students.findByPk(params.studentId)
    if (!student) {
      // TODO: This is incorrect, and only now evident because the behavior is surfaced and it's obvious that the student is actually not found.
      return apiResponse("Major interests not found", 404);
    }

    return apiResponse("Major interests retrieved successfully", 200, student.majors || []);
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
  const student = await Students.findByPk(params.studentId);
  if (!student) {
    return apiResponse("Student not found.", 404);
  }
  const majors = await req.json()
  if (!majors) {
    // TODO: Why do this instead of just clearing majors when an empty array is passed?
    return apiResponse("No majors selected", 200)
  }
  else{
    await student.update({ majors });
    return apiResponse("Student Major Interests updated successfully.", 200)
  }
}

