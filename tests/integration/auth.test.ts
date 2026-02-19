import request from 'supertest';
import app from '../../src/app';
import { connectDatabase } from '../../src/config/database';
import { User } from '../../src/models';

describe('Auth Integration Tests', () => {
    beforeAll(async () => {
        await connectDatabase();
    });

    afterAll(async () => {
        await User.destroy({ where: {}, force: true });
    });

    describe('POST /api/v1/auth/register', () => {
        it('should register a new user successfully', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'Test1234',
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.user).toHaveProperty('id');
            expect(response.body.data.user.email).toBe('test@example.com');
            expect(response.body.data.user.username).toBe('testuser');
            expect(response.body.data).toHaveProperty('accessToken');
            expect(response.body.data).toHaveProperty('refreshToken');
        });

        it('should fail with duplicate email', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    username: 'testuser2',
                    email: 'test@example.com',
                    password: 'Test1234',
                });

            expect(response.status).toBe(409);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('Email already registered');
        });

        it('should fail with invalid password', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    username: 'testuser3',
                    email: 'test3@example.com',
                    password: 'weak',
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });

        it('should fail with invalid email', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    username: 'testuser4',
                    email: 'invalid-email',
                    password: 'Test1234',
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });

    describe('POST /api/v1/auth/login', () => {
        it('should login successfully with correct credentials', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'Test1234',
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.user.email).toBe('test@example.com');
            expect(response.body.data).toHaveProperty('accessToken');
            expect(response.body.data).toHaveProperty('refreshToken');
        });

        it('should fail with incorrect password', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'WrongPassword123',
                });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });

        it('should fail with non-existent email', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'Test1234',
                });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });
    });

    describe('GET /api/v1/auth/me', () => {
        let accessToken: string;

        beforeAll(async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'Test1234',
                });

            accessToken = response.body.data.accessToken;
        });

        it('should return user profile with valid token', async () => {
            const response = await request(app)
                .get('/api/v1/auth/me')
                .set('Authorization', `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.email).toBe('test@example.com');
            expect(response.body.data).not.toHaveProperty('passwordHash');
        });

        it('should fail without token', async () => {
            const response = await request(app).get('/api/v1/auth/me');

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });

        it('should fail with invalid token', async () => {
            const response = await request(app)
                .get('/api/v1/auth/me')
                .set('Authorization', 'Bearer invalid-token');

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });
    });

    describe('POST /api/v1/auth/refresh', () => {
        let refreshToken: string;

        beforeAll(async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'Test1234',
                });

            refreshToken = response.body.data.refreshToken;
        });

        it('should refresh tokens successfully', async () => {
            const response = await request(app)
                .post('/api/v1/auth/refresh')
                .send({ refreshToken });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('accessToken');
            expect(response.body.data).toHaveProperty('refreshToken');
        });

        it('should fail with invalid refresh token', async () => {
            const response = await request(app)
                .post('/api/v1/auth/refresh')
                .send({ refreshToken: 'invalid-token' });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });
    });

    describe('POST /api/v1/auth/logout', () => {
        let accessToken: string;

        beforeAll(async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'Test1234',
                });

            accessToken = response.body.data.accessToken;
        });

        it('should logout successfully', async () => {
            const response = await request(app)
                .post('/api/v1/auth/logout')
                .set('Authorization', `Bearer ${accessToken}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        it('should fail without token', async () => {
            const response = await request(app).post('/api/v1/auth/logout');

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });
    });
});
