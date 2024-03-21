import { models } from "../../../../app/models";
import { responseBody } from "../../../../app/config/helpers";
const { Users, Students } = models;

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      return res
        .status(501)
        .json(responseBody("Not implemented", 501, null));
    case "GET":
      return res
        .status(501)
        .json(responseBody("Not implemented", 501, null));
    default:
      return res
        .status(405)
        .json(responseBody("Method Not Allowed", 405, null));
  }
}

async function handleGetRequest(req, res) {
  try {
    const studentSchools: any = await getStudentSchools(req);
    if (!studentSchools) {
      return res.status(404).json(responseBody("School interests not found", 404, null));
    }
    return res
      .status(200)
      .json(responseBody("School interests retrieved successfully", 200, studentSchools));
  } catch (error: any) {
    return res
      .status(500)
      .json(responseBody("Internal Server Error", 500, { error: error.message }));
  }
}

async function handlePostRequest(req, res) {
  try {
    const updatedVitals: any = await updateStudentSchools(req);
    if (!updatedVitals) {
      return res.status(404).json(responseBody("Student not found", 404, null));
    }
    return res.status(201).json(
      responseBody("School interests updated successfully", 201, null)
    );
  } catch (error: any) {
    return res
      .status(500)
      .json(responseBody("Internal Server Error", 500, { error: error.message }));
  }
}

async function getStudentSchools(req) {
  return;
}

async function updateStudentSchools(req) {
  return;
}
