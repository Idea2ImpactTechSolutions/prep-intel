import { apiResponse } from "app/config/helpers";
import { models } from "../../models";
import { type NextRequest } from "next/server";
import { sequelize } from "../../models";
const { Messages, Recruiters, School, Students, Users } = models;

/**
 * @openapi
 * /api/messages:
 *   get:
 *     summary: Retrieves messages based on query parameters
 *     tags:
 *       - message
 *     parameters:
 *       - in: query
 *         name: recruiter_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: student_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: school_id
 *         schema:
 *           type: string
 *       - in: query
 *         name: recent
 *         schema:
 *           type: boolean
 *     responses:
 *       '200':
 *         description: Successfully retrieved messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: {}
 *       '500':
 *         description: Internal server error
 */




export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const recruiter_id = searchParams.get("recruiter_id");
    const student_id = searchParams.get("student_id");
    const school_id = searchParams.get("school_id");
    const recent = searchParams.get("recent") === "true";

    if (recruiter_id && student_id) {
      // Return all messages between a specific recruiter and student
      const messagesList = await Messages.findAll({
        where: {
          recruiter_id,
          student_id,
        },
        include: [
          {
            model: Recruiters,
            attributes: ['id'],
            include: {
              model: Users,
              attributes: ['first_name', 'last_name', 'profile_image'],
            },
          },
          {
            model: Students,
            attributes: ['id'],
            include: {
              model: Users,
              attributes: ['first_name', 'last_name', 'profile_image'],
            },
          },
        ],
        order: [['create_date', 'ASC']],
      });

      const formattedMessages = messagesList.map((message) => ({
        ...message.toJSON(),
        sender_image: message.sender_role === 'recruiter' ? message.recruiter.user.profile_image : message.student.user.profile_image,
        sender_name: message.sender_role === 'recruiter' ? `${message.recruiter.user.first_name} ${message.recruiter.user.last_name}` : `${message.student.user.first_name} ${message.student.user.last_name}`,
      }));

      return apiResponse("Messages retrieved successfully", 200, formattedMessages);
    } else if (student_id && school_id) {
      // Return all messages between a student and a school
      const messagesList = await Messages.findAll({
        where: {
          student_id,
          school_id,
        },
        include: [
          {
            model: Students,
            attributes: ['id'],
            include: {
              model: Users,
              attributes: ['first_name', 'last_name', 'profile_image'],
            },
          },
          {
            model: School,
            attributes: ['name'],
          },
        ],
        order: [['message.create_date', 'ASC']],
      });

      const formattedMessages = messagesList.map((message) => ({
        ...message.toJSON(),
        sender_image: message.sender_role === 'recruiter' ? message.recruiter.user.profile_image : message.student.user.profile_image,
        sender_name: message.sender_role === 'recruiter' ? `${message.recruiter.user.first_name} ${message.recruiter.user.last_name}` : `${message.student.user.first_name} ${message.student.user.last_name}`,
      }));

      return apiResponse("Messages retrieved successfully", 200, formattedMessages);
    }
    else if (recruiter_id && recent) {
      // Return the most recent message from each conversation for a student
      const messagesList = await sequelize.query(
        `SELECT DISTINCT ON (student_id)
            m.id,
            m.message_text,
            m.create_date,
            m.recipient_role,
            m.recruiter_id,
            m.school_id,
            m.sender_role,
            m.status,
            m.student_id,
            u.first_name,
            u.last_name,
            u.profile_image
         FROM messages m
         JOIN students s ON m.student_id = s.id
         JOIN users u ON s.user_id = u.id
         WHERE m.recruiter_id = ?
         ORDER BY student_id, create_date DESC`,
        {
          replacements: [recruiter_id],
          type: sequelize.QueryTypes.SELECT,
        }
      );

      const formattedMessages = messagesList.map((message) => ({
        ...message,
        sender_image: message.profile_image,
        sender_name: `${message.first_name} ${message.last_name}`,
      }));

      return apiResponse("Messages retrieved successfully", 200, formattedMessages);
    }
    else if (student_id && recent) {
      // Return the most recent message from each conversation for a student
      const messagesList = await sequelize.query(
        `SELECT DISTINCT ON (recruiter_id)
            m.id,
            m.message_text,
            m.create_date,
            m.recipient_role,
            m.recruiter_id,
            m.school_id,
            m.sender_role,
            m.status,
            m.student_id,
            u.first_name,
            u.last_name,
            u.profile_image
         FROM messages m
         JOIN recruiters r ON m.recruiter_id = r.id
         JOIN users u ON r.user_id = u.id
         WHERE m.student_id = ?
         ORDER BY recruiter_id, create_date DESC`,
        {
          replacements: [student_id],
          type: sequelize.QueryTypes.SELECT,
        }
      );

      const formattedMessages = messagesList.map((message) => ({
        ...message,
        sender_image: message.profile_image,
        sender_name: `${message.first_name} ${message.last_name}`,
      }));

      return apiResponse("Messages retrieved successfully", 200, formattedMessages);
    } else {
      return apiResponse("Invalid parameter combination", 400);
    }
  } catch (error: any) {
    return apiResponse("Internal Server Error", 500, { error: error.message });
  }
}


