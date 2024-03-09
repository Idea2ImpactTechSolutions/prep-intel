import supertest from 'supertest';
import handler from '../school-profile';
import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';

describe('School Profile API', () => {
  describe('GET request', () => {
    it('should retrieve school details', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'GET',
        query: {
          school_id: '1',
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          message: 'School retrieved successfully',
          // Add more expectations here
        }),
      );
    });
  });

  describe('POST request', () => {
    it('should create or update school details', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'POST',
        body: {
          // Your request body here
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(201);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          message: 'Manager account claimed successfully',
          // Add more expectations here
        }),
      );
    });

    // Include more tests to cover other scenarios, such as invalid input or server errors
  });
});
