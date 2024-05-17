import { GET } from './route';
import { models } from "@/app/models";
const { Recruiters } = models;

// import { createMocks } from 'node-mocks-http';
// import type { NextApiRequest, NextApiResponse } from 'next';

// createMocks<NextApiRequest, NextApiResponse>({
//   method: 'GET',
//   body: {
//   },
// });


//(global as any).Response = { json: jest.fn(data => { data, status: 200}) };

const mockJson = jest.fn();
const mockResponse = { json: mockJson, status: 200};
(global as any).Response = { json: jest.fn(() => mockResponse) };

// Spy on the getUserById method
const mockFindAll = jest.spyOn(Recruiters, 'findAll');

// Provide a mock implementation for getUserById
mockFindAll.mockImplementation(() => {
    return Promise.resolve([new Recruiters({
        id: 1,
        name: "Test Recruiter",
    })]);
});

afterAll(() => {
  mockFindAll.mockRestore();
})

describe('Recruiters API', () => {
  describe('GET request', () => {
    it('should retrieve school details', async () => {
      const response = await GET();
      expect(response.status).toBe(200);

      // const json = await response.json();
      // expect(json.length).toBeGreaterThan(1);
    });
    it('should invoke findAll', async () => {
      await GET();
      expect(mockFindAll).toHaveBeenCalled();
    });

  });
});
