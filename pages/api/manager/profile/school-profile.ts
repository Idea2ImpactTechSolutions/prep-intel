import { sendSuccess } from "../../../../app/config/helpers";

// pages/api/manager/profile/academic-info.js
const { models } = require("../../../../app/models");
const { School, SchoolAddress, SchoolContact, SchoolSocialMedia } = models;
const { v4 } = require("uuid");

export default async function handler(req, res) {
  try {
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
      institution_type: school_details.institution_type,
      affiliations: school_details.affiliations,
    };

    let school: any = null;

    //Do a get and check school for other tables
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

    console.log({ school });

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

      const school_social_media_data = school_social_medias.map(
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
        school_social_media_data
      );

      const school_address_data = {
        school_id: school.id,
        name: school_address.school_name,
        state: school_address.school_state,
        postal: school_address.school_zip,
      };

      const newSchoolAddress = await SchoolAddress.create(school_address_data);

      school.dataValues.school_address = newSchoolAddress;
      school.dataValues.school_contacts = newSchoolContacts;
      school.dataValues.school_social_medias = newSchoolSocialMedias;
    }

    console.log("school.dataValues", school.dataValues);
    res
      .status(201)
      .json(
        sendSuccess("manager account claimed successfully", 201, [
          { school: school.dataValues },
        ])
      );
  } catch (error) {
    // Handle any errors
    console.log("error", error);
    res
      .status(400)
      .json(sendSuccess("Error occured", 400, [{ school: error.message }]));
  }
}
