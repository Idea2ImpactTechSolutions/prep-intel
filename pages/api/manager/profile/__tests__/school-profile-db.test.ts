import handler from '../school-profile';
import { models } from "@/app/models";
const { School } = models; 

import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';

describe('School Profile API', () => {
  describe('GET request', () => {
    it('should retrieve school details', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'GET',
        query: {
          school_id: "2e0f768e-c887-4945-8cd7-96f96a07a3eb",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          message: 'School retrieved successfully',
        }),
      );
    });
  });
});
