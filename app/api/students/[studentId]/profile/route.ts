import { responseBody } from "../../../../config/helpers";
import { models } from "../../../../models";
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
      return Response.json(
        responseBody("Student profile not found", 404, null),
        {
          status: 404,
        }
      );
    }
    return Response.json(
      responseBody(
        "Student profile retrieved successfully",
        200,
        studentProfile
      )
    );
  } catch (error: any) {
    return Response.json(
      responseBody("Internal Server Error", 500, { error: error.message }),
      {
        status: 500,
      }
    );
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
        attributes: ['first_name', 'last_name', 'email']
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
