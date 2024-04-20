// schoolUtils.ts

import { models } from "../../app/models";
const { Users } = models;

/**
 * Creates a sample user in the database and returns its ID.
 * @returns {Promise<string>} The ID of the created school.
 */
export async function createSampleUser(auth_code): Promise<number> {
  const sampleUserData = {
    first_name: "Test",
    last_name: "User",
    email : "Test.User@i2i.com",
    is_active: false,
    auth_code : auth_code,
    role: 'student'
  };

  try {
    const user = await Users.create(sampleUserData);
    return user.id; // Return the ID of the created user record
  } catch (error) {
    throw error; // Rethrow the error so the test suite is aware of it
  }
}

/**
 * Deletes the sample user from the database.
 * @param {string} userId - The ID of the school to delete.
 * @returns {Promise<void>}
 */
export async function deleteSampleUser(userId: number): Promise<void> {
  try {
    await Users.destroy({
      where: {
        id: userId
      }
    });
  } catch (error) {
    throw error; // Rethrow the error so the test suite is aware of it
  }
}
