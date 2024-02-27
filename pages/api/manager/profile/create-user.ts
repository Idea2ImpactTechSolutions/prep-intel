import { responseBody } from "../../../../app/config/helpers";

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
        responseBody("school info added successfully", 201, [{ data: "Hello" }])
      );
  } catch (error: any) {
    // Handle any errors
    res
      .status(400)
      .json(responseBody("error occurred", 400, [{ school: error.message }]));
  }
}
