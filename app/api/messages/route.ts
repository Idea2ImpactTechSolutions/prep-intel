import { responseBody } from "app/config/helpers";
import { models } from "../../models"
import { type NextRequest } from 'next/server'
const { Messages, Recruiters, School, Students } = models;

/**
 * @openapi
 * /api/messages/routes:
 *   get:
 *       responses:
 *           '200':
 *               content:
 *                    application/json:
 *                       schema:
 *                           type: array
 *                           items: {}
 *       summary: Retrieves all messages for provided fields which inlcude recruiter_id, student_id, school_id
 */
export async function GET(req: NextRequest,) {
  try {
    const searchParams = req.nextUrl.searchParams
    let reqData = {
      recruiter_id: searchParams.get('recruiter_id'),
      student_id: searchParams.get('student_id'),
      school_id: searchParams.get('school_id'),
    }
    let response;
    if (reqData.recruiter_id && !reqData.student_id && !reqData.school_id) {
      response = await Messages.findAll({
        where: {
          recruiter_id: reqData.recruiter_id,
        }
      })
    } else if (!reqData.recruiter_id && reqData.student_id && !reqData.school_id) {
      response = await Messages.findAll({
        where: {
          student_id: reqData.student_id,
        }
      })
    } else if (reqData.recruiter_id && reqData.student_id && !reqData.school_id) {
      response = await Messages.findAll({
        where: {
          recruiter_id: reqData.recruiter_id,
          student_id: reqData.student_id,
        }
      })
    } else {
       response = await Messages.findAll({
        where: {
        school_id: reqData.school_id,
          student_id: reqData.student_id,
        }
      })
    }

    return Response.json(
      responseBody("Messages retreived successfully", 200, { response }), {
      status: 200,
    })
  } catch (error: any) {
    return Response.json(
      responseBody("Internal Server Error", 500, { error: error.message }),
      {
        status: 500,
      }
    );
  }
}

/**
 * @swagger
 * /api/messages/routes:
 *   post:
 *     description: Posts the message to the required recipient
 *     summary: Creates a new recruiter
 *     responses:
 *       200:
 *         description: Message sent successfully
 */
export async function POST(req: Request) {
  try {
      // TODO: Implement
      let data = await req.json();

      if (!data.recruiter_id && !data.school_id) {
          return Response.json(
      responseBody("Kindly add a recruiter id or school id for this query", 400, {  }),
      {
        status: 400,
      }
    );
      }
    
    let isStudentExist = await Students.findOne({ where: { id: data.student_id } })
    
    if (!isStudentExist) {
      return Response.json(
      responseBody("Student with id not found", 404, {  }),
      {
        status: 404,
      }
    );
    }

      let recipientChecker = data.recruiter_id ? true : false;

      if (recipientChecker) {
          let recruiter = await Recruiters.findOne({ where: { id: data.recruiter_id } })

          if (!recruiter) {
               return Response.json(
      responseBody("recruiter with id not", 404, {  }),
      {
        status: 404,
      }
    );
          }

          await Messages.create({
              recruiter_id: data.recruiter_id,
        student_id: data.student_id,
        message_text: data.message_text,
        sender_role: data.sender_role,
        recipient_role: "student",
        create_date: Date.now(),
          })
      } else {
        let school = await School.findOne({ where: { id: data.school_id } })

          if (!school) {
               return Response.json(
      responseBody("school not found", 404, {  }),
      {
        status: 404,
      }
    );
          }
           await Messages.create({
        student_id: data.student_id,
        school_id: data.school_id,
        message_text: data.message_text,
        sender_role: data.sender_role,
        recipient_role: "recruiter",
        create_date: Date.now(),
          })
      }

    //   await Messages.

      return Response.json(
      responseBody("Message sent successfully", 201, {  }), {
      status: 201,
    });
  } catch (error: any) {
    // Report
    return Response.json(
      responseBody("Internal Server Error", 500, { error: error.message }),
      {
        status: 500,
      }
    );
  }
}