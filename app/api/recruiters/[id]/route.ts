import { apiResponse } from "@/app/config/helpers";
import { models } from "@/app/models";
const { Users, Recruiters, Assets } = models;

/**
 * @openapi
 * /api/recruiters/{id}:
 *   get:
 *     summary: Get a recruiter by ID
 *     tags:
 *       - recruiter
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The recruiter's ID
 *     responses:
 *       '200':
 *         description: Recruiter found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recruiter'
 *       '404':
 *         description: No recruiter found
 *       '400':
 *         description: Error occurred
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const recruiter = await Recruiters.findOne({
      where: {
        id: params.id,
      },
      include: [
        {
          model: Users,
          attributes: {
            exclude: ["password", "email"], // Exclude password and email from the results
          },
        },
      ],
    });

    // Collect the profile image and merge it into the response. Could be done with
    // more effort and a join, but this is very low cost as is...
    const assets = await Assets.findOne({
      where: {
        user_id: recruiter.user.id,
        category: "recruiter-profile-image",
      },
    });

    if (assets) {
      recruiter.dataValues['profile_img'] = assets.location;
    }

    if (recruiter) {
      return apiResponse("Recruiter found", 200, recruiter);
    } else {
      return apiResponse("No recruiter found", 404);
    }
  } catch (error: any) {
    // Report
    return apiResponse("Error occurred", 400, { error: error.message });
  }
}

/**
 * @openapi
 * /api/recruiters/{id}:
 *   patch:
 *     summary: Update a recruiter's information
 *     description: Updates the information of the recruiter with the specified ID.
 *     tags:
 *       - recruiter
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the recruiter to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Recruiter updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Recruiter'
 *       404:
 *         description: Recruiter not found.
 *       400:
 *         description: Error occurred.
 */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {

  try {
    let responseMessage = 'Recruiter not updated';
    const updateData = await req.json();

    const recruiter = await Recruiters.findOne({ where: { id: params.id } });

    if (!recruiter) {
      return apiResponse("Recruiter not found", 404 );
    }

    const user = await Users.findOne({ where: { id: recruiter.user_id } });

    if (!user) {
      return apiResponse("User not found", 404);
    }
    
    const userKeys = Object.keys(Users.getAttributes());
    const recruiterKeys = Object.keys(Recruiters.getAttributes());

    // Update all fields in payload that correspond to the user model
    const userUpdateData = filterKeys(updateData, userKeys);
    if (Object.keys(userUpdateData).length > 0) {
      responseMessage = 'Recruiter updated'
      user.set(userUpdateData);
      await user.save();
    }

    // Update all fields in payload that correspond to the recruiter model
    const recruiterUpdateData = filterKeys(updateData, recruiterKeys);
    if (Object.keys(recruiterUpdateData).length > 0) {
      responseMessage = 'Recruiter updated'
      recruiter.set(recruiterUpdateData);
      await recruiter.save();
    }

    const updatedRecruiter = await Recruiters.findOne({
      where: { id: params.id },
      include: [{ model: Users, as: 'user' }]
    });
    


    // Response
    return apiResponse(responseMessage, 200, updatedRecruiter);
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
