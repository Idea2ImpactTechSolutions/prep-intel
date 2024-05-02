import type { NextRequest } from "next/server";
import { models } from "@/app/models";
import { apiResponse } from "@/app/config/helpers";
const { Users, Students } = models;

const STUDENT_FIELDS = [
  "id",
  "dob",
  "state",
  "city",
  "graduation_year",
  "high_school",
  "guardian_first_name",
  "guardian_last_name",
  "guardian_email",
];
const USER_FIELDS = ["id", "first_name", "last_name"];

/**
 * @openapi
 * /api/students/{studentId}/vitals:
 *   get:
 *     summary: Retrieve student vitals information
 *     description: Fetches the vital information of a student by their ID.
 *     tags:
 *       - student
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the student to retrieve.
 *     responses:
 *       200:
 *         description: Student Vitals information retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { studentId: string } }
) {
  const studentVitals = await Students.findOne({
    where: { id: params.studentId },
    attributes: STUDENT_FIELDS,
    include: [
      {
        model: Users,
        attributes: USER_FIELDS,
        required: true,
      },
    ],
    raw: true,
    nest: true,
  });

  if (studentVitals === null) {
    return apiResponse("Student not found", 404);
  }

  return apiResponse("Student Vitals information retrieved successfully.", 200, studentVitals)
}

/**
 * @openapi
 * /api/students/{studentId}/vitals:
 *   post:
 *     summary: Updates student vitals
 *     description: Takes form field values posted in the body and updates them in the database.
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
 *         description: Student vitals updated successfully.
 *       400:
 *         description: Invalid input data.
 *       404:
 *         description: Student not found.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { studentId: string } }
) {
  const formData = await req.json();

  let studentVitals = await Students.findOne({
    where: { id: params.studentId },
    include: [{
      model: Users,
      attributes: USER_FIELDS,
      required: true,
     }],
    attributes: STUDENT_FIELDS,
  });

  if (studentVitals === null) {
    return apiResponse("Student not found", 404);
  } else {
    studentVitals.set(formData)

    if (studentVitals.user.changed)
    {
      await studentVitals.user.save();
    }

    if (studentVitals.changed) {
      await studentVitals.update(formData);
    }
    return apiResponse("Student Vitals information saved successfully", 200, studentVitals);
  }
}
