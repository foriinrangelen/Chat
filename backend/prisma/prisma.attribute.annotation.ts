/**
 * =============================================================================
 * Prisma Schema Attributes Reference (Cheatsheet)
 * =============================================================================
 *
 * [1] Field Attributes (필드 레벨 속성)
 * - 정의: 특정 컬럼(Field) 하나에 적용되는 설정입니다. ('@' 사용)
 *
 * @id             : Primary Key 지정
 * ex) id Int @id
 * @default(val)   : 기본값 설정
 * ex) isActive Boolean @default(true)
 * @unique         : 중복 불가 (Unique Index)
 * ex) email String @unique
 * @updatedAt      : 수정 시 현재 시간 자동 갱신
 * ex) updatedAt DateTime @updatedAt
 * @map("name")    : DB 컬럼명 매핑 (CamelCase -> snake_case)
 * ex) createdAt DateTime @map("created_at")
 * @relation(...)  : 관계(Foreign Key) 정의
 * ex) user User @relation(fields: [userId], references: [id])
 * @ignore         : Prisma Client 생성 제외
 * ex) secretCode String @ignore
 * @db.VarChar(x)  : DB 데이터 타입 강제
 * ex) title String @db.VarChar(200)
 *
 * -----------------------------------------------------------------------------
 *
 * [2] Attribute Functions (속성 함수)
 * - 정의: @default() 내부에서 사용하여 값을 동적으로 생성합니다.
 *
 * autoincrement() : 정수 자동 증가 (Sequence)
 * ex) id Int @id @default(autoincrement())
 * now()           : 현재 시간 (Timestamp)
 * ex) createdAt DateTime @default(now())
 * uuid()          : UUID v4 (36자 랜덤 문자열)
 * ex) id String @id @default(uuid())
 * cuid()          : 충돌 방지 고유 ID (URL Friendly)
 * ex) id String @id @default(cuid())
 * dbgenerated()   : DB 고유 함수 직접 실행
 * ex) id String @id @default(dbgenerated("gen_random_uuid()"))
 *
 * -----------------------------------------------------------------------------
 *
 * [3] Block Attributes (모델 레벨 속성)
 * - 정의: 모델(테이블) 전체에 적용되는 설정입니다. ('@@' 사용)
 *
 * @@map("name")   : DB 테이블명 매핑
 * ex) @@map("users")
 * @@id([a, b])    : 복합 기본 키 (Composite PK)
 * ex) @@id([orderId, productId])
 * @@unique([a, b]): 복합 유니크 (Composite Unique)
 * ex) @@unique([teamId, memberNumber])
 * @@index([a, b]) : 인덱스 생성 (성능 최적화)
 * ex) @@index([email, role])
 * @@ignore        : 모델 전체 제외
 * ex) @@ignore
 *
 * -----------------------------------------------------------------------------
 *
 * [4] Type Modifiers (타입 수식어)
 *
 * ? (Optional)    : NULL 허용
 * ex) description String?
 * [] (List)       : 배열 또는 관계형 데이터 목록
 * ex) posts Post[]
 * =============================================================================
 */
