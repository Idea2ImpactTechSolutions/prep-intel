import { models } from "@/app/models";
const { School, Recruits } = models;
import { apiResponse } from "@/app/config/helpers";
import { type NextRequest } from "next/server";
import logger from "@/lib/logger";
import { ApplicantStatus } from "@/app/enums/applicant-status";

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
      const school = await School.findByPk(params.schoolId);
      if (!school) {
        return apiResponse('School not found', 404);
      }
      
      const totalRecruits = await Recruits.count({
        where: { school_id: params.schoolId }
      });

      const pendingApplicants = await Recruits.count({
        where: { school_id: params.schoolId, applicant_status: ApplicantStatus.APPLIED }
      });
      
      // Retrieve admitted students
      const admittedStudents = await Recruits.count({
        where: { school_id: params.schoolId, applicant_status: ApplicantStatus.ADMITTED }
      });

      const deniedStudents = await Recruits.count({
        where: { school_id: params.schoolId, applicant_status: ApplicantStatus.DENIED }
      });
    
      // Retrieve enrolled students
      //TODO Implement logic that takes into consideration school years
      const enrolledStudents = await Recruits.count({
        where: { school_id: params.schoolId, applicant_status: ApplicantStatus.ENROLLED }
      });

      // Calculate school admission conversion rate
      const totalApplicants = pendingApplicants + admittedStudents + deniedStudents + enrolledStudents;
      const schoolAdmissionConversionRate = totalApplicants > 0 ? admittedStudents / totalApplicants : 0;

      const schoolMetrics = {
        totalRecruits,
        pendingApplicants,
        admittedStudents,
        schoolAdmissionConversionRate,
        enrolledStudents
      };
      return apiResponse('School metrics successfully calculated', 200, schoolMetrics);
    } catch (error: any) {
      logger.error(error.message);
      return Response.json(
        apiResponse("Error occurred", 400, { error: error.message }),
        { status: 400 }
      );
    }
}


