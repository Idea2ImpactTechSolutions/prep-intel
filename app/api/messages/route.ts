import { responseBody } from "app/config/helpers";
import { models } from "../../models";
import { type NextRequest } from "next/server";
const { Message, Recruiters, School, Students } = models;

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
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    let reqData = {
      recruiter_id: searchParams.get("recruiter_id"),
      student_id: searchParams.get("student_id"),
      receiver_role: searchParams.get("receiver_role"),
      school_id: searchParams.get("school_id"),
    };

    await Message.update(
      { status: "seen" },
      { where: { recipient_role: reqData.receiver_role } }
    );
    let response;
    if (reqData.recruiter_id && !reqData.student_id && !reqData.school_id) {
      response = await Message.findAll({
        where: {
          recruiter_id: reqData.recruiter_id,
        },
      });
    } else if (
      !reqData.recruiter_id &&
      reqData.student_id &&
      !reqData.school_id
    ) {
      response = await Message.findAll({
        where: {
          student_id: reqData.student_id,
        },
      });
    } else if (
      reqData.recruiter_id &&
      reqData.student_id &&
      !reqData.school_id
    ) {
      response = await Message.findAll({
        where: {
          recruiter_id: reqData.recruiter_id,
          student_id: reqData.student_id,
        },
      });
    } else {
      response = await Message.findAll({
        where: {
          school_id: reqData.school_id,
          student_id: reqData.student_id,
        },
      });
    }

    return Response.json(
      responseBody("Messages retreived successfully", 200, { response }),
      {
        status: 200,
      }
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
export async function POST(req: NextRequest) {
  try {
    // TODO: Implement
    // console.log({ req: req.nextUrl.searchParams });

    const recruiter_id = req.nextUrl.searchParams.get("recruiter_id");
    const school_id = req.nextUrl.searchParams.get("school_id");
    const student_id = req.nextUrl.searchParams.get("student_id");
    const sender_role = req.nextUrl.searchParams.get("sender_role");
    const message_text = req.nextUrl.searchParams.get("message_text");

    if (!(recruiter_id || school_id) || !student_id) {
      return Response.json(
        responseBody(
          "Kindly add a recruiter id or school id for this query",
          400,
          {}
        ),
        {
          status: 400,
        }
      );
    }

    let isStudentExist = await Students.findOne({
      where: { id: student_id },
    });

    if (!isStudentExist) {
      return Response.json(responseBody("Student not found", 404, {}), {
        status: 404,
      });
    }

    let recruiter_check = recruiter_id ? true : false;

    if (sender_role === "recruiter") {
      if (recruiter_check) {
        let recruiter = await Recruiters.findOne({
          where: { id: recruiter_id },
        });

        if (!recruiter) {
          return Response.json(responseBody("recruiter not found", 404, {}), {
            status: 404,
          });
        }

        await Message.create({
          recruiter_id: recruiter_id,
          student_id: student_id,
          message_text: message_text,
          sender_role: sender_role,
          recipient_role: "student",
          create_date: Date.now(),
        });
      } else {
        let school = await School.findOne({ where: { id: school_id } });

        if (!school) {
          return Response.json(responseBody("school not found", 404, {}), {
            status: 404,
          });
        }
        await Message.create({
          student_id: student_id,
          school_id: school_id,
          message_text: message_text,
          sender_role: sender_role,
          recipient_role: "recruiter",
          create_date: Date.now(),
        });
      }
    } else {
      if (recruiter_check) {
        let recruiter = await Recruiters.findOne({
          where: { id: recruiter_id },
        });

        if (!recruiter) {
          return Response.json(responseBody("recruiter not found", 404, {}), {
            status: 404,
          });
        }

        await Message.create({
          recruiter_id: recruiter_id,
          student_id: student_id,
          message_text: message_text,
          sender_role: sender_role,
          recipient_role: "recruiter",
          create_date: Date.now(),
        });
      } else {
        let school = await School.findOne({ where: { id: school_id } });

        if (!school) {
          return Response.json(responseBody("school not found", 404, {}), {
            status: 404,
          });
        }
        await Message.create({
          student_id: student_id,
          school_id: school_id,
          message_text: message_text,
          sender_role: sender_role,
          recipient_role: "school",
          create_date: Date.now(),
        });
      }
    }
    return Response.json(responseBody("Message sent successfully", 201, {}), {
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
