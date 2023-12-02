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
      } = req.body;
      const id = v4();

      // Create a new school entry
      const schoolData = {
        id,
        actRequired: admissionRequirements.actRequired,
        satRequired: admissionRequirements.satRequired,
        diplomaRequired: admissionRequirements.diplomaRequired,
        actScore: admissionRequirements.actScore,
        satScore: admissionRequirements.satScore,
        gpa: admissionRequirements.gpa,
      };
      const newSchool = await School.create(schoolData);

      // Send a successful response
      res.status(201).json(newSchool);
    } catch (error) {
      // Handle any errors
      console.log("error", error);
      res.status(400).json({ error: error.message });
    }
  } else {
    // If not a POST request, send 405 - Method Not Allowed
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
