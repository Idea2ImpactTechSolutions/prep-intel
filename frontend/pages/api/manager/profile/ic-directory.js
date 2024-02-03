const { models } = require("../../../../app/models");
const { ICDirectory } = models;

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {

      const { stateID } = req.query;

      let schoolDetails = await ICDirectory.findAll({
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
