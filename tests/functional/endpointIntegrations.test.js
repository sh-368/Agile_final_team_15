const request = require('supertest');
const app = require('../../index');

describe('Integration Smoke Tests - Endpoints', () => {

  describe('GET /', () => {
    test('returns a 200 OK response', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
    });
  });

  describe('GET /users', () => {
    test('returns a 200 OK response', async () => {
      const response = await request(app).get('/api/users');
      expect(response.status).toBe(200);
    });
  });

  describe('POST /resources', () => {
    test('returns a 200 OK response', async () => {
      const response = await request(app).post('/api/users').send({ name: 'John' });
      expect(response.status).toBe(200);
    });
  });

  // Add more endpoint tests as needed
});