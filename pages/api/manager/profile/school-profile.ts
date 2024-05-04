import { responseBody } from "../../../../app/config/helpers";
const { models } = require("../../../../app/models");
const { School, SchoolAddress, Assets, SchoolContact, SchoolSocialMedia } = models;
const { Op } = require('sequelize');
import {
  SCHOOL_PROFILE_IMAGE,
  SCHOOL_BANNER_IMAGE,
  SCHOOL_DOCUMENT,
} from "@/types/assetTypes";


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
    const updatedSchool: any = await updateSchoolProfile(req);
    return res.status(201).json(
      responseBody("School profile updated successfully", 201, {
        school: updatedSchool.dataValues,
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

async function updateSchoolProfile(req: any) {
  // Extract data from request body
  // 1) Figure out how to do S3 on the backend with Marvin so we can save images
  // 2) Sync with Joey with figure out how to make loading screen better and the sticky footer
  // 3) Check with Marvin how to do page numbers and skipping to a page number using the route. Add these page numbers to the route
  // 4) How to add jwt token

  const {
    // school_image,
    school_details,
    school_address,
    school_social_medias,
    school_id,
  } = req.body;

  const school_contacts = school_address.contact_types;

  // Create a new school entry
  const schoolData = {
    id: school_id,
    name: school_details.name,
    found_date: new Date(school_details.founded_date),
    tagline: school_details.tagline,
    intro_paragraph: school_details.intro_paragraph,
    institution_type: school_details.institution_type,
    affiliations: school_details.affiliations,
  };

  let school: any = null;
  if (school_id) {
    school = await School.findByPk(school_id);
  }

  if (school && school.dataValues) {
    const schoolNeedsUpdate = await checkForChangedAttributes(schoolData, school.dataValues);
    if (schoolNeedsUpdate) {
      school = await school.update(schoolData);
    }

    // Check if a school address record needs to be created or updated
    const savedAddress = await updateSchoolAddress(school.id, school_address);
    school.dataValues.school_address = savedAddress;

    // Check if school contact records need to be created, removed, or updated
    const savedContacts = await updateSchoolContacts(school.id, school_contacts)
    school.dataValues.school_contacts = savedContacts;

    // Check if school social media records need to be created, removed, or updated
    const savedSocialMediaRecords = await updateSchoolSocialMediaRecords(school.id, school_social_medias);
    school.dataValues.school_social_medias = savedSocialMediaRecords;
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
        {
          model: Assets,
          as: "assets",
          where: {
            category: {
              [Op.in]: [SCHOOL_PROFILE_IMAGE, SCHOOL_BANNER_IMAGE, SCHOOL_DOCUMENT]
            }
          },
          required: false, // Make the inclusion of assets optional
        },
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

export async function checkForChangedAttributes(formData, savedDataValues) {
  let needsUpdate: boolean = false;
  for (const [key, value] of Object.entries(formData)) {
    if (value != savedDataValues[key]) {
      needsUpdate = true;
      break;
    }
  }
  return needsUpdate;
}

async function updateSchoolAddress(schoolId : string, schoolAddressFormData) {

  const schoolAddressData = {
    school_id: schoolId,
    id: schoolAddressFormData.address_id,
    street_address_1: schoolAddressFormData.street_address,
    city: schoolAddressFormData.city,
    state: schoolAddressFormData.school_state,
    postal: schoolAddressFormData.school_zip,
  };


  if (!schoolAddressData.id) {
    delete schoolAddressData.id; // Remove the id key if it's empty or invalid
  }

  // Now schoolAddressData no longer has the 'id' key if it was invalid
  let [savedAddress, newAddressCreated] = await SchoolAddress.findOrCreate({
    where: schoolAddressData.id ? { id: schoolAddressData.id } : {},
    defaults: schoolAddressData
  });

  if (! newAddressCreated) {
    const addressNeedsUpdate = await checkForChangedAttributes(
      schoolAddressData,
      savedAddress.dataValues
    );
    if (addressNeedsUpdate) {
      await savedAddress.update(schoolAddressData);
    }
  }
  return savedAddress;
}

async function reconcileRecordsLists(schoolId: string, formRecords, dbModel) {

  let savedRecords = await dbModel.findAll({ where: { school_id: schoolId } });
  const formRecordsIds = formRecords.map(formRecord => formRecord.id);

  for (let i = savedRecords.length - 1; i >= 0; i--) {
    if (! formRecordsIds.includes(savedRecords[i].id)) {
      await savedRecords[i].destroy();
      savedRecords.splice(i, 1);
    }
  }

  let newRecords: object[] = [];
  for (let i = 0; i < formRecords.length; i++) {
    if (formRecords[i].id == undefined) {
      const newRecord = await dbModel.create(formRecords[i]);
      newRecords.push(newRecord);
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
  newRecords.forEach((newRecord) => {
    savedRecords.push(newRecord);
  })
  return savedRecords;
}

async function updateSchoolContacts(schoolId: string, schoolContactsFormData) {
  const schoolContactsData = schoolContactsFormData.map((schoolContact) => ({
    school_id: schoolId,
    id: schoolContact.contact_id,
    contact_type: schoolContact.contact_type,
    phone: schoolContact.phone,
    email: schoolContact.email,
  }));

  return await reconcileRecordsLists(schoolId, schoolContactsData, SchoolContact);
}

async function updateSchoolSocialMediaRecords(schoolId: string, schoolSocialMediaFormData) {
  const schoolSocialMediaData = schoolSocialMediaFormData?.map((schoolSocialMedia) => ({
    school_id: schoolId,
    id: schoolSocialMedia.social_media_id,
    social_media: schoolSocialMedia.social_media,
    url: schoolSocialMedia.url,
  }));

  return await reconcileRecordsLists(schoolId, schoolSocialMediaData, SchoolSocialMedia);
}
