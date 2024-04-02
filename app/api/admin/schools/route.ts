import { models } from "app/models";
const { School } = models;
import { responseBody } from "app/config/helpers";

/**
 * @openapi
 * /api/admin/schools:
 *   get:
 *       responses:
 *           '200':
 *               content:
 *                    application/json:
 *                       schema:
 *                           type: array
 *                           items: {}
 *       summary: Returns a list of schools
 */
export async function GET() {
  try {
    // Collect
    let schools = await School.findAll({
      attributes: ["id", "name", "is_active", "publish_date"],
    });

    // Respond
    return Response.json(responseBody(
      "schools data returned successfully",
      200,
      schools));
  } catch (error: any) {
    // Report
    return Response.json(
      {
        status: 500,
        error: error.message, //error: 'Internal Server Error'
      },
      { status: 500 }
    );
  }
}
