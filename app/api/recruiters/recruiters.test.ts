import { mockGlobalResponse } from "@/lib/test-helpers"
import { GET } from './route';
import { models } from "@/app/models";
const { Recruiters } = models;

mockGlobalResponse();

// Spy on the getUserById method
const mockFindAll = jest.spyOn(Recruiters, 'findAll');

// Provide a mock implementation for getUserById
mockFindAll.mockImplementation(() => {
    return Promise.resolve([
      new Recruiters({
        id: 1,
        school_id: 2,
        user_id: 3,
        territories: ["CA", "NY", "TX"]
      }),
      new Recruiters({
        id: 2,
        school_id: 2,
        user_id: 4,
        territories: ["AZ"]
      }),
    ]);
});

afterAll(() => {
  mockFindAll.mockRestore();
})

describe('Recruiters API', () => {
  describe('GET request', () => {
    it('should set success code', async () => {
      const response = await GET();
      expect(response.status).toBe(200);
    });

    it('should retrieve/return school details', async () => {
      const response:any = await GET();

      // Expect array body of non-zero length
      const jsonBody = JSON.parse(response.body);
      expect(jsonBody.length).toBe(2);
    });

    it('should invoke findAll', async () => {
      await GET();
      expect(mockFindAll).toHaveBeenCalled();
    });
  });
});
