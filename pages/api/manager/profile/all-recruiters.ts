import { responseBody } from "../../../../app/config/helpers";

const { models } = require("../../../../app/models");
const { School, Recruiters } = models;
const { v4 } = require("uuid");

export default async function handler(req, res) {
  try {
    // Extract data from request body

    const { school_id } = req.query;

    let school = await School.findOne({ where: { id: school_id } });

    if (!school) {
      return res
        .status(201)
        .json(responseBody("school does not exist", 404, []));
    }

    let recruiters = await Recruiters.findAll({
      where: { school_id: school_id },
    });

    if (!recruiters) {
      return res.status(404).json(responseBody("no recruiter found", 404, []));
    }

    // Send a successful response
    return res.status(201).json(responseBody("success", 200, [recruiters]));
  } catch (error: any) {
    // Handle any errors
    return res
      .status(400)
      .json(responseBody("error occurred", 400, [{ school: error.message }]));
  }
}
