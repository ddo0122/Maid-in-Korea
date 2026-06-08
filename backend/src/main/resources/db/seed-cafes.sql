-- Mock data for all JPA entities under com.example.backend.domain.
-- Run manually after Hibernate has created/updated the MySQL schema.
-- Current-month schedules are based on 2026-06 for the local service date.

SET FOREIGN_KEY_CHECKS = 0;

INSERT IGNORE INTO member (
    id, create_at, updated_at, deleted_at,
    name, email, password, socialType, social_uid, role, gender, birth, address, detail_address
) VALUES
    (1001, NOW(), NOW(), NULL, '사쿠라', 'seed-maid-sakura@example.com', '{noop}password', 'LOCAL', NULL, 'MAID', 'FEMALE', '2000-03-21', '서울 마포구', '홍대입구 1번 출구'),
    (1002, NOW(), NOW(), NULL, '미유', 'seed-maid-miyu@example.com', '{noop}password', 'LOCAL', NULL, 'MAID', 'FEMALE', '1999-09-12', '서울 마포구', '상수동'),
    (1003, NOW(), NOW(), NULL, '나나', 'seed-maid-nana@example.com', '{noop}password', 'LOCAL', NULL, 'MAID', 'FEMALE', '2001-01-05', '서울 서대문구', '연희동'),
    (1004, NOW(), NOW(), NULL, '유이', 'seed-maid-yui@example.com', '{noop}password', 'LOCAL', NULL, 'MAID', 'FEMALE', '2000-11-18', '서울 마포구', '합정동'),
    (1005, NOW(), NOW(), NULL, '레이', 'seed-maid-rei@example.com', '{noop}password', 'LOCAL', NULL, 'MAID', 'FEMALE', '1998-07-30', '서울 용산구', '이태원동'),
    (1101, NOW(), NOW(), NULL, '김민준', 'seed-user-minjun@example.com', '{noop}password', 'LOCAL', NULL, 'USER', 'MALE', '1997-04-10', '서울 강남구', '테헤란로 101'),
    (1102, NOW(), NOW(), NULL, '이서연', 'seed-user-seoyeon@example.com', '{noop}password', 'LOCAL', NULL, 'USER', 'FEMALE', '1998-08-22', '서울 성동구', '성수이로 25'),
    (1103, NOW(), NOW(), NULL, '관리자', 'seed-admin@example.com', '{noop}password', 'LOCAL', NULL, 'ADMIN', 'NONE', '1990-01-01', '서울 중구', '운영팀');

INSERT IGNORE INTO maid (
    id, create_at, updated_at, deleted_at, member_id
) VALUES
    (1001, NOW(), NOW(), NULL, 1001),
    (1002, NOW(), NOW(), NULL, 1002),
    (1003, NOW(), NOW(), NULL, 1003),
    (1004, NOW(), NOW(), NULL, 1004),
    (1005, NOW(), NOW(), NULL, 1005);

INSERT IGNORE INTO maid_profile (
    id, create_at, updated_at, deleted_at,
    maid_id, name, description, service_area, instagram, x, is_active
) VALUES
    (1001, NOW(), NOW(), NULL, 1001, '사쿠라', '오므라이스 드로잉과 밝은 응대가 특기입니다.', '서울 홍대', 'sakura_maid', 'sakura_maid', TRUE),
    (1002, NOW(), NOW(), NULL, 1002, '미유', '디저트 추천과 사진 촬영을 좋아합니다.', '서울 홍대', 'miyu_maid', 'miyu_maid', TRUE),
    (1003, NOW(), NOW(), NULL, 1003, '나나', '차분한 티 서비스와 게임 진행을 맡습니다.', '서울 홍대', 'nana_maid', 'nana_maid', TRUE),
    (1004, NOW(), NOW(), NULL, 1004, '유이', '이벤트 진행과 생일 축하 서비스를 담당합니다.', '서울 홍대', 'yui_maid', 'yui_maid', TRUE),
    (1005, NOW(), NOW(), NULL, 1005, '레이', '라이브 타임과 포토카드 안내를 담당합니다.', '서울 홍대', 'rei_maid', 'rei_maid', TRUE);

