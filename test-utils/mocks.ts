import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';

export function createMockNextRequest(body: any, query: any): NextRequest {
  return {
    method: 'PATCH',
    headers: new Headers(),
    body: Readable.from([JSON.stringify(body)]),
    json: async () => body,
    cookies: {},
    url: '',
    nextUrl: new URL('http://localhost'),
    query,
  } as unknown as NextRequest;
}

export function createMockNextResponse() {
  const headers = new Headers();
  let status = 200;
  let body: any = null;

  const res = {
    status: (code: number) => {
      status = code;
      return res;
    },
    json: (data: any) => {
      body = data;
      return res;
    },
    headers,
    statusCode: status,
    body,
  } as unknown as NextResponse;

  const getResponse = () => ({
    status,
    body,
    headers,
  });

  return { res, getResponse };
}
