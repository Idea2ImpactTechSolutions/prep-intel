import { models } from "app/models";
const { Users } = models;
import { apiResponse } from "app/config/helpers";
const { Op } = require("sequelize");
import logger from 'lib/logger';

/**
 * @openapi
 * /api/admin/accounts:
 *   get:
 *     summary: Search for user accounts
 *     description: Returns a list of accounts that match the search query.
 *     tags:
 *       - admin
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: The search query to filter accounts by email.
 *         required: true
 *     responses:
 *       200:
 *         description: A list of accounts.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.search);
    const searchTerm = searchParams.get("q"); // Get the value of the 'search' query parameter

    // Collect
  const accounts = await Users.findAll({
      limit: 10,
      attributes: ["id", "email", "is_active"],
      where: {
        email: {
          [Op.iLike]: `%${searchTerm}%`
        }
      }
    });

    // Respond
    return apiResponse("Accounts", 200, accounts)
  } catch (error: any) {
    logger.error(error);

    // Report
    return apiResponse("Internal Server Error", 500, {error: error.message});
  }
}


export async function PATCH(req: Request) {
  try {
    const { id, email, is_active } = await req.json();

    // Collect
    const user = await Users.findOne({
        where: {
          id,
          email,
        }
      });

    await user.update({
      is_active,
    });
    // Respond
    return apiResponse("Account", 200)
  } catch (error: any) {
    logger.error(error);

    // Report
    return apiResponse("Internal Server Error", 500, {error: error.message});
  }
}
