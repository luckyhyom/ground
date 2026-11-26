import { defineConfig, env } from 'prisma/config';

// Prisma CLI 는 .env 를 자동으로 읽지 않는다.
try {
  process.loadEnvFile();
} catch {
  // .env 가 없으면 이미 설정된 환경 변수만 쓴다.
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: { url: env('DATABASE_URL') },
});
