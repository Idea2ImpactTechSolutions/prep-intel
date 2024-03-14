import { NextApiRequest, NextApiResponse } from "next";

export default async function Handler(req: NextApiRequest,res: NextApiResponse) {
  res.status(200).json(process.env.NEXTAUTH_URL);
}
