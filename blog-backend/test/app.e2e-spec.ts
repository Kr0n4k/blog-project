import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CoreModule } from '../src/core/core.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CoreModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/api/docs (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/docs')
      .expect(200);
  });

  it('/graphql (GET)', () => {
    return request(app.getHttpServer())
      .get('/graphql')
      .expect(200);
  });

  it('/api/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/users')
      .expect(404); // Should return 404 since we don't have this endpoint
  });

  it('/api/posts (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/posts')
      .expect(200);
  });

  it('/api/comments (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/comments')
      .expect(404); // Should return 404 since we don't have this endpoint
  });
});
