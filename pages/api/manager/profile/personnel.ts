import { responseBody } from "@/app/config/helpers";
const { models } = require("@/app/models");
const { School, Users } = models;

const PERSONNEL_ROLES = ["manager", "recruiter"]

export default async function handler(req, res) {
    switch (req.method) {
      case "GET":
        return handleGetRequest(req, res);
      default:
        return res
          .status(405)
          .json(responseBody("Method Not Allowed", 405, null));
    }
  }

  async function handleGetRequest(req, res) {
    try {
      const results : any = await getUsers(req);
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

  async function getUsers(req) {
    let responseCode : number = 404;
    let responseMessage : string = '';
    let responseData = [];

    const {
        school_id
     } = req.query;

    const schoolExists = await School.findByPk(school_id);

    if (schoolExists) {
      let users = await Users.findAll({where: {
        school_id: school_id,
        role: PERSONNEL_ROLES
      }});

      responseData = users.map((user) => ({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        is_active: user.is_active  ? "Active" : "Inactive"
      }));
      responseCode = 200;
      responseMessage = "Personnel retrieved successfully";
    } else {
      responseMessage = "School not found";
    }

    return {responseData, responseCode, responseMessage};
  }