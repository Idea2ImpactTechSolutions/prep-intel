
export function mockGlobalResponse() {
  // Mock the Response global object added and expected by Next.js route handlers
  (global as any).Response = {
    json:
      jest.fn().mockImplementation(function(data, init)
      {
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
          bodyUsed: true
        };
      })
  }
}
