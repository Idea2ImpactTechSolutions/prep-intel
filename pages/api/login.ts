import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export default function AuthHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "POST") {
      const { email, password } = req.body;
      console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");

      // simple auth
      // if (users.includes(email) && password === "dbpass") {

      const role = email.split("@")[0];

      const token = jwt.sign(
        {
          userId: "user_ex",
          email,
          role,
          schoolID: "b14e03a9-656a-4726-9d38-6f09c912a543",
        },
        process.env.TOKEN_SECRET as string,
        {
          expiresIn: 3000, //50 minutes
        }
      );

      res.status(200).json({ token, role });
      return;
      // } else {
      //   res.status(401).json({ error: true, message: 'Auth Failed' });
      //   return;
      // }
    } else {
      // Handle any other HTTP method
      res.statusCode = 401;
      res.end();
    }
  } catch (error) {
    res.status(500).json({ error: "Something went wrong." });
  }
}
