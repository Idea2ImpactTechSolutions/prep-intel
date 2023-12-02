// pages/api/manager/profile/academic-info.js
const { models } = require("../../../../app/models");
const { School } = models;
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
          console.log(school);
          school = await school.update(schoolData);
        }
      } else {
        school = await School.create(schoolData);
      }

      // Send a successful response
      res.status(201).json(school);
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
