<<<<<<< HEAD
import { responseBody } from "../../../../config/helpers";
import { models } from "../../../../models";
const { Recruits, School, Recruiters, Students, Users, StudentsDepartmentInterests, StudentsExtracurriculars } = models;
=======
import { responseBody } from "app/config/helpers";import { models } from "app/models";
const { Recruits, Recruiters, Students, Users } = models;
>>>>>>> main
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
<<<<<<< HEAD
    include: [{ model: Users, }]
  })
  
=======
    include: [{ model: Users,  }]})
>>>>>>> main
  
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

  if (!recruits) {
    return Response.json(
      responseBody("Recruiter not found", 404, null),
      {
        status: 404,
      }
    );
  }

<<<<<<< HEAD

  let school = await School.findAll({where: {id: recruits.school_id}})

=======
>>>>>>> main
  let students = await Students.findOne({
    where: { id: studentId },
    include: [{ model: Users,  }]
  })

<<<<<<< HEAD
  let student_last_name = recruits.connection_date || recruits.interested !== null ? students.user.last_name : null;
  let student_first_name = recruits.connection_date || recruits.interested !== null ? students.user.first_name : null;
  let student_phone_num = recruits.connection_date || recruits.interested !== null ? students.phone : null;

  let student_extracurricular = await StudentsExtracurriculars.findAll({ where: { student_id: studentId } });
  let student_majors = await StudentsDepartmentInterests.findAll({ where: { student_id: studentId } });

  let option = {
    student_id: studentId,
    student_first_name: student_first_name || null,
    student_last_name: student_last_name || null,
    student_city: students.city || null,
    student_state: students.state || null,
    student_postal: students.postal || null,
    student_high_school: students.high_school || null,
    student_act_score: students.act_score || null,
    student_sat_score: students.sat_score || null,
    schools_of_interest: school || null,
    connection_date: recruits.connection_date || null,
    student_gpa: students.gpa || null,
    student_graudation_year: students.graduation_year || null,
    contacted: recruits.contacted || null,
    interested: recruits.interested || null,
    student_majors: student_majors || null,
    student_extracurricular: student_extracurricular || null,
    recruiter_id: recruiter_id || null,
    recruiter_first_name: recruiter.user.first_name || null,
    recruiter_last_name: recruiter.user.last_name || null,
=======
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
>>>>>>> main
  }
  return option;
}