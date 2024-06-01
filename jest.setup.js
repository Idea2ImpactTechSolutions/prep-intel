// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Workaround for TextEncoder issue in jsdom 16 - https://stackoverflow.com/a/68468204/84369
import { TextEncoder as encoder, TextDecoder as decoder } from 'util';
Object.assign(global, { TextDecoder: decoder, TextEncoder: encoder});


// Mock the Response global object added and expected by Next.js route handlers
global.Response = {
  json: jest.fn().mockImplementation(function (data, init) {
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

// Dynamic mock setup for models
jest.mock('@/app/models', () => {
  const models = jest.requireActual('@/app/models');

  return {
    ...models,
    Users: {
      ...models.Users,
      findByPk: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      getAttributes: jest.fn().mockReturnValue({
        id: 'id',
        first_name: 'first_name',
        last_name: 'last_name',
        phone: 'phone',
        email: 'email',
      }),
    },
    Recruiters: {
      ...models.Recruiters,
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      getAttributes: jest.fn().mockReturnValue({
        id: 'id',
        user_id: 'user_id',
        territories: 'territories',
      }),
    },
  };
});