import { GET } from './route';
import { models } from "@/app/models";
const { Recruiters } = models;


 // Mock the Response global object
 const mockResponse = {
  json: jest.fn().mockImplementation(function(data, init){

    if (!init) {
      init = { status: 200 };
    }

    return {
      body: JSON.stringify(data),
      headers: { 'content-type': 'application/json' },
      status: init.status,
      statusText: '',
      type: 'default',
      url: '',
      ok: init.status >= 200 && init.status < 300,
      redirected: false,
      bodyUsed: true,
    };
 }),
};
(global as any).Response = mockResponse;

//const request = new Request('http://localhost/api');

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
    });
    it('should invoke findAll', async () => {
      await GET();
      expect(mockFindAll).toHaveBeenCalled();
    });

  });
});
