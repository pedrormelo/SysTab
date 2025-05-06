process.env.PORT = 4002;

const request = require('supertest');
const app = require('../src/index');

let server;

beforeAll(() => {
  server = app.listen(process.env.PORT);
});

afterAll(() => {
  server.close();
});

describe('Unidades Routes', () => {
  it('should list all unidades', async () => {
    const response = await request(app).get('/unidades');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});