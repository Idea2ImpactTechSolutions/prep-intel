import { models } from "app/models";
const { School, SchoolAddress } = models;
import { Op } from "sequelize";
import { responseBody } from "app/config/helpers";
import { type NextRequest } from "next/server";
import logger from "lib/logger";

/**
 * @openapi
 * /api/schools/:
 *   get:
 *     summary: Retrieve schools based on state parameters
 *     description: Returns a paginated list of schools filtered by the states provided as a comma-separated list in the query parameter 'states'.
 *     tags:
 *       - school
 *     parameters:
 *       - in: query
 *         name: states
 *         required: true
 *         description: Comma-separated list of state abbreviations to filter schools by.
 *         schema:
 *           type: string
 *           example: "CA,NY,FL"
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number of the results to fetch.
 *         schema:
 *           type: integer
 *           default: 1
 *           example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Number of results to return per page.
 *         schema:
 *           type: integer
 *           default: 10
 *           example: 10
 *     responses:
 *       200:
 *         description: A paginated list of schools successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/School'
 *             example:
 *               message: "Recruits successfully retrieved"
 *               status: 200
 *               data:
 *                 - id: 1
 *                   name: "Sunshine High School"
 *                   school_address:
 *                     state: "CA"
 *       400:
 *         description: An error occurred during the retrieval process.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: integer
 *                 error:
 *                   type: string
 *             example:
 *               message: "Error occurred"
 *               status: 400
 *               error: "Detailed error message"
 */
export async function GET(req: NextRequest) {
    try {
      const searchParams = req.nextUrl.searchParams;
      const searchTerm = searchParams.get("searchTerm");

      const stateString = searchParams.get("states");
      const states = stateString?.split(",");

      // Pagination parameters
      const page = parseInt(searchParams.get("page") || "1", 10);
      const limit = parseInt(searchParams.get("pageSize") || "10", 10);
      const offset = (page - 1) * limit;

      // Fetching data and count
   
      const result = await getSchoolsInStates(states, searchTerm, { limit, offset });
      const totalItems = result.count;
      const totalPages = Math.ceil(totalItems / limit);

      return Response.json(
        responseBody(
          "Recruits successfully retrieved",
          200,
          {
            schools: result.rows,
            totalItems,
            totalPages,
            currentPage: page,
            pageSize: limit
          }
        )
      );
    } catch (error:any) {
      logger.error(error.message);
      return Response.json(
        responseBody("Error occurred", 400, { error: error.message }),
        { status: 400 }
      );
    }
  }

function getSchoolsInStates(states, searchTerm, { limit, offset }) {
  const whereConditions = searchTerm ? { name: { [Op.iLike]: `%${searchTerm}%` } } : {};


  return School.findAndCountAll({
    attributes: ["id", "name"],
    include: [
      {
        model: SchoolAddress,
        as: "school_address",
        attributes: ["state"],
        where: { state: { [Op.in]: states } },
      },
    ],
    where: whereConditions,
    limit,
    offset,
  });
}
