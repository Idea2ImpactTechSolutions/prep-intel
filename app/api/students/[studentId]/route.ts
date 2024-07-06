import { apiResponse } from "app/config/helpers";
import { models } from "@/app/models";
const { Students, Users } = models;

/**
 * @openapi
 * /api/students/{studentId}:
 *   patch:
 *     summary: Update students record 
 *     description: Takes studentId as params and updates field of students record.
 *     tags:
 *       - student
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the student to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *              type: string
 *     responses:
 *       200:
 *         description: Student table updated successfully.
 *       404:
 *         description: Student not found.
 */

export async function PATCH(
  req: Request,
  { params }: { params: { studentId: string } }
) {

  try {
    const updateData = await req.json();

    const student = await Students.findOne({ where: { id: params.studentId } });

    if (!student) {
      return apiResponse("Student not found", 404 );
    }

    const user = await Users.findOne({ where: { id: student.user_id } });

    if (!user) {
      return apiResponse("User not found", 404);
    }
    
    const userKeys =  ['profile_complete'];

    // Update all fields in payload that correspond to the user model
    const userUpdateData = filterKeys(updateData, userKeys);
    if (Object.keys(userUpdateData).length > 0) {
      user.set(userUpdateData);
      await user.save();
    }
    
    const updatedStudent = await Students.findOne({
      where: { id: params.studentId },
      include: [{ model: Users, as: 'user' }]
    });
    
    // Response
    return apiResponse('Student updated', 200, updatedStudent);
  } catch (error: any) {
    // Notify
    return apiResponse("Errors occurred", 400, { error: error.message });
  }
}


function filterKeys(obj: any, validKeys: string[]) {
  return Object.keys(obj).reduce((acc, key) => {
    if (validKeys.includes(key) && key !== 'id') {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
}
