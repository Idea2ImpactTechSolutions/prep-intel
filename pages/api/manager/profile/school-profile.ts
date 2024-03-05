import { Asset } from "next/font/google";
import { responseBody } from "../../../../app/config/helpers";

// pages/api/manager/profile/academic-info.js
const { models } = require("../../../../app/models");
const { School, SchoolAddress, Assets, SchoolContact, SchoolSocialMedia } =
  models;
const { v4 } = require("uuid");

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
    const newSchool: any = await createSchool(req);
    return res.status(201).json(
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
    const schoolDetails: any = await getSchool(req);
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

async function createSchool(req: any) {
  // Extract data from request body
  // 1) Figure out how to do S3 on the backend with Marvin so we can save images
  // 2) Sync with Joey with figure out how to make loading screen better and the sticky footer
  // 3) Check with Marvin how to do page numbers and skipping to a page number using the route. Add these page numbers to the route
  // 4) How to add jwt token

  const {
    school_image,
    school_details,
    school_address,
    school_social_medias,
    school_id,
  } = req.body;

  const school_contacts = school_address.contact_types;
  const id = v4();

  // Create a new school entry
  const schoolData = {
    id,
    name: school_details.name,
    found_date: new Date(school_details.founded_date),
    tagline: school_details.tagline,
    intro_paragraph: school_details.intro_paragraph,
    institution_type: school_details.institution_type,
    affiliations: school_details.affiliations,
  };

  let school: any = null;

  //Do a get and check school for other
  if (school_id) {
    //create a put
    school = await School.findByPk(school_id);
    if (school) {
      delete schoolData.id;
      school = await school.update(schoolData);
    }
  } else {
    school = await School.create(schoolData);
  }

  if (school && school.dataValues) {
    // Assuming `SchoolDepartment` is a model that relates to `School` via a foreign key `school_id`
    // Step 1: Delete existing school departments for this school
    await SchoolAddress.destroy({ where: { school_id: school.id } });
    await SchoolContact.destroy({ where: { school_id: school.id } });
    await SchoolSocialMedia.destroy({
      where: { school_id: school.id },
    });
    // Step 2: Create new school departments using the department names
    const school_contacts_data = school_contacts.map((school_contact) => ({
      school_id: school.id,
      department_name: school_contact.department_name,
      phone: school_contact.phone,
      contact_type: school_contact.contact_type,
      street_address: school_contact.street_address,
      email: school_contact.email,
    }));

    const school_social_media_data = school_social_medias?.map(
      (school_social_media) => ({
        school_id: school.id,
        social_media: school_social_media.social_media,
        url: school_social_media.url,
      })
    );

    const newSchoolContacts = await SchoolContact.bulkCreate(
      school_contacts_data
    );

    const newSchoolSocialMedias = await SchoolSocialMedia.bulkCreate(
      school_social_media_data || []
    );

    const school_address_data = {
      school_id: school.id,
      name: school_address.school_name,
      state: school_address.school_state,
      city: school_address.city,
      street_address_1: school_address.street_address,
      postal: school_address.school_zip,
    };

    const newSchoolAddress = await SchoolAddress.create(school_address_data);

    school.dataValues.school_address = newSchoolAddress;
    school.dataValues.school_contacts = newSchoolContacts;
    school.dataValues.school_social_medias = newSchoolSocialMedias;
  }
  return school;
}

async function getSchool(req: any) {
  let schoolDetails: any = null;
  const { school_id } = req.query;
  if (school_id) {
    schoolDetails = await School.findByPk(school_id, {
      include: [
        { model: SchoolAddress, as: "school_address" },
        { model: SchoolContact, as: "school_contacts" },
        { model: Assets, as: "assets" },
        { model: SchoolSocialMedia, as: "school_social_medias" },
      ],
    });

    // If schoolDetails is not null, format the response object
    if (schoolDetails) {
      schoolDetails = {
        ...schoolDetails.toJSON(),
        school_address: schoolDetails.school_address || [],
        school_contacts: schoolDetails.school_contacts || [],
        assets: schoolDetails.assets || [],
        school_social_medias: schoolDetails.school_social_medias || [],
      };
    }
  }
  return schoolDetails;
}
