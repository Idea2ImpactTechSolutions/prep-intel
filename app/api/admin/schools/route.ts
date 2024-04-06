import { models } from "app/models";
const { School } = models;
import { responseBody } from "app/config/helpers";
const { Op } = require("sequelize");
import logger from 'lib/logger';

/**
 * @openapi
 * /api/admin/schools:
 *   get:
 *     summary: Search for schools
 *     description: Returns a list of schools that match the search query.
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: The search query to filter schools by name.
 *         required: false
 *     responses:
 *       200:
 *         description: A list of schools.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "schools data returned successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       name:
 *                         type: string
 *                       is_active:
 *                         type: boolean
 *                       publish_date:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 500
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.search);
    const searchTerm = searchParams.get("q"); // Get the value of the 'search' query parameter

    // Collect
    let schools;
    if (searchTerm) {
      schools = await School.findAll({
        limit: 10,
        attributes: ["id", "name", "is_active", "publish_date"],
        where: {
          name: {
            [Op.iLike]: `%${searchTerm}%`
          }
        }

        // Pending integration with IPEDS data and school alias field
        // where: {
        //   [Op.or]: [
        //     {
        //       name: {
        //         [Op.like]: `%${searchTerm}%`,
        //       },
        //     },
        //     {
        //       alias: {
        //         [Op.like]: `%${searchTerm}%`,
        //       },
        //     },
        //   ],
        // },
      });
    } else {
      schools = await School.findAll({
        attributes: ["id", "name", "is_active", "publish_date"],
      });
    }

    // Respond
    return Response.json(
      responseBody("schools data returned successfully", 200, schools)
    );
  } catch (error: any) {
    logger.error(error);
    
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
