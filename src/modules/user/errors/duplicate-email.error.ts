/** 이미 가입된 이메일로 사용자를 저장하려 할 때 저장소가 던진다. */
export class DuplicateEmailError extends Error {
  constructor(readonly email: string) {
    super(`이미 가입된 이메일입니다: ${email}`);
    this.name = 'DuplicateEmailError';
  }
}
