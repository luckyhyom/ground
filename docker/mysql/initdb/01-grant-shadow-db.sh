#!/bin/bash
# `prisma migrate dev` 는 마이그레이션을 검증할 shadow DB 를 매번 만들고 지운다.
# 앱 계정은 기본적으로 MYSQL_DATABASE 에만 권한이 있으므로, 로컬 개발용으로 DB 생성 권한을 준다.
# (볼륨이 비어 있어 데이터가 처음 만들어질 때 한 번만 실행된다.)
set -euo pipefail

mysql -uroot -p"${MYSQL_ROOT_PASSWORD}" <<SQL
GRANT ALL PRIVILEGES ON *.* TO '${MYSQL_USER}'@'%';
FLUSH PRIVILEGES;
SQL
