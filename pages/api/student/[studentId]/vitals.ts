import type { NextApiRequest, NextApiResponse } from 'next';
import { checkForChangedAttributes } from "../../manager/profile/school-profile";
import { models } from "@/app/models";
import { responseBody } from "@/app/config/helpers";
const { Users, Students } = models;

const VITALS_FIELDS = ["id", "dob", "state", "country", "graduation_year", 
                      "high_school", "guardian_first_name", 
                      "guardian_last_name", "guardian_email"];
const VITALS_FIELDS_FROM_USERS = ["user.first_name", "user.last_name"]

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      return handleRequest(req, res, updateStudentVitals);
    case "GET":
      return handleRequest(req, res, getStudentVitals);
    default:
      return res
        .status(405)
        .json(responseBody("Method Not Allowed", 405, null));
  }
}

async function handleRequest(req, res, processingFunction) {
  try {
    const results: any = await processingFunction(req);
    return res.status(results.responseCode).json(responseBody(
      results.responseMessage,
      results.responseCode, 
      results.responseData
    ));
  } catch (error: any) {
    return res
      .status(500)
      .json(responseBody("Internal Server Error", 500, { error: error.message }));
  }
}

async function getStudentVitals(req) {
  let responseCode = 400;
  let responseMessage = "Bad Request";
  let responseData : any;

  const { studentId } = req.query;
  const studentVitals = await Students.findOne({ 
        where: {id: studentId},
        attributes: VITALS_FIELDS.concat(VITALS_FIELDS_FROM_USERS),
        include: [{
          model: Users,
          attributes: [],
          required: true
        }],
        raw: true
    });

  if (studentVitals === null) {
    responseCode = 404;
    responseMessage = "Student not found";
  }
  else {
    responseCode = 200;
    responseMessage = "Student Vitals information retrieved sucessfully.";
    responseData = studentVitals;
  }

  return {responseCode, responseMessage, responseData};
}

async function updateStudentVitals(req) {
  const { studentId } = req.query;
  const formData = req.body;
  let responseCode = 400;
  let responseMessage = "Bad Request";
  let responseData : any;

  let studentVitals = await Students.findOne({ 
        where: {id: studentId},
        attributes: VITALS_FIELDS,
  });

  if (studentVitals === null) {
    responseCode = 404;
    responseMessage = "Student not found";
  }
  else {
    const needsUpdate = await checkForChangedAttributes(
      formData, 
      studentVitals.dataValues
    );
    if (needsUpdate) {
      await studentVitals.update(formData);
    }
    responseCode = 200;
    responseMessage = "Student Vitals information saved successfully"
    responseData = studentVitals;
  }
  return {responseCode, responseMessage, responseData};
}
