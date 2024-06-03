import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';

export function createMockNextRequest(body: any, query: any, method: string = 'PATCH'): NextRequest {
  return {
    method,
    headers: new Headers(),
    body: Readable.from([JSON.stringify(body)]),
    json: async () => body,
    cookies: new Map(),
    url: '',
    nextUrl: new URL('http://localhost'),
    query,
  } as unknown as NextRequest;
}

//Would like to implement createMockNextResponse. Leaving as a starting point


// export function createMockNextResponse() {
//   const headers = new Headers();
//   let statusCode = 200;
//   let responseBody: any = null;

//   const res = {
//     status: (code: number) => {
//       statusCode = code;
//       return res;
//     },
//     json: (data: any) => {
//       responseBody = data;
//       return res;
//     },
//     headers,
//   } as unknown as NextResponse;

//   const getResponse = () => ({
//     status: statusCode,
//     body: responseBody,
//     headers,
//   });

//   return { res, getResponse };
// }
