import { Asset } from "next/font/google";
import { responseBody } from "../../../../app/config/helpers";

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
    case "PATCH":
      return handlePatchRequest(req, res);
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

async function handlePatchRequest(req: any, res: any) {
  try {
    const newSchool: any = await addSchoolPublishDate(req);
    if (!newSchool) {
      return res.status(404).json(
        responseBody("school not found", 404, {
          school: "",
        })
      );
    }
    return res.status(201).json(
      responseBody("school profile published successfully", 201, {
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

async function addSchoolPublishDate(req: any) {
  const { publish_date, school_id } = req.body;

  let school = await School.findOne({ where: { id: school_id } });
  if (!school) {
    return false;
  }

  let update = await School.update(
    { publish_date: publish_date },
    { where: { id: school_id } }
  );

  return update;
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
    // Check if a school address record needs to be created or updated
    const school_address_data = {
      school_id: school.id,
      id: school_address.address_id,
      street_address_1: school_address.street_address,
      city: school_address.city,
      state: school_address.school_state,
      postal: school_address.school_zip,
    };

    const savedAddress = await updateSchoolAddress(school_address.address_id, school_address_data);
    school.dataValues.school_address = savedAddress;

    // Check if school contact records need to be created, removed, or updated
    const school_contacts_data = school_contacts.map((school_contact) => ({
      school_id: school.id,
      id: school_contact.contact_id,
      contact_type: school_contact.contact_type,
      phone: school_contact.phone,
      email: school_contact.email,
    }));

    const savedContacts = await updateContactsOrSocialMediaRecords(school_id, school_contacts_data, SchoolContact);
    school.dataValues.school_contacts = savedContacts;

    // Check if school social media records need to be created, removed, or updated
    const school_social_media_data = school_social_medias?.map((school_social_media) => ({
        school_id: school.id,
        id: school_social_media.social_media_id,
        social_media: school_social_media.social_media,
        url: school_social_media.url,
    }));

    const savedSocialMedias = await updateContactsOrSocialMediaRecords(school_id, school_social_media_data, SchoolSocialMedia);
    school.dataValues.school_social_medias = savedSocialMedias;
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
        { model: Assets, as: "assets", where: { is_active: true } },
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

async function updateSchoolAddress(addressId : string, schoolAddressData) {
  let [savedAddress, newAddressCreated] = await SchoolAddress.findOrCreate({ where: { id: addressId }, 
    defaults: schoolAddressData });
    
  if (! newAddressCreated) {
    const addressNeedsUpdate = await checkForChangedAttributes(schoolAddressData, savedAddress.dataValues);
    if (addressNeedsUpdate) {
      await savedAddress.update(schoolAddressData);
    }
  }
  return savedAddress;
}

async function checkForChangedAttributes(formData, savedDataValues) {
  let needsUpdate: boolean = false;
  for (const [key, value] of Object.entries(formData)) {
    if (value != savedDataValues[key]) {
      needsUpdate = true;
      break;
    }
  }
  return needsUpdate;
}

async function updateContactsOrSocialMediaRecords(schoolId: string, formRecords, dbModel) {
  let savedRecords = await dbModel.findAll({ where: { school_id: schoolId } });
  const formRecordsIds = formRecords.map(formRecord => formRecord.id);

  for (let i = savedRecords.length - 1; i >= 0; i--) {
    if (! formRecordsIds.includes(savedRecords[i].id)) {
      await savedRecords[i].destroy();
      savedRecords.splice(i, 1);
    }
  }

  for (let i = 0; i < formRecords.length; i++) {
    if (formRecords[i].id == undefined) {
      const newRecord = await dbModel.create(formRecords[i]);
      savedRecords.push(newRecord);
    }
    else {
      for (let j = 0; j < savedRecords.length; j++) {
        if (savedRecords[j].id == formRecords[i].id) {
          const recordNeedsUpdate = await checkForChangedAttributes(formRecords[i], 
            savedRecords[j].dataValues);
          if (recordNeedsUpdate) {
            await savedRecords[j].update(formRecords[i]);
          }
          break;
        }
      }
    }
  }
  return savedRecords;
}
