import { models } from "../../../../app/models";
const { HD2021 } = models;
const { Op } = require("sequelize");

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const states = req.query.states.split(",");

      let schoolDetails = await HD2021.findAll({
        where: {
          stabbr: {
            [Op.in]: states,
          },
        },
      });
      // Respond with the school details or null if no school_id is provided
      res.status(200).json(schoolDetails);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
