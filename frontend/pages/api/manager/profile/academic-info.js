// pages/api/manager/profile/academic-info.js
const { models } = require("../../../../app/models");
const { School, SchoolDepartment, SchoolAccreditation, SchoolResearchProgram } =
  models;
const { v4 } = require("uuid");

export default async function handler(req, res) {
  console.log("test");
  if (req.method === "POST") {
    try {
      // Extract data from request body
      const {
        admissionRequirements,
        financials,
        departments,
        accreditations,
        researchOpportunities,
        schoolId,
      } = req.body;
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
        id,
        actRequired: admissionRequirements.actRequired,
        satRequired: admissionRequirements.satRequired,
        diplomaRequired: admissionRequirements.diplomaRequired,
        actScore: admissionRequirements.actScore,
        satScore: admissionRequirements.satScore,
        gpa: admissionRequirements.gpa,
        in_state_tuition: inStateTuition,
        out_state_tuition: outOfStateTuition,
        fees_per_semester: feesPerSemester,
        scholarship_url: scholarshipInfoURL,
        financial_aid_url: financialAidInfoURL,
      };
      let school = null;

      //Do a get and check for other tables
      if (schoolId) {
        //create a put
        school = await School.findByPk(schoolId);
        if (school) {
          delete schoolData.id;
          school = await school.update(schoolData);
        }
      } else {
        school = await School.create(schoolData);
      }

      if (school && school.dataValues) {
        // Assuming `SchoolDepartment` is a model that relates to `School` via a foreign key `schoolId`
        // Step 1: Delete existing school departments for this school
        await SchoolAccreditation.destroy({ where: { school_id: school.id } });
        await SchoolDepartment.destroy({ where: { school_id: school.id } });
        await SchoolResearchProgram.destroy({
          where: { school_id: school.id },
        });

        // Step 2: Create new school departments using the department names
        const schoolDepartmentsData = departments.map((dept) => ({
          school_id: school.id, // foreign key linking to the school
          name: dept.name, // or any other fields you have for the department
        }));

        const schoolAccreditationData = accreditations.map((accred) => ({
          school_id: school.id,
          name: accred.name,
        }));

        const schoolResearchProgramData = researchOpportunities.map(
          (researchOpportunities) => ({
            school_id: school.id,
            name: researchOpportunities.name,
          })
        );

        const newSchoolDepartments = await SchoolDepartment.bulkCreate(
          schoolDepartmentsData
        );

        const newSchoolAccreditations = await SchoolAccreditation.bulkCreate(
          schoolAccreditationData
        );

        const newSchoolResearchPrograms =
          await SchoolResearchProgram.bulkCreate(schoolResearchProgramData);

        school.dataValues.schoolDepartments = newSchoolDepartments;
        school.dataValues.schoolAccreditations = newSchoolAccreditations;
        school.dataValues.schoolResearchPrograms = newSchoolResearchPrograms;
      }

      // Send a successful response
      res.status(201).json(school.dataValues);
    } catch (error) {
      // Handle any errors
      console.log("error", error);
      res.status(400).json({ error: error.message });
    }
  } else if (req.method === "GET") {
    try {
    } catch (error) {}
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
