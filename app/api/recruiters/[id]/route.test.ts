import { PATCH } from './route';
import { models } from "@/app/models";
import { createMockNextRequest, createMockNextResponse } from '@/test-utils/mocks';
import { NextRequest, NextResponse } from 'next/server';

const { Users, Recruiters } = models;

describe('PATCH /api/recruiters/:id', () => {
  let user, recruiter;

  beforeAll(() => {
    user = {
      id: 1,
      first_name: 'Initial',
      last_name: 'Name',
      phone: '1234567890',
      save: jest.fn().mockResolvedValue(true),
    };

    recruiter = {
      id: 1,
      user_id: user.id,
      territories: [],
      save: jest.fn().mockResolvedValue(true),
    };

    Users.findOne.mockResolvedValue(user);
    Recruiters.findOne.mockResolvedValue(recruiter);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should update user and recruiter information, ignoring the id field', async () => {
    const payload = {
      id: recruiter.id,
      first_name: 'Tony',
      last_name: 'Stark',
      phone: '4243211234',
      territories: ['CA'],
    };

    const req = createMockNextRequest(payload, { id: recruiter.id.toString() });
    const { res, getResponse } = createMockNextResponse();

    await PATCH(req as NextRequest, { params: { id: recruiter.id.toString() } });

    const response = getResponse();
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Recruiter updated');

    // Verify user fields were updated
    expect(user.first_name).toBe('Tony');
    expect(user.last_name).toBe('Stark');
    expect(user.phone).toBe('4243211234');

    // Verify recruiter fields were updated
    expect(recruiter.territories).toContain('CA');
  });

  it('should return 400 if no fields to update', async () => {
    const payload = { id: recruiter.id };

    const req = createMockNextRequest(payload, { id: recruiter.id.toString() });
    const { res, getResponse } = createMockNextResponse();

    await PATCH(req as NextRequest, { params: { id: recruiter.id.toString() } });

    const response = getResponse();
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('No fields to update');
  });

  it('should return 404 if recruiter not found', async () => {
    Recruiters.findOne.mockResolvedValueOnce(null);
    const payload = { first_name: 'Tony' };

    const req = createMockNextRequest(payload, { id: '999999' });
    const { res, getResponse } = createMockNextResponse();

    await PATCH(req as NextRequest, { params: { id: '999999' } });

    const response = getResponse();
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Recruiter not found');
  });

  it('should return 404 if user not found', async () => {
    Users.findOne.mockResolvedValueOnce(null);
    const payload = { territories: ['CA'] };

    const req = createMockNextRequest(payload, { id: recruiter.id.toString() });
    const { res, getResponse } = createMockNextResponse();

    await PATCH(req as NextRequest, { params: { id: recruiter.id.toString() } });

    const response = getResponse();
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found');
  });
});
