process.env.PORT = 4006;

const request = require('supertest');
const app = require('../src/index');

let server;

beforeAll(() => {
  server = app.listen(process.env.PORT);
});

afterAll(() => {
  server.close();
});

describe('Chamados Routes', () => {
  it('should list all chamados', async () => {
    const response = await request(app).get('/chamados');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should create a new chamado', async () => {
    const response = await request(app)
      .post('/chamados')
      .send({
        idTab: 1,
        problema: 'Problema de teste',
        item: 'Carregador'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('idChamado');
  });
});