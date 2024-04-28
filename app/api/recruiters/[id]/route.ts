import { responseBody } from "app/config/helpers";
const { models } = require("app/models");
const { Users, Recruiters } = models;

/**
 * @openapi
 * /api/recruiters/{id}:
 *   get:
 *     summary: Get a recruiter by ID
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

    if (recruiter) {
      return Response.json(responseBody("Recruiter found", 200, recruiter));
    } else {
      return Response.json(responseBody("No recruiter found", 404), {
        status: 404,
      });
    }
  } catch (error: any) {
    // Report
    return Response.json(
      responseBody("Error occurred", 400, { error: error.message }),
      { status: 400 }
    );
  }
}

/**
 * @openapi
 * /api/recruiters/{id}:
 *   patch:
 *     summary: Update a recruiter's information
 *     description: Updates the information of the recruiter with the specified ID.
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
      return Response.json({ message: "Recruiter not found" }, { status: 404 });
    }

    // Update fields
    recruiter.set(updateData);

    // Update db
    const updatedRecruiter = await recruiter.save();

    // Response
    return Response.json(
      responseBody("Recruiter updated", 200, updatedRecruiter)
    );
  } catch (error: any) {
    // Notify
    return Response.json(
      responseBody("Errors occurred", 400, { error: error.message }),
      { status: 400 }
    );
  }
}
