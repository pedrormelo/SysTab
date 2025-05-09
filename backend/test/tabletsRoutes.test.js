process.env.PORT = 4003;

const request = require('supertest');
const app = require('../src/index');

let server;

beforeAll(() => {
  server = app.listen(process.env.PORT);
});

afterAll(() => {
  server.close();
});

describe('Tablets Routes', () => {
  it('should list all tablets', async () => {
    const response = await request(app).get('/tablets');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should create a new tablet', async () => {
    const response = await request(app)
      .post('/tablets')
      .send({
        idTomb: '12345',
        imei: '123456789012345',
        idUser: 1,
        idUnidade: 1,
        idEmp: 1
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('idTablet');
  });
});