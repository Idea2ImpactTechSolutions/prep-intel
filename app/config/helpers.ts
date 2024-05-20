import { NextApiRequest } from "next";
import { v4 as uuid } from "uuid";

export const responseBody = (message: string, code: number, data: any = null) => {
  return {
    status: code,
    message,
    data,
  };
};

export function getAuthCode() {
 const currentDate = new Date();
 const minutes = 60; // Expiration offset

 return {
  expiresAt: new Date(currentDate.getTime() + minutes * 60 * 1000),
  authCode: uuid()
 }
}

export function getBaseUrl(req: NextApiRequest) {
  const host = req.headers.host;
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${host}`;
}

// Implements a convention based apiResponse with a message, status, and data object
export function apiResponse(
  message: string,
  status: number,
  data: object = {} // TODO: determine if null or empty is preferred
) {
  return Response.json(
    { status, message, data },
    {
      status,
    }
  );
}

export function cacheBust(url) {
  if (!url) {
    return '';
  }
  return  `${url}?v=${(new Date()).getTime()}`;
}
