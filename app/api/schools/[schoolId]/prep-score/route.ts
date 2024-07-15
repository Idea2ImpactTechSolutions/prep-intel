import { models } from "@/app/models";
const { School, Students } = models;
import { apiResponse } from "@/app/config/helpers";
import { type NextRequest } from "next/server";
import logger from "@/lib/logger";

/**
 * @openapi
 * /api/schools/{schoolId}/prep-score:
 *   get:
 *     summary: Retrieve student's prep score for a given institution
 *     description: Calculates and returns the prep score based on student's GPA, SAT, and ACT scores compared to the school's requirements.
 *     tags:
 *       - school
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         description: ID of the school to retrieve prep score for.
 *         schema:
 *           type: string
 *           example: "1"
 *       - in: query
 *         name: studentId
 *         required: true
 *         description: ID of the student to calculate prep score for.
 *         schema:
 *           type: string
 *           example: "123"
 *     responses:
 *       200:
 *         description: Prep score successfully calculated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: integer
 *                 data:
 *                   type: object
 *                   properties:
 *                     prepScore:
 *                       type: number
 *                     details:
 *                       type: object
 *                       properties:
 *                         gpaScore:
 *                           type: number
 *                         satScore:
 *                           type: number
 *                         actScore:
 *                           type: number
 *             example:
 *               message: "Prep Score successfully calculated"
 *               status: 200
 *               data:
 *                 prepScore: 4
 *                 details:
 *                   gpaScore: 4
 *                   satScore: 3
 *                   actScore: 5
 *       400:
 *         description: An error occurred during the retrieval process.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: integer
 *                 error:
 *                   type: string
 *             example:
 *               message: "Error occurred"
 *               status: 400
 *               error: "Detailed error message"
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { schoolId: string } }
) {
    try {
      const searchParams = req.nextUrl.searchParams;
      const studentId = searchParams.get("studentId");

      if (!studentId) {
        return apiResponse('Student ID is required', 400);
      }

      const student = await Students.findByPk(studentId);
      if (!student) {
        return apiResponse('Student not found', 404);
      }

      const school = await School.findByPk(params.schoolId);
      if (!school) {
        return apiResponse('School not found', 404);
      }

      const studentPrepScore = getStudentPrepScore(school, student);

      return apiResponse('Prep Score successfully calculated', 200, {
        prepScore: studentPrepScore.prepScore,
        details: studentPrepScore.details
      });
    } catch (error: any) {
      logger.error(error.message);
      return apiResponse("Error occurred", 400, { error: error.message });
    }
}

function getStudentPrepScore(school, student) {
  // Non-required scores are defaulted to `defaultScore`
  const defaultScore = 5; // TODO: Update default score to 5 after showcasing behavior
  const scores = {
    gpaScore: school.diploma_required ? getGPAPrepScore(school, student) : defaultScore,
    satScore: school.sat_required ? getSATPrepScore(school, student) : defaultScore,
    actScore: school.act_required ? getACTPrepScore(school, student) : defaultScore,
  };

  return {
    prepScore: (scores.gpaScore + scores.satScore + scores.actScore) / 3.0,
    details: scores
  };
}

function getACTPrepScore(school, student) {
  if (!student.act_score) {
    return 0;
  }
  if (student.act_score > school.min_act_score) {
    return 4;
  }
  if (student.act_score === school.min_act_score) {
    return 3;
  }
  return 2;
}

function getSATPrepScore(school, student) {
  if (!student.sat_score) {
    return 0;
  }
  if (student.sat_score > school.min_sat_score) {
    return 4;
  }
  if (student.sat_score === school.min_sat_score) {
    return 3;
  }
  return 2;
}

function getGPAPrepScore(school, student) {
  if (!student.gpa) {
    return 0;
  }
  if (student.gpa > school.gpa_requirement) {
    return 4;
  }
  if (student.gpa === school.gpa_requirement) {
    return 3;
  }
  return 2;
}
