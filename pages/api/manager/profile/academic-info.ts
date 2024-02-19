import { sendSuccess } from "../../../../app/config/helpers";

const { models } = require("../../../../app/models");
const { School, SchoolDepartment, SchoolAccreditation, SchoolResearchProgram } =
  models;
const { v4 } = require("uuid");

export default async function handler(req, res) {
  try {
    // Extract data from request body
    const {
      admissionRequirements,
      financials,
      school_departments,
      school_accreditations,
      school_research_programs,
      schoolId,
    } = req.body;
    console.log({ schoolId });
    const id = v4();
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
        let school = await School.update(schoolData, {
          where: { id: schoolId },
        });
      }
    } else {
      school = await School.create(schoolData);
    }

    console.log({ school1: school });

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

      const newSchoolAccreditations = await SchoolAccreditation.bulkCreate(
        schoolAccreditationData
      );

      const newSchoolResearchPrograms = await SchoolResearchProgram.bulkCreate(
        schoolResearchProgramData
      );

      school.dataValues.schoolDepartments = newSchoolDepartments;
      school.dataValues.schoolResearchPrograms = newSchoolResearchPrograms;
    }

    // Send a successful response
    return res
      .status(201)
      .json(
        sendSuccess("school info added successfully", 201, [
          { school: school.dataValues },
        ])
      );
  } catch (error: any) {
    // Handle any errors
    console.log("error", error);
    return res
      .status(400)
      .json(sendSuccess("error occurred", 400, [{ error: error.message }]));
  }
}
