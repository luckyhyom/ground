import { execFileSync } from 'node:child_process';

/**
 * e2e 실행 전에 테스트 DB 에 마이그레이션을 적용한다. (DB 가 없으면 만든다)
 * 데이터는 지우지 않는다: 테스트마다 clearDatabase() 로 테이블을 비운다.
 */
export default function setup(): void {
  const url = new URL(process.env.DATABASE_URL!);
  // 개발 DB 의 데이터를 테스트가 지우지 않도록, 이름이 _test 로 끝나는 DB 만 쓴다.
  if (!url.pathname.endsWith('_test')) {
    throw new Error(
      `e2e 는 _test 로 끝나는 DB 에서만 돈다: ${url.pathname.slice(1)}`,
    );
  }
  execFileSync('npx', ['prisma', 'migrate', 'deploy'], { stdio: 'inherit' });
}
