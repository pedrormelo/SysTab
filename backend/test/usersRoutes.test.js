process.env.PORT = 4001;

const request = require('supertest');
const app = require('../src/index'); // Assuming this is where your Express app is initialized

jest.mock('../src/config/db', () => ({
  query: jest.fn((query, values, callback) => {
    callback(null, []); // Mock empty result set
  }),
}));

let server;

console.log('Starting server for usersRoutes tests...');

const findAvailablePort = async () => {
  const net = require('net');
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on('error', reject);
  });
};

beforeAll(async () => {
  const port = await findAvailablePort();
  process.env.PORT = port;
  server = app.listen(port, () => {
    console.log(`Test server running on port ${port}`);
  });
});

afterAll(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
    console.log('Test server closed.');
  }
});

describe('Basic Test', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  });
});