/**
 * @openapi
 * /api/messages:
 *   post:
 *     description: Posts the message to the required recipient.
 *     summary: Creates a new message.
 *     tags:
 *       - message
 *     parameters:
 *       - in: query
 *         name: recruiter_id
 *         schema:
 *           type: string
 *         required: false
 *         description: The unique identifier of the recruiter.
 *       - in: query
 *         name: school_id
 *         schema:
 *           type: string
 *         required: false
 *         description: The unique identifier of the school to which the message is being sent.
 *       - in: query
 *         name: student_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The unique identifier of the student sending or receiving the message.
 *       - in: query
 *         name: sender_role
 *         schema:
 *           type: string
 *         required: true
 *         description: The role of the sender, can be either 'recruiter' or 'student'.
 *       - in: query
 *         name: message_text
 *         schema:
 *           type: string
 *         required: true
 *         description: The text of the message to be sent.
 *     responses:
 *       201:
 *         description: Message sent successfully.
 *       400:
 *         description: Missing required student ID, school ID, or recruiter ID.
 *       404:
 *         description: Student, recruiter, or school not found.
 *       500:
 *         description: Internal Server Error occurred while processing the request.
 */
export async function POST(req: NextRequest) {
  try {
    const recruiter_id = req.nextUrl.searchParams.get("recruiter_id");
    const school_id = req.nextUrl.searchParams.get("school_id");
    const student_id = req.nextUrl.searchParams.get("student_id");
    const sender_role = req.nextUrl.searchParams.get("sender_role");
    const message_text = req.nextUrl.searchParams.get("message_text");

    if (!(recruiter_id || school_id) || !student_id) {
      return apiResponse(
          "A student id and a school id or recruiter id were not present",
          400);
    }
    let studentExists = await Students.findOne({
      where: { id: student_id },
    });
    if (!studentExists) {
      return apiResponse("Student not found", 404);
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
      return apiResponse("send_role not provided", 404);
    }
  } catch (error: any) {
    // Report
    return apiResponse("Internal Server Error", 500, { error: error.message });
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
      return apiResponse("Message sent successfully", 201);
    } else {
      return apiResponse("recruiter not found", 404);
    }
  } else {
    return apiResponse("recruiter not found", 404);
    }
}
async function sendMessageFromStudent(data) {
  if (data.recruiter_id || data.school_id) {
    if (data.recruiter_id) {
      return await sendMessageFromStudentToRecruiter(data);
    }
    return await sendMessageFromStudentToSchool(data);
  } else {
    return apiResponse("recruiter or school not found", 404);
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
    return apiResponse("Message sent successfully", 201);
  } else {
    return apiResponse("recruiter not found", 404);
  }
}
async function sendMessageFromStudentToSchool(data) {
  let schoolExists = await School.findOne({ where: { id: data.school_id } });
  if (!schoolExists) {
    return apiResponse("school not found", 404);
  }

  await Messages.create({
    school_id: data.school_id,
    student_id: data.student_id,
    message_text: data.message_text,
    sender_role: data.sender_role,
    recipient_role: "school",
    create_date: Date.now(),
  });

  return apiResponse("Message sent successfully", 201);
}
