import handler from '../school-profile';
import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';
const sequelize = require("../../../../../app/models/sequelize");

afterAll(() => {
  // Close down sequelize connection pool allowing jest to exit gracefully
  sequelize.close();
});

describe('School Profile API', () => {
  describe('GET request', () => {
    it('should retrieve school details', async () => {
      // Setup
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'GET',
        query: {
          school_id: "2e0f768e-c887-4945-8cd7-96f96a07a3eb",
        },
      });

      // Test
      await handler(req, res);

      // Assert
      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          message: 'School retrieved successfully',
        }),
      );
    }, 15000);
  });
});
