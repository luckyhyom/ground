import { INestApplication } from '@nestjs/common';
import { PasswordHasher } from '@nestjs/authentication';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';

describe('Users (e2e)', () => {
  let app: INestApplication<App>;

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

  it('로그인한 사용자는 GET /users/:id 로 회원을 조회한다', async () => {
    const credentials = { email: 'a@example.com', password: 'password123' };
    const { body: created } = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ ...credentials, name: '홍길동' })
      .expect(201);
    const { body: tokens } = await request(app.getHttpServer())
      .post('/auth/login')
      .send(credentials)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/users/${created.id}`)
      .set('Authorization', `Bearer ${tokens.accessToken}`)
      .expect(200, created);
  });

  it('로그인하지 않고 조회하면 401', async () => {
    await request(app.getHttpServer())
      .get('/users/00000000-0000-4000-8000-000000000000')
      .expect(401);
  });
});
