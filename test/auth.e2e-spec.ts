import { INestApplication } from '@nestjs/common';
import { PasswordHasher } from '@nestjs/authentication';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;
  const credentials = { email: 'a@example.com', password: 'password123' };

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PasswordHasher)
      .useValue(new PasswordHasher({ logN: 10 }))
      .compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  const signup = () =>
    request(app.getHttpServer())
      .post('/auth/signup')
      .send({ ...credentials, name: '홍길동' })
      .expect(201);

  describe('POST /auth/signup', () => {
    it('가입하면 사용자 정보만 돌려주고 토큰은 주지 않는다', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: ' A@Example.com ',
          name: '홍길동',
          password: 'password123',
        })
        .expect(201);

      expect(body).toEqual({
        id: expect.any(String),
        email: 'a@example.com',
        name: '홍길동',
        createdAt: expect.any(String),
      });
    });

    it('같은 이메일로 다시 가입하면 409', async () => {
      await signup();
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({ ...credentials, name: '홍길동' })
        .expect(409);
    });

    it('잘못된 입력이면 400', async () => {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({ email: 'not-an-email', name: '', password: 'short' })
        .expect(400);
    });
  });
});
