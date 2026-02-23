const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/userModel');

describe('Módulo de Autenticación', () => {
  beforeAll(async () => {
    const uri = process.env.MONGODB_URI_TEST || 'mongodb://127.0.0.1:27017/api_auth_roles_test';
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  test('Registro de usuario crea un nuevo usuario y devuelve token', async () => {
    const res = await request(app).post('/api/auth/register').send({
      nombre: 'Usuario Test',
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('usuario');
    expect(res.body.usuario).toHaveProperty('email', 'test@example.com');
  });

  test('Login con credenciales correctas devuelve token', async () => {
    await request(app).post('/api/auth/register').send({
      nombre: 'Usuario Test',
      email: 'login@example.com',
      password: 'password123',
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'login@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('Login con credenciales inválidas devuelve 401', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'noexiste@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(401);
  });
});

