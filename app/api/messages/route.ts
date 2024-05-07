import { responseBody } from "app/config/helpers";
import { models } from "../../models";
import { type NextRequest } from "next/server";
const { Messages, Recruiters, School, Students, Users } = models;

// /**
//  * @openapi
//  * /api/messages:
//  *   get:
//  *       responses:
//  *           '200':
//  *               content:
//  *                    application/json:
//  *                       schema:
//  *                           type: array
//  *                           items: {}
//  *       summary: Retrieves all messages for provided fields which include recruiter_id, student_id, school_id
//  */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    let reqData = {
      recruiter_id: searchParams.get("recruiter_id"),
      student_id: searchParams.get("student_id"),
      receiver_role: searchParams.get("receiver_role"),
      school_id: searchParams.get("school_id"),
    };

    let response;
    if (reqData.recruiter_id && !reqData.student_id && !reqData.school_id) {
      response = await Messages.findAll({
        where: {
          recruiter_id: reqData.recruiter_id,
        },
      });
    } else if (
      !reqData.recruiter_id &&
      reqData.student_id &&
      !reqData.school_id
    ) {
      response = await Messages.findAll({
        where: {
          student_id: reqData.student_id,
        },
      });
    } else if (
      reqData.recruiter_id &&
      reqData.student_id &&
      !reqData.school_id
    ) {
      response = await Messages.findAll({
        where: {
          recruiter_id: reqData.recruiter_id,
          student_id: reqData.student_id,
        },
      });
    } else {
      response = await Messages.findAll({
        where: {
          school_id: reqData.school_id,
          student_id: reqData.student_id,
        },
      });
    }
    return Response.json(
      responseBody("Messages retrieved successfully", 200, { response }),
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
 * @openapi
 * /api/messages/routes:
 *   post:
 *     description: Posts the message to the required recipient
 *     summary: Creates a new recruiter
 *     tags:
 *       - message
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
          "A student id and a school id or recruiter id were not present",
          400,
          {}
        ),
        {
          status: 400,
        }
      );
    }
    let studentExists = await Students.findOne({
      where: { id: student_id },
    });
    if (!studentExists) {
      return Response.json(responseBody("Student not found", 404, {}), {
        status: 404,
      });
    }
    if (sender_role == "recruiter") {
      return await sendMessageFromRecruiter({
        recruiter_id,
        school_id,
        sender_role,
        message_text,
        student_id,
      });
    } else if (sender_role == "student") {
      return await sendMessageFromStudent({
        recruiter_id,
        school_id,
        sender_role,
        message_text,
        student_id,
      });
    } else {
      return Response.json(responseBody("send_role not provided", 404, {}), {
        status: 404,
      });
    }
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

async function sendMessageFromRecruiter(data) {
  if (data.recruiter_id) {
    let recruiter = await Recruiters.findOne({
      where: { id: data.recruiter_id },
      include: { model: Users, attributes: ["school_id"] },
    });
    if (recruiter) {
      await Messages.create({
        recruiter_id: data.recruiter_id,
        student_id: data.student_id,
        message_text: data.message_text,
        sender_role: data.sender_role,
        school_id: recruiter.user.school_id,
        recipient_role: "student",
        create_date: Date.now(),
      });
      return Response.json(responseBody("Message sent successfully", 201, {}), {
        status: 201,
      });
    } else {
      return Response.json(responseBody("recruiter not found", 404, {}), {
        status: 404,
      });
    }
  } else {
    return Response.json(responseBody("recruiter not found", 404, {}), {
      status: 404,
    });
  }
}
async function sendMessageFromStudent(data) {
  if (data.recruiter_id || data.school_id) {
    if (data.recruiter_id) {
      return await sendMessageFromStudentToRecruiter(data);
    }
    return await sendMessageFromStudentToSchool(data);
  } else {
    return Response.json(
      responseBody("recruiter or school not found", 404, {}),
      {
        status: 404,
      }
    );
  }
}
async function sendMessageFromStudentToRecruiter(data) {
  let recruiter = await Recruiters.findOne({
    where: { id: data.recruiter_id },
    include: { model: Users, attributes: ["school_id"] },
  });
  if (recruiter) {
    await Messages.create({
      recruiter_id: data.recruiter_id,
      student_id: data.student_id,
      message_text: data.message_text,
      sender_role: data.sender_role,
      school_id: recruiter.user.school_id,
      recipient_role: "recruiter",
      create_date: Date.now(),
    });
    return Response.json(responseBody("Message sent successfully", 201, {}), {
      status: 201,
    });
  } else {
    return Response.json(responseBody("recruiter not found", 404, {}), {
      status: 404,
    });
  }
}
async function sendMessageFromStudentToSchool(data) {
  let schoolExists = await School.findOne({ where: { id: data.school_id } });
  if (!schoolExists) {
    return Response.json(responseBody("school not found", 404, {}), {
      status: 404,
    });
  }
  await Messages.create({
    school_id: data.school_id,
    student_id: data.student_id,
    message_text: data.message_text,
    sender_role: data.sender_role,
    recipient_role: "school",
    create_date: Date.now(),
  });
  return Response.json(responseBody("Message sent successfully", 201, {}), {
    status: 201,
  });
}
