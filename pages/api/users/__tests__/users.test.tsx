import handler from '../set-password';
import bcrypt from "bcryptjs";
import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';
const sequelize = require("../../../../app/models/sequelize");
import models from "../../../../app/models";

const { Users } = models.models;

const AUTH_CODE = '546a5374-ed66-4371-940f-8f17fe4d452b';
const PASSWORD = 'password';
const BAD_AUTH_CODE = 'no-user-has-this-auth-code';
const MISMATCHED_PASSWORD = 'differentPassword';

// Spy on calls to various methods
const userFindOneSpy = jest.spyOn(Users, 'findOne');
const userUpdateSpy = jest.spyOn(Users, 'update');
const bcryptSpy = jest.spyOn(bcrypt, 'hashSync');


describe('Set Password API', () => {
  let userId : number;
  afterAll(() => {
    // Close down sequelize connection pool allowing jest to exit gracefully
    sequelize.close();
  });
  describe('POST requests', () => {
    afterEach(async () => {
      jest.clearAllMocks();
     
    });
    it('Sets the user password', async () => {
      // Setup
      Users.findOne.mockResolvedValue({
        id: 1,
        auth_code: AUTH_CODE,
        update: jest.fn().mockResolvedValue({ /* simulated response */ })
      });
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'POST',
        body: {
            auth_code : AUTH_CODE,
            password: PASSWORD,
            confirm_password: PASSWORD
        },
      });

      // Test
      await handler(req, res);

      // Assert
      expect(userFindOneSpy).toHaveBeenCalledWith({"where": {"auth_code": AUTH_CODE}});
      expect(bcryptSpy).toHaveBeenCalledWith(PASSWORD);
      expect(userUpdateSpy).toHaveBeenCalled();
      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          message: 'Password successfully updated',
        }),
      );
    },15000);
    it('Mismatching passwords are provided', async () => {
      Users.findOne.mockResolvedValue({
        id: 1,
        auth_code: AUTH_CODE,
        update: jest.fn().mockResolvedValue({ /* simulated response */ })
      });
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'POST',
        body: {
          auth_code: AUTH_CODE,
          password: PASSWORD,
          confirm_password: MISMATCHED_PASSWORD
        },
      });
  
      // Test
      await handler(req, res);
  
        // Assert
        expect(res._getStatusCode()).toBe(400);
        expect(userUpdateSpy).not.toHaveBeenCalled();
    },15000);
    it('An invalid auth_code is provided', async () => {

      Users.findOne.mockResolvedValue(null);

      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'POST',
        body: {
          auth_code: BAD_AUTH_CODE,
          password: PASSWORD,
          confirm_password: PASSWORD
        }
      });
      await handler(req, res);
      expect(userFindOneSpy).toHaveBeenCalledWith({"where": {"auth_code": BAD_AUTH_CODE}});
      expect(userUpdateSpy).not.toHaveBeenCalled();
      expect(res._getStatusCode()).toBe(404);
    },15000);
  });
});
