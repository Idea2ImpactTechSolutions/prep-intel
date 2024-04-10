import { responseBody } from "app/config/helpers";import { models } from "app/models";
const { Recruits, Recruiters, Students, Users } = models;
import { type NextRequest } from 'next/server'


export async function GET(
    req: NextRequest,
  { params }: { params: { studentId: string } }
) {
  try {
          const studentId = params.studentId;   
    const searchParams = req.nextUrl.searchParams
    const studentSchools: any = await getStudentSchools({studentId, searchParams});
    if (!studentSchools) {
      return Response.json(
        responseBody("School interests not found", 404, null),
        {
          status: 404,
        }
      );
    }
    return Response.json(
      responseBody(
        "School interests retrieved successfully",
        200,
        studentSchools
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


async function getStudentSchools(jsonBody: any) {
  let recruiter_id = jsonBody.searchParams.get('recruiter_id');
  const { studentId } = jsonBody

  let recruiter = await Recruiters.findOne({ where: { id: recruiter_id } , 
    include: [{ model: Users,  }]})
  
  if (!recruiter) {
    return Response.json(
      responseBody("Recruiter not found", 404, null),
      {
        status: 404,
      }
    );
  }

  let recruits = await Recruits.findOne({
    where: { student_id: studentId, school_id: recruiter.school_id },
  })

  console.log("Recruiter")

  if (!recruits) {
    return Response.json(
      responseBody("Recruiter not found", 404, null),
      {
        status: 404,
      }
    );
  }

  let students = await Students.findOne({
    where: { id: studentId },
    include: [{ model: Users,  }]
  })

  let student_last_name = students.connection_date !== null ? students.user.last_name : null;
  let student_first_name = students.connection_date !== null ? students.user.first_name : null;

  let option = {
    student_id: studentId,
    student_first_name: student_first_name,
    student_last_name: student_last_name,
    student_city: students.city,
    student_state: students.state,
    student_postal: students.postal,
    student_high_school: students.high_school,
    student_act_score: students.act_score,
    student_gpa: students.gpa,
    student_graudation_year: students.graduation_year,
    contacted: recruits.contacted,
    interested: recruits.interested,
    recruiter_id: recruiter_id,
    recruiter_first_name: recruiter.user.first_name,
    recruiter_last_name: recruiter.user.last_name,
  }
  return option;
}