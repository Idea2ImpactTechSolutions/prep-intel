const { models } = require("../../../../app/models");
const { School, SchoolDepartment, SchoolAccreditation, SchoolResearchProgram } =
  models;
const { v4 } = require("uuid");

export default async function handler(req, res) {
  if (req.method === "POST") {
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
      let schoolDetails = null;
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
      console.log("schoolDetails", schoolDetails);
      res.status(200).json(schoolDetails);
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}