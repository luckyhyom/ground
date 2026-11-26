import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  // .env 가 있으면 읽는다. (JWT_SECRET 등)
  try {
    process.loadEnvFile();
  } catch {
    // .env 가 없으면 이미 설정된 환경 변수만 쓴다.
  }
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
