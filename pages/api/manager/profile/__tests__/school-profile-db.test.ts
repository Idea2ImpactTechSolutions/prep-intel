import handler from '../school-profile';
import { createMocks } from 'node-mocks-http';
import { createSampleSchool, deleteSampleSchool } from '../../../../../utils/helpers/schoolUtil';

import type { NextApiRequest, NextApiResponse } from 'next';
const sequelize = require("../../../../../app/models/sequelize");


afterAll(() => {
  // Close down sequelize connection pool allowing jest to exit gracefully
  sequelize.close();
});

describe('School Profile API', () => {
  let schoolId : number;
  describe('GET request', () => {
    beforeEach(async () => {
    schoolId = await createSampleSchool();
    });
    afterEach(async () => {
      await deleteSampleSchool(schoolId);
      });
    it('should retrieve school details', async () => {
      // Setup
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'GET',
        query: {
          school_id: schoolId,
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
