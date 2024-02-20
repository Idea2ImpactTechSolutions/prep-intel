import { NextRequest } from "next/server";
import { signJwtAccessToken } from "../../../lib/jwt";
import bcrypt from "bcryptjs";
const { models } = require("../../../app/models");
const { School, Recruiters } = models;

interface RequestBody {
  username: string;
  password: string;
}
export async function POST(request: any) {
  const { email, password } = request.body;

  console.log(email, password);

  const user = await Recruiters.findOne({
    where: {
      email: email,
    },
  });

  if (user && (await bcrypt.compare(password, user.password))) {
    const { password, ...userWithoutPass } = user;
    const accessToken = signJwtAccessToken(userWithoutPass);

    const result = {
      ...userWithoutPass,
      accessToken,
    };
    return new Response(JSON.stringify(result));
  } else
    return new Response(
      JSON.stringify({
        message: "Unathenticated",
      }),
      {
        status: 401,
      }
    );
}
