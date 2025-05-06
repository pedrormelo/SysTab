process.env.PORT = 4004;

const request = require('supertest');
const app = require('../src/index');

let server;

beforeAll(() => {
  server = app.listen(process.env.PORT);
});

afterAll(() => {
  server.close();
});

describe('Regionais Routes', () => {
  it('should list all regionais', async () => {
    const response = await request(app).get('/regionais');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});