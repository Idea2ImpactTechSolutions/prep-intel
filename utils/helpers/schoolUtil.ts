// schoolUtils.ts

import { models } from "../../app/models";
const { School } = models;

/**
 * Creates a sample school in the database and returns its ID.
 * @returns {Promise<string>} The ID of the created school.
 */
export async function createSampleSchool(): Promise<number> {
  const sampleSchoolData = {
    name: 'Sample School',
    address: '123 Test Lane',
    // ... other necessary fields
  };

  try {
    const school = await School.create(sampleSchoolData);
    return school.id; // Return the ID of the created school record
  } catch (error) {
    throw error; // Rethrow the error so the test suite is aware of it
  }
}

/**
 * Deletes the sample school from the database.
 * @param {string} schoolId - The ID of the school to delete.
 * @returns {Promise<void>}
 */
export async function deleteSampleSchool(schoolId: number): Promise<void> {
  try {
    await School.destroy({
      where: {
        id: schoolId
      }
    });
  } catch (error) {
    throw error; // Rethrow the error so the test suite is aware of it
  }
}
