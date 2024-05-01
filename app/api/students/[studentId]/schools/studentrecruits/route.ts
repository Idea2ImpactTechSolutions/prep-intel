import * as yup from "yup";
import type { NextRequest } from "next/server";
import { responseBody } from "../../../../../../app/config/helpers";
import { models } from "../../../../../../app/models";
const { Recruits, School, Students, Users } = models;

const POST_VALIDATION_SCHEMA = yup.array().of(yup.number().required());

const PATCH_VALIDATION_SCHEMA = yup.object({
  school_id: yup.number().required(),
  criteria: yup.string().oneOf(["INTERESTED"]).notRequired(),
  interested: yup.boolean().notRequired(),
  is_viewable: yup.boolean().notRequired(),
});

const RECRUITS_SCHOOLS_FIELDS = ["school_id", "interested", "school.name"];

/**
 * @openapi
 * /api/students/{studentId}:
 *   get:
 *     summary: Retrieve a student's recruit information
 *     description: >
 *       An API endpoint to retrieve a student's recruit information
 *     tags:
 *       - student
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique identifier of the student whose school interests are being queried.
 *     responses:
 *       200:
 *         description: recruit data returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 type: object
 *                 properties:
 *                   schoolId:
 *                     type: integer
 *                     description: The unique identifier of the school.
 *                   schoolName:
 *                     type: string
 *                     description: The name of the school.
 *                   interested:
 *                     type: boolean
 *                     description: Indicates whether the student is interested in the school.
 *       404:
 *         description: Student with id not found
 *       500:
 *         description: A server error occurred while processing the request.
 */
export async function GET(
  req: Request,
  { params }: { params: { studentId: number } }
) {
  try {
    // Collect
    const data: any = params;
    const res = await getStudentRecruitData(data.studentId);

    return Response.json(responseBody(res.message, res.status, res.data), {
      status: 200,
    });
  } catch (error: any) {
    return Response.json(
      responseBody("Internal Server Error", 500, { error: error.message }),
      {
        status: 500,
      }
    );
  }
}

const getStudentRecruitData = async (student_id: string) => {
  let student = await Students.findOne({ where: { id: student_id } });

  if (!student) {
    return {
      message: "Student not found",
      data: [],
      status: 404,
    };
  }

  let recruitData = await Recruits.findOne({
    where: { student_id: student.id },
  });

  if (!recruitData) {
    return {
      message: "Recruit data for student with id provided is not found",
      data: [],
      status: 404,
    };
  }

  return {
    message: "Recruits data retrived successfully",
    data: recruitData,
    status: 200,
  };
};
