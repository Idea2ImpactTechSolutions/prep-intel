import { PATCH } from './route';
import { models } from "@/app/models";
const { ConnectionRequest, Students } = models;
import { NextRequest } from "next/server";

const req = {
  method: 'PATCH',
  json: async () => ({
    connectionReqId: 2,
    connection_accepted: true
  }),
} as NextRequest;

(global as any).Response = {
  json(obj, options) {
    const { status } = options;
    return {
      status,
      json: JSON.stringify(obj),
    }
  }
};

const { connectionRequestFindOne, studentsFindOne } = setupFullMocks();

afterAll(() => {
  connectionRequestFindOne?.mockRestore();
  studentsFindOne?.mockRestore();
})

describe('Connection Request API', () => {
  describe('PATCH request', () => {
    it('returns 204 on success', async () => {
      const response = await PATCH(req, {params: {studentId:1}});
      expect(response.status).toBe(204);
    });
    it('invokes expected methods', async () => {
      await PATCH(req, {params: {studentId:1}});
      expect(studentsFindOne).toHaveBeenCalled();
      expect(connectionRequestFindOne).toHaveBeenCalled();
    });
    it('returns 404 on non-existing studentId', async () => {
      // Mock non-existing student id in the database
      jest.spyOn(Students, 'findOne').mockResolvedValue(null);

      const response = await PATCH(req, {params: {studentId: -1}});
      expect(response.status).toBe(404);
    });
  });
});

function setupFullMocks() {
  const studentsFindOne = jest.spyOn(Students, 'findOne');
  studentsFindOne.mockResolvedValue({
    id: 1,
    role: 'student',
  });

  const request = new ConnectionRequest({
    id: 9,
    school_id: 1,
    student_id: 2,
    recruiter_id: 3,
    create_date: new Date(),
    connection_accepted: false,
    response_date: new Date(),
  });

  request.update = jest.fn().mockResolvedValue({});

  // Mock the ConnectionRequest.findOne method
  const connectionRequestFindOne = jest.spyOn(ConnectionRequest, 'findOne');
  connectionRequestFindOne.mockResolvedValue(request);

  jest.spyOn(ConnectionRequest, 'afterUpdate');

  return {
    connectionRequestFindOne,
    studentsFindOne,
  };
}

