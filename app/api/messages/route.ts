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
      const messagesList = await getMessagesBetweenRecruiterAndStudent(recruiter_id,student_id);
      const formattedMessages = formatMessages(messagesList, false);
      return apiResponse("Messages retrieved successfully", 200,formattedMessages);
    } else if (student_id && school_id) {
      // Return all messages between a student and a school
      const messagesList = await getMessagesBetweenStudentAndSchool(student_id, school_id);
      const formattedMessages = formatMessages(messagesList, false);
      return apiResponse("Messages retrieved successfully", 200, formattedMessages);
    }
    else if (recruiter_id && recent) {
      const messagesList = await getRecentMessagesForRecruiter(recruiter_id);
      const formattedMessages = formatMessages(messagesList, true);
      return apiResponse("Messages retrieved successfully", 200, formattedMessages);
    }
    else if (student_id && recent) {
      const messagesList = await getRecentMessagesForStudent(student_id);
      const formattedMessages = formatMessages(messagesList, true);
      return apiResponse("Messages retrieved successfully", 200, formattedMessages);
    } else {
      return apiResponse("Invalid parameter combination", 400);
    }
  } catch (error: any) {
    return apiResponse("Internal Server Error", 500, { error: error.message });
  }
}

async function getMessagesBetweenRecruiterAndStudent(recruiter_id, student_id) {
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
  return messagesList;
}

async function getMessagesBetweenStudentAndSchool(student_id, school_id) {
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
    order: [['create_date', 'ASC']],
  });
  return messagesList;
}

async function getRecentMessagesForRecruiter(recruiter_id) {
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
        ru.first_name AS recruiter_first_name,
        ru.last_name AS recruiter_last_name,
        ru.profile_image AS recruiter_profile_image,
        ru.role AS recruiter_role,
        su.first_name AS student_first_name,
        su.last_name AS student_last_name,
        su.profile_image AS student_profile_image,
        su.role AS student_role
    FROM messages m
    JOIN students s ON m.student_id = s.id
    JOIN users su ON s.user_id = su.id
    JOIN recruiters r ON m.recruiter_id = r.id
    JOIN users ru ON r.user_id = ru.id
    WHERE m.recruiter_id = ?
    ORDER BY m.student_id, m.create_date DESC`,
    {
      replacements: [recruiter_id],
      type: sequelize.QueryTypes.SELECT,
    }
  );
  return messagesList;
}

async function getRecentMessagesForStudent(student_id) {
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
        ru.first_name AS recruiter_first_name,
        ru.last_name AS recruiter_last_name,
        ru.profile_image AS recruiter_profile_image,
        su.first_name AS student_first_name,
        su.last_name AS student_last_name,
        su.profile_image AS student_profile_image
    FROM messages m
    JOIN recruiters r ON m.recruiter_id = r.id
    JOIN users ru ON r.user_id = ru.id
    JOIN students s ON m.student_id = s.id
    JOIN users su ON s.user_id = su.id
    WHERE m.student_id = ?
    ORDER BY m.recruiter_id, m.create_date DESC`,
    {
      replacements: [student_id],
      type: sequelize.QueryTypes.SELECT,
    }
  );
  return messagesList;
}

function formatMessages(messagesList, isRawQuery) {
  return messagesList.map((message) => {
    const isSenderRecruiter = isRawQuery
      ? message.sender_role === 'recruiter'
      : message.sender_role === 'recruiter';
    const senderName = isSenderRecruiter
      ? `${message.recruiter_first_name || message.recruiter.user.first_name} ${message.recruiter_last_name || message.recruiter.user.last_name}`
      : `${message.student_first_name || message.student.user.first_name} ${message.student_last_name || message.student.user.last_name}`;
    const senderImage = isSenderRecruiter
      ? message.recruiter_profile_image || message.recruiter.user.profile_image
      : message.student_profile_image || message.student.user.profile_image;
    const recipientName = !isSenderRecruiter
      ? `${message.recruiter_first_name || message.recruiter.user.first_name} ${message.recruiter_last_name || message.recruiter.user.last_name}`
      : `${message.student_first_name || message.student.user.first_name} ${message.student_last_name || message.student.user.last_name}`;
    const recipientImage = !isSenderRecruiter
      ? message.recruiter_profile_image || message.recruiter.user.profile_image
      : message.student_profile_image || message.student.user.profile_image;

    return {
      id: message.id,
      message_text: message.message_text,
      create_date: message.create_date,
      recipient_role: message.recipient_role,
      recruiter_id: message.recruiter_id,
      school_id: message.school_id,
      sender_role: message.sender_role,
      status: message.status,
      student_id: message.student_id,
      sender_name: senderName,
      sender_image: senderImage,
      receiver_name: recipientName,
      receiver_image: recipientImage,
      type: message.type, // Adding type key to indicate the type of item
    };
  });
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
    const jsonBody = await req.json();
    const {recruiter_id,school_id,student_id,sender_role,message_text} = jsonBody;
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