INSERT IGNORE INTO cafe (
    id, create_at, updated_at, deleted_at,
    name, description, location, area, image, cover_image, phone, website,
    rating, distance, default_open_time, default_close_time, default_last_order_time, regular_closed_days
) VALUES
    (
        1, NOW(), NOW(), NULL,
        '오마이 메이드 카페',
        '홍대 골목 안쪽에 있는 클래식 메이드 카페입니다. 오므라이스 드로잉과 테이블 미니게임을 운영합니다.',
        '서울 마포구 서교동 358-115',
        '서울 홍대',
        'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200',
        '02-1111-2222',
        'https://example.com/ohmy-maid',
        4.8,
        '1.2km',
        '15:00:00',
        '22:00:00',
        '21:30:00',
        '월요일'
    ),
    (
        2, NOW(), NOW(), NULL,
        '메이드문',
        '달빛 콘셉트의 조용한 메이드 카페입니다. 티 세트와 시즌 음료가 인기입니다.',
        '서울 마포구 와우산로 29길 18',
        '서울 홍대',
        'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800',
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200',
        '02-3333-4444',
        'https://example.com/maid-moon',
        4.6,
        '1.4km',
        '14:00:00',
        '21:00:00',
        '20:30:00',
        '화요일'
    ),
    (
        3, NOW(), NOW(), NULL,
        '마지텐시',
        '엔젤 콘셉트의 포토존과 한정 디저트를 운영하는 카페입니다.',
        '서울 마포구 잔다리로 12',
        '서울 홍대',
        'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800',
        'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1200',
        '02-5555-6666',
        'https://example.com/maji-tenshi',
        4.9,
        '1.3km',
        '13:00:00',
        '22:00:00',
        '21:00:00',
        '없음'
    ),
    (
        4, NOW(), NOW(), NULL,
        '메이드리밍',
        '라이브 타임과 포토카드 이벤트가 있는 예약제 메이드 카페입니다.',
        '서울 마포구 양화로 16길 33',
        '서울 홍대',
        'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=800',
        'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=1200',
        '02-7777-8888',
        'https://example.com/maidreaming',
        4.7,
        '1.5km',
        '16:00:00',
        '23:00:00',
        '22:20:00',
        '수요일'
    );

INSERT IGNORE INTO tag (
    id, create_at, updated_at, deleted_at, name
) VALUES
    (1, NOW(), NOW(), NULL, '신규'),
    (2, NOW(), NOW(), NULL, '인기'),
    (3, NOW(), NOW(), NULL, '추천'),
    (4, NOW(), NOW(), NULL, '예약가능'),
    (5, NOW(), NOW(), NULL, '디저트'),
    (6, NOW(), NOW(), NULL, '라이브');

INSERT IGNORE INTO cafe_tag (
    id, create_at, updated_at, deleted_at, cafe_id, tag_id
) VALUES
    (1, NOW(), NOW(), NULL, 1, 2),
    (2, NOW(), NOW(), NULL, 1, 3),
    (3, NOW(), NOW(), NULL, 1, 5),
    (4, NOW(), NOW(), NULL, 2, 1),
    (5, NOW(), NOW(), NULL, 2, 4),
    (6, NOW(), NOW(), NULL, 2, 5),
    (7, NOW(), NOW(), NULL, 3, 2),
    (8, NOW(), NOW(), NULL, 3, 5),
    (9, NOW(), NOW(), NULL, 4, 3),
    (10, NOW(), NOW(), NULL, 4, 4),
    (11, NOW(), NOW(), NULL, 4, 6);

