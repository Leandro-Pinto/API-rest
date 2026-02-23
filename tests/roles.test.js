const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/userModel');

describe('Validación de roles y acceso a rutas protegidas', () => {
  let adminToken;
  let userToken;
  let userId;

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

  const crearUsuariosYTokens = async () => {
    const adminRes = await request(app).post('/api/auth/register').send({
      nombre: 'Admin',
      email: 'admin@example.com',
      password: 'password123',
      rol: 'admin',
    });

    const userRes = await request(app).post('/api/auth/register').send({
      nombre: 'User',
      email: 'user@example.com',
      password: 'password123',
      rol: 'user',
    });

    adminToken = adminRes.body.token;
    userToken = userRes.body.token;
    userId = userRes.body.usuario.id;
  };

  test('Un usuario admin puede listar usuarios', async () => {
    await crearUsuariosYTokens();

    const res = await request(app).get('/api/users').set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('Un usuario con rol user no puede listar usuarios', async () => {
    await crearUsuariosYTokens();

    const res = await request(app).get('/api/users').set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });

  test('Un usuario puede obtener su propio perfil', async () => {
    await crearUsuariosYTokens();

    const res = await request(app).get(`/api/users/${userId}`).set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('email', 'user@example.com');
  });

  test('Un usuario no puede eliminar otro usuario (solo admin)', async () => {
    await crearUsuariosYTokens();

    const res = await request(app).delete(`/api/users/${userId}`).set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });
});

