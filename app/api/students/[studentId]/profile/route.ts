import { apiResponse } from "@/app/config/helpers";
import { models } from "@/app/models";
const { ConnectionRequest, Recruits, Recruiters, Students, Users } = models;
import { type NextRequest } from "next/server";

/**
 * @openapi
 * /api/students/{studentId}/profile:
 *   get:
 *     description: Retrieve a student's profile. If `recruiter_id` or `schoolId` query parameters are provided, retrieve the profile from a recruiter or school view.
 *     tags:
 *       - student
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the student to retrieve.
 *       - in: query
 *         name: schoolId
 *         required: false
 *         schema:
 *           type: string
 *         description: The ID of the school requesting the profile.
 *     responses:
 *       200:
 *         description: Student profile retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: object
 *                   description: The student's profile data.
 *       404:
 *         description: Student profile not found.
 *       500:
 *         description: Internal Server Error.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { studentId: string } }
) {
  try {
    const studentId = params.studentId;
    const searchParams = req.nextUrl.searchParams;
    const schoolId = searchParams.get("schoolId");

    // Collect student info, only accessing private details if not an institutional request
    const studentProfile = await getStudentProfile(studentId, !schoolId);
    if (!studentProfile) {
      return apiResponse("Student profile not found", 404);
    }

    // Early exit for basic student profile request
    if (!schoolId) {
      return apiResponse("Success", 200, studentProfile);
    }

    // School/recruiter view
    const recruitProfile = await getInstitutionView(studentId, schoolId);
    if (!recruitProfile) {
      return apiResponse("Recruit profile not found", 404);
    }

    // Merge in school recruit info
    Object.assign(studentProfile, recruitProfile);

    return apiResponse(
      "Student profile retrieved successfully",
      200,
      studentProfile
    );
  } catch (error: any) {
    return apiResponse("Internal Server Error", 500, { error: error.message });
  }
}

async function getInstitutionView(studentId, schoolId) {
  if (!studentId || !schoolId) {
    return false;
  }

  const recruitProfile = {};

  // Get recruit info
  const recruit = await Recruits.findOne({
    where: {
      student_id: studentId,
      school_id: schoolId,
    },
  });

  // Push recruit info to output
  Object.assign(recruitProfile, {
    contacted: recruit?.contacted || null,
    connected: !!recruit, // Connected is true if there's a recruit record for this school/student
    interested: recruit?.interested || null,
    recruiter_id: recruit?.recruiter_id || null,
    connection_date: recruit?.create_date || null,
    applicant_status: recruit?.applicant_status || null,
  });

  // Conditionally lookup and push primary recruiter information on recruit record to 
  // to output variable
  if (recruit?.recruiter_id) {
    // Lookup details for the recruiter
    const recruiter = await Recruiters.findByPk(recruit.recruiter_id, {
      include: {
        model: Users,
        attributes: ["first_name", "last_name", "email"],
      },
    });

    // Push primary recruiter info to output variable
    if (recruiter) {
      Object.assign(recruitProfile, {
          recruiter_id: recruiter.id || null,
          recruiter_first_name: recruiter.user.first_name || null,
          recruiter_last_name: recruiter.user.last_name || null,
        });
    }
  }

   // Lookup connection requests to determine if a connection request is open and pending
   const connectionRequest = await ConnectionRequest.findOne({
    where: {
      student_id: studentId,
      school_id: schoolId,
      connection_accepted: null,
    },
  });

  // Push connection request status to output
  Object.assign(recruitProfile, {
    open_connection_request: !!connectionRequest,
  });

  return recruitProfile;
}

async function getStudentProfile(studentId, includePrivateDetails = false) {
  const student = await Students.findByPk(studentId, {
    include: {
      model: Users,
      attributes: ["first_name", "last_name", "email", "profile_image"],
    },
  });

  if (!student) {
    return false;
  }

  // TODO: This should be conditional - maybe  it's needed for student/owner views but
  // the data  should never appear for institutional requests
  const schoolsOfInterest = (!includePrivateDetails) ? null : await Recruits.findAll({
    where: {
      student_id: studentId,
      interested: true,
    },
  });

  return {
    student_id: studentId,
    student_high_school: student.high_school || null,
    student_act_score: student.act_score || null,
    student_sat_score: student.sat_score || null,
    student_first_name: student.user.first_name || null,
    student_last_name: student.user.last_name || null,
    student_city: student.city || null,
    student_state: student.state || null,
    student_postal: student.postal || null,
    student_gpa: student.gpa || null,
    student_graduation_year: student.graduation_year || null,
    student_majors: student.majors || null,
    student_extracurricular: student.extracurriculars || null,
    schools_of_interest: schoolsOfInterest || null,
    profile_image: student.user.profile_image || null,
  };
}
