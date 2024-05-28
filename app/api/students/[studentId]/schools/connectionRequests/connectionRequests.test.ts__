import { PATCH } from './route';
import { models } from "@/app/models";
const { ConnectionRequest } = models;
import { NextRequest } from "next/server";

const req = {
  method: 'PATCH',
  json: async () => ({
    connectionReqId: 2,
    connection_accepted: true
  }),
} as NextRequest;

const mockJson = jest.fn();
const mockResponse = { json: mockJson, status: 200};
(global as any).Response = { json: jest.fn(() => mockResponse) };

// Spy on the getUserById method
const mockGetConnectionRequest = jest.spyOn(ConnectionRequest, 'findOne');

// Provide a mock implementation for getUserById
mockGetConnectionRequest.mockImplementation(() => {
    return Promise.resolve(new ConnectionRequest({
        id: 9,
        school_id: 1,
        student_id: 2,
        recruiter_id: 3,
        create_date: new Date(),
        connection_accepted: false,
        response_date: new Date(),
    }));
});

afterAll(() => {
  mockGetConnectionRequest.mockRestore();
})

describe('Connection Request API', () => {
  describe('PATCH request', () => {
    it('Accept a connection request', async () => {
      const response = await PATCH(req, {params: {studentId:1}});
      expect(response.status).toBe(200);
    });
    it('should invoke findOne', async () => {
      await PATCH(req, {params: {studentId:1}});
      expect(mockGetConnectionRequest).toHaveBeenCalled();
    });
  });
});
