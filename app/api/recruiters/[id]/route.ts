import { apiResponse } from "app/config/helpers";
const { models } = require("app/models");
const { Users, Recruiters, Assets } = models;
import {includeKeys} from 'filter-obj';

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
    const updateData = await req.json();
    const recruiter = await Recruiters.findOne({ where: { id: params.id } });

    if (!recruiter) {
      return apiResponse("Recruiter not found", 404 );
    }

    const user = await Users.findOne({ where: { id: recruiter.user_id } });

    // Update fields
    user.set(includeKeys(updateData, ['first_name', 'last_name', 'phone']));

    // Update db
    //const updatedRecruiter = await recruiter.save();
    const updated = await user.save();

    // Response
    //return apiResponse("Recruiter updated", 200, updatedRecruiter);
    return apiResponse("Recruiter updated", 200, updated);
  } catch (error: any) {
    // Notify
    return apiResponse("Errors occurred", 400, { error: error.message });
  }
}
