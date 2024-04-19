import type { NextRequest } from "next/server";
import { models } from "@/app/models";
import { responseBody } from "@/app/config/helpers";
const { Users, Recruits, Students, School, SchoolAddress } = models;

/**
 * @swagger
 * /api/students/{studentId}/recruiters:
 *   get:
 *     summary: display all of the recruiter details that the student currently has connected to
 *     description: Fetches the recruiters with a connection to the student in the recruits table
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the student to retrieve.
 *     responses:
 *       200:
 *         description: recruiters information retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */

export async function GET(
  request: NextRequest,
  { params }: { params: { studentId: string } }
) {
  const studentId = params.studentId;
  const studentRecruiters: any = await getStudentRecruiters(studentId);
  if (!studentRecruiters) {
    return Response.json(
      responseBody(studentRecruiters.message, studentRecruiters.code, null),
      {}
    );
  }
  return Response.json(
    responseBody(
      studentRecruiters.message,
      studentRecruiters.code,
      studentRecruiters.data
    )
  );
}

const getStudentRecruiters = async (studentId: string) => {
  let school = await School.findOne({
    include: [
      {
        model: Recruits,
        as: "recruits",
        include: [
          {
            model: Students,
            where: { id: studentId },
            required: true,
          },
        ],
      },
      {
        model: SchoolAddress,
        as: "school_address",
      },
      {
        model: Users,
        as: "users",
      },
    ],

    raw: true,
    nest: true,
  });

  if (!school) return { message: "Recruits not found", code: 404 };

  let options = {
    first_name: school.users.first_name,
    last_name: school.users.last_name,
    phone: school.users?.phone,
    school_name: school.name,
    school_address: school.school_address.state,
    profile_img: school.user?.profile_img,
  };

  return {
    message: "Successfully retrieved recruiters",
    code: 200,
    data: [{ options }],
  };
};
