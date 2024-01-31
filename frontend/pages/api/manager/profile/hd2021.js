// pages/api/manager/profile/academic-info.js
const { models } = require("../../../../app/models");
const { HD2021 } = models;
const { v4 } = require("uuid");

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {

      const { stateID } = req.query;

      let schoolDetails = await HD2021.findAll({
        where: {
            STABBR: stateID
        }
      });
      // Respond with the school details or null if no school_id is provided
      res.status(200).json(schoolDetails);
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
