import { sendSuccess } from "../../../../app/config/helpers";

const { models } = require("../../../../app/models");
const { School, SchoolDepartment, SchoolAccreditation, SchoolResearchProgram } =
  models;
const { v4 } = require("uuid");

export default async function handler(req, res) {
  try {
    // Extract data from request body

    // Send a successful response
    return res
      .status(201)
      .json(
        sendSuccess("school info added successfully", 201, [{ data: "Hello" }])
      );
  } catch (error) {
    // Handle any errors
    res
      .status(400)
      .json(sendSuccess("error occurred", 400, [{ school: error.message }]));
  }
}
