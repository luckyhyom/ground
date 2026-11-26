/**
 * 로그인 검증에만 쓰는 값. 도메인 엔티티(User)와 섞지 않는다.
 * 비밀번호 확인이 끝나면 버리고, 응답이나 로그로 내보내지 않는다.
 */
export class UserCredentials {
  constructor(
    readonly userId: string,
    readonly passwordHash: string,
  ) {}
}
