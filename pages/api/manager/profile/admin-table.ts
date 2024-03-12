import { responseBody } from "../../../../app/config/helpers";

const { models } = require("../../../../app/models");
const {
  School,
  SchoolDepartment,
  Managers,
  Recruiters,
  SchoolAccreditation,
  SchoolResearchProgram,
} = models;
const { v4 } = require("uuid");

export default async function handler(req, res) {
  try {
    // Extract data from request body
    const { school_id } = req.body;

    let isSchoolExist = await School.findOne({ where: { id: school_id } });

    if (!isSchoolExist) {
      return res
        .status(404)
        .json(responseBody("school with id not found", 404, [{ data: [] }]));
    }

    let admin: any = [];

    let managers = await Managers.findAll({
      where: { school_id: school_id },
    });

    let recruiters = await Recruiters.findAll({
      where: { school_id: school_id },
    });

    for (let i = 0; i < managers.length; i++) {
      const status = managers[i].is_active === 1 ? "Active" : "Inactive";
      admin.push({
        full_name: managers[i].first_name + " " + managers[i].last_name,
        email: managers[i].email,
        role: "Admin",
        is_active: status,
      });
    }

    for (let i = 0; i < recruiters.length; i++) {
      const status = recruiters[i].is_active === 1 ? "Active" : "Inactive";
      admin.push({
        full_name: recruiters[i].first_name + " " + recruiters[i].last_name,
        email: recruiters[i].email,
        role: "Recruiter",
        is_active: status,
      });
    }

    // Send a successful response
    return res
      .status(201)
      .json(responseBody("success", 200, [{ data: admin }]));
  } catch (error: any) {
    // Handle any errors
    res
      .status(400)
      .json(responseBody("error occurred", 400, [{ school: error.message }]));
  }
}
