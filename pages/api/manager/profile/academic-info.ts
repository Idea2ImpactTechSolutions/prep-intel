import { responseBody } from "../../../../app/config/helpers";
const { models } = require("../../../../app/models");
const { School, SchoolDepartment, SchoolAccreditation, SchoolResearchProgram } =
  models;

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      return handlePostRequest(req, res);
    case "GET":
      return handleGetRequest(req, res);
    default:
      return res
        .status(405)
        .json(responseBody("Method Not Allowed", 405, null));
  }
}

async function handlePostRequest(req, res) {
  try {
    const newSchool: any = await createSchoolDetails(req);
    return res
      .status(201)
      .json(
        responseBody("Manager account claimed successfully", 201, {
          school: newSchool.dataValues,
        })
      );
  } catch (error: any) {
    return res
      .status(400)
      .json(responseBody("Error occurred", 400, { error: error.message }));
  }
}

async function handleGetRequest(req, res) {
  try {
    const schoolDetails: any = await getSchoolDetails(req);
    if (!schoolDetails) {
      return res.status(404).json(responseBody("School not found", 404, null));
    }
    return res
      .status(200)
      .json(responseBody("School retrieved successfully", 200, schoolDetails));
  } catch (error: any) {
    return res
      .status(400)
      .json(responseBody("Error occurred", 400, { error: error.message }));
  }
}

async function createSchoolDetails(req: any) {
  // Extract data from request body
  const {
    admissionRequirements,
    financials,
    school_departments,
    school_accreditations,
    school_research_programs,
    schoolId,
    application_url,
  } = req.body;
  const {
    inStateTuition,
    outOfStateTuition,
    feesPerSemester,
    scholarshipInfoURL,
    financialAidInfoURL,
  } = financials;

  // Create a new school entry
  const schoolData = {
    act_required: admissionRequirements.act_required,
    sat_required: admissionRequirements.sat_required,
    diploma_required: admissionRequirements.diploma_required,
    min_act_score: admissionRequirements.min_act_score,
    min_sat_score: admissionRequirements.min_sat_score,
    gpa_requirement: admissionRequirements.gpa_requirement,
    in_state_tuition: inStateTuition,
    out_state_tuition: outOfStateTuition,
    application_url: application_url,
    fees_per_semester: feesPerSemester,
    scholarship_url: scholarshipInfoURL,
    financial_aid_url: financialAidInfoURL,
  };
  let school: any = null;

  //Do a get and check for other tables
  if (schoolId) {
    //create a put
    school = await School.findByPk(schoolId);
    if (school) {
      // delete schoolData.id;
      await School.update(schoolData, {
        where: { id: schoolId },
      });
    }
  } else {
    school = await School.create(schoolData);
  }

  if (school && school.dataValues) {
    // Assuming `SchoolDepartment` is a model that relates to `School` via a foreign key `schoolId`
    // Step 1: Delete existing school school_departments for this school
    await SchoolAccreditation.destroy({ where: { school_id: school.id } });
    await SchoolDepartment.destroy({ where: { school_id: school.id } });
    await SchoolResearchProgram.destroy({
      where: { school_id: school.id },
    });

    // Step 2: Create new school school_departments using the department names
    const schoolDepartmentsData = school_departments.map((dept) => ({
      school_id: school.id, // foreign key linking to the school
      name: dept.name, // or any other fields you have for the department
    }));

    const schoolAccreditationData = school_accreditations.map((accred) => ({
      school_id: school.id,
      name: accred.name,
    }));

    const schoolResearchProgramData = school_research_programs.map(
      (school_research_programs) => ({
        school_id: school.id,
        name: school_research_programs.name,
      })
    );

    const newSchoolDepartments = await SchoolDepartment.bulkCreate(
      schoolDepartmentsData
    );

    await SchoolAccreditation.bulkCreate(
      schoolAccreditationData
    );

    const newSchoolResearchPrograms = await SchoolResearchProgram.bulkCreate(
      schoolResearchProgramData
    );

    school.dataValues.schoolDepartments = newSchoolDepartments;
    school.dataValues.schoolResearchPrograms = newSchoolResearchPrograms;
  }
  // Send a successful response
  return school;
}

async function getSchoolDetails(req: any) {
  let schoolDetails: any = null;
  const { schoolId } = req.query;
  if (schoolId) {
    schoolDetails = await School.findByPk(schoolId, {
      include: [
        { model: SchoolDepartment, as: "school_departments" },
        { model: SchoolAccreditation, as: "school_accreditations" },
        { model: SchoolResearchProgram, as: "school_research_programs" },
      ],
    });

    // If schoolDetails is not null, format the response object
    if (schoolDetails) {
      schoolDetails = {
        ...schoolDetails.toJSON(),
        school_departments: schoolDetails.school_departments || [],
        school_accreditations: schoolDetails.school_accreditations || [],
        researchPrograms: schoolDetails.researchPrograms || [],
      };
    }
  }

  // Respond with the school details or null if no schoolId is provided
  return schoolDetails;
}
