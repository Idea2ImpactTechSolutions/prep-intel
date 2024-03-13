import handler from '../school-profile';
import { models } from "@/app/models";
const { School } = models;

import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';

// Spy on the getUserById method
const getSchoolSpy = jest.spyOn(School, 'findByPk');

// Provide a mock implementation for getUserById
getSchoolSpy.mockImplementation((id) => {
    return Promise.resolve(new School({
        id: 1,
        name: "Test School",
        data: 'Mocked Data',
    }));
});

afterAll(() => {
  getSchoolSpy.mockRestore();
})

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
        }),
      );
    });
  });
});
