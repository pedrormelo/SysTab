process.env.PORT = 4005;

const request = require('supertest');
const app = require('../src/index');

let server;

beforeAll(() => {
  server = app.listen(process.env.PORT);
});

afterAll(() => {
  server.close();
});

describe('Empresas Routes', () => {
  it('should list all empresas', async () => {
    const response = await request(app).get('/empresas');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should create a new empresa', async () => {
    const response = await request(app)
      .post('/empresas')
      .send({
        nome: 'Nova Empresa'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('idEmpresa');
  });
});