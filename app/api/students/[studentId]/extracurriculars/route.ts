import { apiResponse } from "app/config/helpers";
import { NextRequest } from "next/server";
import { models } from "@/app/models";
const { Students, Users } = models;

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
      return apiResponse("Student not found", 404);
    }
    return apiResponse(
      "Extracurricular interests retrieved successfully",
        200,
        studentExtracurriculars);
  } catch (error: any) {
    return apiResponse("Internal Server Error", 500, { error: error.message });
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
  const student = await Students.findByPk(params.studentId, {
    include: {
      model: Users,
      attributes: ["id","profile_complete"],
    },
  });
  if (!student) {
    return apiResponse("Student not found", 404);
  }
  const extracurriculars = await req.json()

  const studentMajorInterests = await updateStudentExtracurriculars(student, extracurriculars);

  if (!studentMajorInterests) {
    return apiResponse("No extracurriculars selected", 200);
  }
  else{
    return apiResponse("Student Extracurricular Interests created successfully.", 200, studentMajorInterests);
  }
}

async function getStudentExtracurriculars(studentId) {
  const student = await Students.findByPk(studentId);
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
    extracurriculars
  });
}