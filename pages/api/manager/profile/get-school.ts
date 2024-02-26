import { sendSuccess } from "../../../../app/config/helpers";
const { models } = require("../../../../app/models");

const {
  School,
  SchoolAddress,
  SchoolContact,
  SchoolSocialMedia,
  SchoolDepartment,
  SchoolAccreditation,
  SchoolResearchProgram,
} = models;

export default async function handler(req, res) {
  try {
    let schoolDetails: any = null;
    const { school_id } = req.query;
    if (school_id) {
      schoolDetails = await School.findByPk(school_id, {
        include: [
          { model: SchoolAddress, as: "school_address" },
          { model: SchoolContact, as: "school_contacts" },
          { model: SchoolSocialMedia, as: "school_social_medias" },
          { model: SchoolDepartment, as: "school_departments" },
          { model: SchoolAccreditation, as: "school_accreditations" },
          { model: SchoolResearchProgram, as: "school_research_programs" },
        ],
      });

      // If schoolDetails is not null, format the response object
      if (schoolDetails) {
        schoolDetails = {
          ...schoolDetails.toJSON(),
          school_address: schoolDetails?.school_address || [],
          school_contacts: schoolDetails?.school_contacts || [],
          school_social_medias: schoolDetails?.school_social_medias || [],
          school_departments: schoolDetails?.school_departments || [],
          school_accreditations: schoolDetails?.school_accreditations || [],
          researchPrograms: schoolDetails?.researchPrograms || [],
        };
      }
    }
    // Respond with the school details or null if no school_id is provided
    return res
      .status(200)
      .json(sendSuccess("success", 200, [{ school: schoolDetails }]));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