INSERT IGNORE INTO menu (
    id, create_at, updated_at, deleted_at, cafe_id, name, price, image
) VALUES
    (1, NOW(), NOW(), NULL, 1, '딸기 파르페', 8500, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500'),
    (2, NOW(), NOW(), NULL, 1, '오므라이스', 12000, 'https://images.unsplash.com/photo-1513442542250-854d436a73f2?w=500'),
    (3, NOW(), NOW(), NULL, 1, '메이드 특제 음료', 6500, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500'),
    (4, NOW(), NOW(), NULL, 2, '문라이트 밀크티', 7000, 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=500'),
    (5, NOW(), NOW(), NULL, 2, '초승달 케이크', 9000, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500'),
    (6, NOW(), NOW(), NULL, 3, '엔젤 크림소다', 7500, 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500'),
    (7, NOW(), NOW(), NULL, 3, '화이트 쉬폰 세트', 14000, 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=500'),
    (8, NOW(), NOW(), NULL, 4, '드리밍 라떼', 7000, 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500'),
    (9, NOW(), NOW(), NULL, 4, '라이브 티켓 세트', 18000, 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500');

INSERT IGNORE INTO cafe_maid (
    id, create_at, updated_at, deleted_at, cafe_id, maid_profile_id
) VALUES
    (1, NOW(), NOW(), NULL, 1, 1001),
    (2, NOW(), NOW(), NULL, 1, 1002),
    (3, NOW(), NOW(), NULL, 2, 1003),
    (4, NOW(), NOW(), NULL, 3, 1004),
    (5, NOW(), NOW(), NULL, 4, 1005);

INSERT IGNORE INTO cafe_monthly_schedule (
    id, create_at, updated_at, deleted_at,
    cafe_id, schedule_year, schedule_month, status, published_at
) VALUES
    (101, NOW(), NOW(), NULL, 1, 2026, 6, 'PUBLISHED', NOW()),
    (102, NOW(), NOW(), NULL, 2, 2026, 6, 'PUBLISHED', NOW()),
    (103, NOW(), NOW(), NULL, 3, 2026, 6, 'PUBLISHED', NOW()),
    (104, NOW(), NOW(), NULL, 4, 2026, 6, 'PUBLISHED', NOW()),
    (201, NOW(), NOW(), NULL, 1, 2026, 7, 'DRAFT', NULL);

INSERT IGNORE INTO cafe_operating_hour (
    id, create_at, updated_at, deleted_at,
    monthly_schedule_id, business_date, is_open, open_time, close_time, last_order_time, note
) VALUES
    (101, NOW(), NOW(), NULL, 101, '2026-06-06', TRUE, '15:00:00', '22:00:00', '21:30:00', NULL),
    (102, NOW(), NOW(), NULL, 102, '2026-06-06', TRUE, '14:00:00', '21:00:00', '20:30:00', NULL),
    (103, NOW(), NOW(), NULL, 103, '2026-06-06', FALSE, NULL, NULL, NULL, '내부 정비로 휴무'),
    (104, NOW(), NOW(), NULL, 104, '2026-06-06', TRUE, '16:00:00', '23:00:00', '22:20:00', '예약 우선 입장'),
    (105, NOW(), NOW(), NULL, 101, '2026-06-07', TRUE, '15:00:00', '22:00:00', '21:30:00', NULL),
    (106, NOW(), NOW(), NULL, 102, '2026-06-07', TRUE, '14:00:00', '21:00:00', '20:30:00', NULL),
    (107, NOW(), NOW(), NULL, 103, '2026-06-07', TRUE, '13:00:00', '22:00:00', '21:00:00', NULL),
    (108, NOW(), NOW(), NULL, 104, '2026-06-07', TRUE, '16:00:00', '23:00:00', '22:20:00', NULL),
    (109, NOW(), NOW(), NULL, 101, '2026-06-08', FALSE, NULL, NULL, NULL, '정기 휴무');

INSERT IGNORE INTO cafe_schedule (
    id, create_at, updated_at, deleted_at, monthly_schedule_id, work_date
) VALUES
    (101, NOW(), NOW(), NULL, 101, '2026-06-06'),
    (102, NOW(), NOW(), NULL, 101, '2026-06-07'),
    (103, NOW(), NOW(), NULL, 102, '2026-06-06'),
    (104, NOW(), NOW(), NULL, 102, '2026-06-07'),
    (105, NOW(), NOW(), NULL, 103, '2026-06-07'),
    (106, NOW(), NOW(), NULL, 104, '2026-06-06'),
    (107, NOW(), NOW(), NULL, 104, '2026-06-07');

INSERT IGNORE INTO cafe_schedule_maid (
    id, create_at, updated_at, deleted_at,
    cafe_schedule_id, maid_profile_id, start_time, end_time, note
) VALUES
    (101, NOW(), NOW(), NULL, 101, 1001, '15:00:00', '19:00:00', '오픈 담당'),
    (102, NOW(), NOW(), NULL, 101, 1002, '18:00:00', '22:00:00', '마감 담당'),
    (103, NOW(), NOW(), NULL, 102, 1001, '15:00:00', '22:00:00', NULL),
    (104, NOW(), NOW(), NULL, 103, 1003, '14:00:00', '21:00:00', NULL),
    (105, NOW(), NOW(), NULL, 104, 1003, '14:00:00', '21:00:00', '티 세트 이벤트'),
    (106, NOW(), NOW(), NULL, 105, 1004, '13:00:00', '22:00:00', NULL),
    (107, NOW(), NOW(), NULL, 106, 1005, '16:00:00', '23:00:00', '라이브 타임'),
    (108, NOW(), NOW(), NULL, 107, 1005, '16:00:00', '23:00:00', NULL);

INSERT IGNORE INTO article (
    id, create_at, updated_at, deleted_at,
    member_id, title, contents, like_count
) VALUES
    (1001, NOW(), NOW(), NULL, 1101, '오마이 메이드 카페 첫 방문 후기', '오므라이스 드로잉이 재미있고 직원 응대가 좋았습니다. 주말에는 예약을 추천합니다.', 12),
    (1002, NOW(), NOW(), NULL, 1102, '메이드문 밀크티 추천', '문라이트 밀크티가 깔끔하고 디저트와 잘 어울렸습니다.', 7),
    (1003, NOW(), NOW(), NULL, 1001, '이번 주 사쿠라 근무 안내', '6월 첫 주는 토요일과 일요일에 오마이 메이드 카페에서 만날 수 있습니다.', 18);

SET FOREIGN_KEY_CHECKS = 1;
