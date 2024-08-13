import { v4 as uuid } from "uuid";
import moment from 'moment-timezone';

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

export function dateWithLocalOffset(dateString: string) {
  // Convert the given date string, ala "2021-09-01", to a  local date object with a fixed/local offset applied
  return dateString ? moment(dateString).tz('America/Los_Angeles').toDate() : ""
}

export function getBaseUrl(): string {
  return process.env.NEXTAUTH_URL as string;
}

// Implements a convention based apiResponse with a message, status, and data object
export function apiResponse(
  message: string,
  status: number,
  data: object = {} // TODO: determine if null or empty is preferred
) {

  if (status === 204) {
    return new Response(null, { status});
  }

  return Response.json(
    { status, message, data },
    {
      status,
    }
  );
}

export function buildAssetUrl(assetID) {
  return `/api/assets/${assetID}`;
}

export function cacheBust(url) {
  if (!url) {
    return '';
  }

  return `${url}?v=${(new Date()).getTime()}`;
}

export function formatPhoneNumber(phoneNumber) {

  if (!phoneNumber) return "";

  // Ensure the input is a string
  phoneNumber = phoneNumber.toString();

  // Remove any non-numeric characters
  phoneNumber = phoneNumber.replace(/\D/g, '');

  // Check if the phone number has 10 digits
  if (phoneNumber.length === 10) {
      // Format the phone number
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
  } else if (phoneNumber.length === 7) {
      // Format the phone number
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
  }

  // Opt-out if the phone number is not the expected length
  return phoneNumber;
}

