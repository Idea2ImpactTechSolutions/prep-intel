import handler from '../set-password';
import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';
const sequelize = require("../../../../app/models/sequelize");
import { models } from "@/app/models";
const { Users } = models;
let updateCalled = false;

// Spy on the getUserById method
const getUserFindOneSpy = jest.spyOn(Users, 'findOne');
const getUserUpdateSpy = jest.spyOn(Users, 'update');

// Provide a mock implementation for getUserById

getUserFindOneSpy.mockImplementation((id) => {
    return Promise.resolve(new Users({
        id,
        auth_code: "546a5374-ed66-4371-940f-8f17fe4d452b"
    }));
});

getUserUpdateSpy.mockImplementation(() => {
    updateCalled = true;
});
afterEach(() =>{
    updateCalled = false;
})
afterAll(() => {

  // Close down sequelize connection pool allowing jest to exit gracefully
  sequelize.close();
});

describe('Set Password API', () => {
  describe('POST request', () => {
    it('should set user password', async () => {
      // Setup

      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'POST',
        body: {
            auth_code : '546a5374-ed66-4371-940f-8f17fe4d452b',
            password:'password',
            confirm_password  : 'password'
        },
      });

      // Test
      await handler(req, res);

      // Assert
      expect(res._getStatusCode()).toBe(200);
      expect(updateCalled).toBe(true);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          message: 'Password successfully updated',
        }),
      );
    }, 15000);
    it('Testing mismatch password', async () => {
  
        const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
          method: 'POST',
          body: {
              auth_code : '546a5374-ed66-4371-940f-8f17fe4d452b',
              password:'password',
              confirm_password  : 'differntPassword'
          },
        });
  
        // Test
        await handler(req, res);
  
        // Assert
        expect(res._getStatusCode()).toBe(400);
        expect(updateCalled).toBe(false);
      }, 15000);
  });
});
