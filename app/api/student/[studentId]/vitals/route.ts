import type { NextRequest } from "next/server";
import { checkForChangedAttributes } from "pages/api/manager/profile/school-profile";
import { models } from "app/models";
import { responseBody } from "app/config/helpers";
const { Users, Students } = models;

const VITALS_FIELDS = [
  "id",
  "dob",
  "state",
  "country",
  "graduation_year",
  "high_school",
  "guardian_first_name",
  "guardian_last_name",
  "guardian_email",
];
const VITALS_FIELDS_FROM_USERS = ["user.first_name", "user.last_name"];

/**
 * @swagger
 * /api/student/{studentId}/vitals:
 *   get:
 *     summary: Retrieve student vitals information
 *     description: Fetches the vital information of a student by their ID.
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
    attributes: VITALS_FIELDS.concat(VITALS_FIELDS_FROM_USERS),
    include: [
      {
        model: Users,
        attributes: [],
        required: true,
      },
    ],
    raw: true,
  });

  if (studentVitals === null) {
    return Response.json(responseBody("Student not found", 404, null), {
      status: 404,
    });
  }

  return Response.json(
    responseBody(
      "Student Vitals information retrieved successfully.",
      200,
      studentVitals
    )
  );
}

/**
 * @swagger
 * /api/student/{studentId}/vitals:
 *   post:
 *     summary: Updates student vitals
 *     description: Takes form field values posted in the body and updates them in the database.
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
  let responseCode = 400;
  let responseMessage = "Bad Request";
  let responseData: any;

  const formData = await req.json();

  let studentVitals = await Students.findOne({
    where: { id: params.studentId },
    attributes: VITALS_FIELDS,
  });

  if (studentVitals === null) {
    responseCode = 404;
    responseMessage = "Student not found";
  } else {
    const needsUpdate = await checkForChangedAttributes(
      formData,
      studentVitals.dataValues
    );
    if (needsUpdate) {
      await studentVitals.update(formData);
    }
    responseCode = 200;
    responseMessage = "Student Vitals information saved successfully";
    responseData = studentVitals;
  }

  return Response.json(
    responseBody(responseMessage, responseCode, responseData),
    {
      status: responseCode,
    }
  );
}
