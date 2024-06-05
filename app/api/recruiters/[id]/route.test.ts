import { PATCH } from './route';
import { models } from "@/app/models";
import { createMockNextRequest } from '@/test-utils/mocks';
import { NextRequest } from 'next/server';

const { Users, Recruiters } = models;

describe('PATCH /api/recruiters/:id', () => {
  let user, recruiter;

  beforeAll(() => {
    user = {
      id: 1,
      first_name: 'Initial',
      last_name: 'Name',
      phone: '1234567890',
      set: jest.fn().mockResolvedValue(true),
      save: jest.fn().mockResolvedValue(true),
    };

    recruiter = {
      id: 1,
      user_id: user.id,
      territories: [],
      set: jest.fn().mockResolvedValue(true),
      save: jest.fn().mockResolvedValue(true),
    };
    Users.findOne.mockResolvedValue(user);
    Recruiters.findOne.mockResolvedValue(recruiter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update user and recruiter information, ignoring the id field', async () => {
    const payload = {
      id: recruiter.id,
      first_name: 'Tony',
      last_name: 'Stark',
      phone: '4243211234',
      territories: ['CA'],
    };


    const req = createMockNextRequest(payload, { id: recruiter.id.toString() }, 'PATCH');
    const response = await PATCH(req as unknown as NextRequest, { params: { id: recruiter.id.toString() } });
    expect(response.status).toBe(200);

    // Verify user fields were updated
    expect(user.set).toHaveBeenCalledWith({ first_name: 'Tony', last_name: 'Stark', phone: '4243211234' });
    expect(user.save).toHaveBeenCalled();

    // Verify recruiter fields were updated
    expect(recruiter.set).toHaveBeenCalledWith({ territories: ['CA'] });
    expect(recruiter.save).toHaveBeenCalled();
  });

  it('should not update models if fields are not passed', async () => {
    const payload = { id: recruiter.id };

    const req = createMockNextRequest(payload, { id: recruiter.id.toString() }, 'PATCH');
    const response = await PATCH(req as unknown as NextRequest, { params: { id: recruiter.id.toString() } });
    expect(response.status).toBe(200);

    // Verify user fields were not updated
    expect(user.set).not.toHaveBeenCalled();
    expect(user.save).not.toHaveBeenCalled();

    expect(recruiter.set).not.toHaveBeenCalled();
    expect(recruiter.save).not.toHaveBeenCalled();
  });

  it('should return 404 if recruiter not found', async () => {
    (Recruiters.findOne as jest.Mock).mockResolvedValueOnce(null);
    const payload = { first_name: 'Tony' };

    const req = createMockNextRequest(payload, { id: recruiter.id.toString() }, 'PATCH');
    const response = await PATCH(req as unknown as NextRequest, { params: { id: '999999'  } });
  
    expect(response.status).toBe(404);
    expect(user.set).not.toHaveBeenCalled();
    expect(user.save).not.toHaveBeenCalled();

    expect(recruiter.set).not.toHaveBeenCalled();
    expect(recruiter.save).not.toHaveBeenCalled();
  });

  it('should return 404 if user not found', async () => {
    (Users.findOne as jest.Mock).mockResolvedValueOnce(null);
    const payload = { territories: ['CA'] };

    const req = createMockNextRequest(payload, { id: recruiter.id.toString() }, 'PATCH');
    const response = await PATCH(req as unknown as NextRequest, { params: { id: recruiter.id.toString() } });


    expect(recruiter.set).not.toHaveBeenCalled();
    expect(recruiter.save).not.toHaveBeenCalled()
    expect(response.status).toBe(404);
  });
});
