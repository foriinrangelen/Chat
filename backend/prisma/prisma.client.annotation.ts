/**
 * =============================================================================
 * Prisma Client Methods & Query Options Reference (Cheatsheet)
 * =============================================================================
 *
 * [1] CRUD Methods (기본 데이터 조작)
 * - 모델명(user)은 스키마 정의에 따라 달라집니다. (camelCase 사용)
 *
 * prisma.user.findUnique() : 고유 값(PK, @unique)으로 단일 데이터를 조회합니다.
 * ex) await prisma.user.findUnique({ where: { email: 'user@test.com' } })
 *
 * prisma.user.findFirst()  : 조건에 맞는 첫 번째 데이터를 조회합니다. (정렬 옵션과 자주 쓰임)
 * ex) await prisma.user.findFirst({ where: { name: 'Kim' }, orderBy: { id: 'desc' } })
 *
 * prisma.user.findMany()   : 조건에 맞는 모든 데이터를 배열로 조회합니다.
 * ex) await prisma.user.findMany({ where: { age: { gte: 20 } } })
 *
 * prisma.user.create()     : 새로운 데이터를 생성합니다.
 * ex) await prisma.user.create({ data: { email: 'new@test.com', name: 'NewUser' } })
 *
 * prisma.user.update()     : 고유 값(PK, @unique)을 기준으로 기존 데이터를 수정합니다.
 * ex) await prisma.user.update({ where: { id: 1 }, data: { name: 'Updated' } })
 *
 * prisma.user.delete()     : 고유 값(PK, @unique)을 기준으로 데이터를 삭제합니다.
 * ex) await prisma.user.delete({ where: { id: 1 } })
 *
 * prisma.user.upsert()     : 데이터가 있으면 수정(update), 없으면 생성(create)합니다. (강력 추천)
 * ex) await prisma.user.upsert({
 * where: { email: 'user@test.com' },
 * update: { loginCount: { increment: 1 } },
 * create: { email: 'user@test.com', loginCount: 1 }
 * })
 *
 * -----------------------------------------------------------------------------
 *
 * [2] Query Options (쿼리 옵션 - 인자로 전달되는 객체)
 * - SQL의 SELECT, WHERE, JOIN, ORDER BY 등을 담당합니다.
 *
 * select  : 특정 필드만 선택해서 가져옵니다. (성능 최적화용)
 * ex) { select: { id: true, name: true } } // id랑 name만 가져옴
 *
 * include : 관계된 테이블(Relation)의 데이터를 함께 가져옵니다. (Eager Loading / JOIN)
 * ex) { include: { posts: true } } // 유저 정보 + 작성한 글 목록 함께 조회
 *
 * where   : 필터링 조건을 설정합니다.
 * ex) { where: { email: { contains: '@gmail.com' } } }
 * - equals, not, in, notIn, lt(<), lte(<=), gt(>), gte(>=), contains, startsWith, endsWith
 *
 * orderBy : 정렬 순서를 지정합니다.
 * ex) { orderBy: { createdAt: 'desc' } } // 최신순 정렬
 *
 * skip / take : 페이징(Pagination) 처리에 사용됩니다.
 * ex) { skip: 10, take: 5 } // 10개를 건너뛰고 5개를 가져옴 (Page 3)
 *
 * -----------------------------------------------------------------------------
 *
 * [3] Advanced & Utility (고급 기능)
 *
 * prisma.$transaction() : 여러 쿼리를 하나의 트랜잭션으로 묶어 실행합니다. (성공 시 커밋, 실패 시 롤백)
 * ex) await prisma.$transaction([
 * prisma.user.create({ ... }),
 * prisma.log.create({ ... })
 * ])
 *
 * prisma.user.count()   : 조건에 맞는 데이터의 개수를 셉니다.
 * ex) const totalUsers = await prisma.user.count({ where: { isActive: true } })
 *
 * prisma.$queryRaw()    : Prisma 문법으로 해결되지 않는 복잡한 SQL을 직접 실행합니다.
 * ex) await prisma.$queryRaw`SELECT * FROM users WHERE id = ${userId}`
 *
 * =============================================================================
 *
 * [Tip] 'select'와 'include'는 같은 레벨에서 동시에 사용할 수 없습니다.
 * 관계된 데이터를 가져오면서 특정 필드만 뽑고 싶다면, select 안에 중첩된 select를 사용해야 합니다.
 */
