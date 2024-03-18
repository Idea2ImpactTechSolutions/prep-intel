import { models } from "../../../app/models";
import { responseBody } from "../../../app/config/helpers";
const { School, Users } = models;

const VALID_ROLES = ["manager", "recruiter", "student", "admin"]
const VALID_FIELDS = ["id", "first_name", "last_name", "email", "school_id", 
                      "role", "account_claimed", "is_active"]

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
    let responseCode : number = 0;
    let responseMessage : string = '';
    let responseData : any;

    const {
        role,
        school_id,
        fields
     } = req.query;

     let inputRoles : string[] = [];
     if (role) {
      inputRoles = role.toLowerCase().split(",");
     }

     let inputFields : string[] = [];
     if (fields) {
      inputFields = fields.toLowerCase().split(",");
     }

     const validRequest = await validateUsersRequestParameters(
      inputRoles,
      inputFields,
      school_id
     );

    if (typeof validRequest == "boolean" && validRequest) {
      if (!inputFields.length) {
        inputFields = VALID_FIELDS;
      }
      let users = await Users.findAll({where: {
        school_id: school_id,
        role: inputRoles
      },
        attributes: inputFields
      });
      if (!users.length) {
        responseCode = 404;
        responseMessage = "Users not found";
      }
      else {
        responseData = users;
        responseCode = 200;
        responseMessage = "Users retrieved successfully";
      }
    }
    else if (typeof validRequest == "object") {
      responseCode = validRequest.errorCode;
      responseMessage = validRequest.errorMessage;
    }
    return {responseData, responseCode, responseMessage};
  }

  async function validateUsersRequestParameters(roles, fields, schoolID) {
    let errorCode : number = 400;
    let errorMessage : string = '';
    const school = await School.findByPk(schoolID);

    if (!school) {
      errorCode = 404;
      errorMessage = "School not found";
    }
    else if (!roles.length || !roles.every((role) => VALID_ROLES.includes(role))) {
      errorMessage = "Invalid roles";
    }
    else if (fields && !fields.every((field) => VALID_FIELDS.includes(field))) {
      errorMessage = "Invalid fields";
    }
    else {
      return true;
    }

    if (errorMessage) {
      return {errorCode, errorMessage};
    }
  }
