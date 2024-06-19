import { apiResponse } from "@/app/config/helpers";
import { models } from "@/app/models";
const {
  ConnectionRequest,
  Recruits,
  Recruiters,
  Students,
  Users,
} = models;
import { type NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { studentId: string } }
) {
  try {
    const studentId = params.studentId;
    const searchParams = req.nextUrl.searchParams;
    const studentProfile: any = await getStudentProfile({
      studentId,
      searchParams,
    });
    if (!studentProfile) {
      return apiResponse("Student profile not found", 404);
        }
    return apiResponse("Student profile retrieved successfully", 200, studentProfile);
  } catch (error: any) {
    return apiResponse("Internal Server Error", 500, { error: error.message });
  }
}

async function getStudentProfile(jsonBody: any) {
  let recruiter_id = jsonBody.searchParams.get("recruiter_id");
  const { studentId } = jsonBody;

  let recruiter = await Recruiters.findOne({
    where: { id: recruiter_id },
    include: {
      model: Users,
      attributes: ['first_name', 'last_name', 'email']
     }
  });

  let student = await Students.findOne({
    where: { id: studentId },
  });

  if ( !recruiter || !student ) {
    return false;
  }

  let schoolsOfInterest = await Recruits.findAll({
    where: {
      student_id: studentId,
      interested: true
     }
  });

  let studentProfile = {
    student_id: studentId,
    student_high_school: student.high_school || null,
    student_act_score: student.act_score || null,
    student_sat_score: student.sat_score || null,
    schools_of_interest: schoolsOfInterest || null,
    student_gpa: student.gpa || null,
    student_graduation_year: student.graduation_year || null,
    student_majors: student.majors || null,
    student_extracurricular: student.extracurriculars || null,
  };

  let recruit = await Recruits.findOne({
    where: {
      student_id: studentId,
      school_id: recruiter.school_id
    },
    include: {
      model: Students,
      attributes: ['id'],
      include: {
        model: Users,
        attributes: ['first_name', 'last_name', 'email', 'profile_image']
      }
    }
  });

  if (recruit) {
    const recruitInfo = {
      student_first_name: recruit.student.user.first_name || null,
      student_last_name: recruit.student.user.last_name || null,
      student_city: student.city || null,
      student_state: student.state || null,
      student_postal: student.postal || null,
      contacted: recruit.contacted || null,
      interested: recruit.interested || null,
      connection_date: recruit.create_date || null,
      profile_image: recruit.student.user.profile_image || null,
    };

    const recruiterInfo = {
      recruiter_id: recruiter_id || null,
      recruiter_first_name: recruiter.user.first_name || null,
      recruiter_last_name: recruiter.user.last_name || null,
    }

    Object.assign(studentProfile, recruitInfo, recruiterInfo);
  }

  const connectionRequest = await ConnectionRequest.findOne({
    where: {
      student_id: studentId,
      recruiter_id: recruiter_id,
      school_id: recruiter.school_id,
      connection_accepted: null
    }
  });

  if (connectionRequest) {
    Object.assign(studentProfile, { open_connection_request: true });
  }

  return studentProfile;
}
