import { models } from "../../../../../app/models";
import { responseBody } from "../../../../../app/config/helpers";
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
    const vitalsData: any = await getStudentVitals(req);
    if (!vitalsData) {
      return res.status(404).json(responseBody("Student Vitals data not found", 404, null));
    }
    return res
      .status(200)
      .json(responseBody("Student Vitals data retrieved successfully", 200, vitalsData));
  } catch (error: any) {
    return res
      .status(500)
      .json(responseBody("Internal Server Error", 500, { error: error.message }));
  }
}

async function handlePostRequest(req, res) {
  try {
    const updatedVitals: any = await updateStudentVitals(req);
    if (!updatedVitals) {
      return res.status(404).json(responseBody("Student not found", 404, null));
    }
    return res.status(201).json(
      responseBody("Student Vitals updated successfully", 201, null)
    );
  } catch (error: any) {
    return res
      .status(500)
      .json(responseBody("Internal Server Error", 500, { error: error.message }));
  }
}

async function getStudentVitals(req) {
  return;
}

async function updateStudentVitals(req) {
  return;
}
