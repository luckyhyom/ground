import { defineConfig } from 'vitest/config';

// docker-compose 의 MySQL 에 있는 테스트 전용 DB. 없으면 마이그레이션이 만든다.
// globalSetup(마이그레이션)과 테스트 워커가 모두 쓰도록 프로세스 환경에 넣는다.
process.env.DATABASE_URL =
  process.env.TEST_DATABASE_URL ??
  'mysql://ground:ground@localhost:3306/ground_test';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    env: { JWT_SECRET: 'test-secret-test-secret-test-secret-0123' },
    globalSetup: ['./test/support/global-setup.ts'],
    // 모든 파일이 같은 DB 를 쓰므로 순서대로 돌린다.
    fileParallelism: false,
  },
});
