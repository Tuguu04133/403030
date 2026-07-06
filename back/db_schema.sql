-- DDL Schema for Graduation Thesis Defense Management System

-- Drop tables in reverse order of dependencies
DROP TABLE IF EXISTS teacher_bias_analysis CASCADE;
DROP TABLE IF EXISTS overall_evaluations CASCADE;
DROP TABLE IF EXISTS progress_1_evaluations CASCADE;
DROP TABLE IF EXISTS reviewer_evaluations CASCADE;
DROP TABLE IF EXISTS jinkhene_komissin_gishvvd CASCADE;
DROP TABLE IF EXISTS jinkhene_hamgaalalt CASCADE;
DROP TABLE IF EXISTS uridchilsan_komissin_gishvvd CASCADE;
DROP TABLE IF EXISTS uridchilsan_hamgaalalt CASCADE;
DROP TABLE IF EXISTS komissin_gishvvd_uzleg CASCADE;
DROP TABLE IF EXISTS komissin_ehiin_uzleg CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS committee_members CASCADE;
DROP TABLE IF EXISTS committees CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;

-- 1. Teachers Table
CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    expertise VARCHAR(100),
    behavior VARCHAR(50),
    bias NUMERIC(5, 2),
    std NUMERIC(5, 2),
    gpref VARCHAR(10),
    gbonus NUMERIC(5, 2)
);

-- 2. Committees Table
CREATE TABLE committees (
    id SERIAL PRIMARY KEY,
    period_year INTEGER NOT NULL,
    period_sem VARCHAR(50) NOT NULL,
    committee_no INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL
);

-- 3. Committee Members Table
CREATE TABLE committee_members (
    id SERIAL PRIMARY KEY,
    committee_id INTEGER NOT NULL REFERENCES committees(id) ON DELETE CASCADE,
    teacher_id INTEGER REFERENCES teachers(id) ON DELETE SET NULL,
    is_external BOOLEAN NOT NULL DEFAULT FALSE,
    external_name VARCHAR(255)
);

-- 4. Students Table
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    year INTEGER NOT NULL,
    semester VARCHAR(50) NOT NULL,
    level VARCHAR(50),
    topic_title VARCHAR(500),
    category VARCHAR(100),
    program VARCHAR(255),
    committee_id INTEGER REFERENCES committees(id) ON DELETE SET NULL,
    supervisor_id INTEGER REFERENCES teachers(id) ON DELETE SET NULL,
    reviewer_id INTEGER REFERENCES teachers(id) ON DELETE SET NULL
);

-- 5. Комиссын эхний үзлэг (05_komissin_ehiin_uzleg.csv)
CREATE TABLE komissin_ehiin_uzleg (
    student_id INTEGER PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
    program VARCHAR(255),
    name VARCHAR(255),
    supervisor_name VARCHAR(255),
    score_theory_and_topic_mastery INTEGER NOT NULL, -- Онолын судалгаа (6)
    score_plan_execution INTEGER NOT NULL,           -- Ажлын төлөвлөгөөний хэрэгжилт (9)
    score_presentation_and_answers INTEGER NOT NULL, -- Илтгэсэн асуултад харуулсан байдал (5)
    score_total INTEGER NOT NULL                     -- Нийт (20)
);

-- 6. Комиссын гишүүдийн үзлэг (06_komissin_gishvvd_uzleg.csv)
CREATE TABLE komissin_gishvvd_uzleg (
    student_id INTEGER PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
    program VARCHAR(255),
    name VARCHAR(255),
    supervisor_name VARCHAR(255),
    member_1_score NUMERIC(5, 2) NOT NULL,
    member_2_score NUMERIC(5, 2) NOT NULL,
    member_3_score NUMERIC(5, 2) NOT NULL,
    member_4_score NUMERIC(5, 2) NOT NULL,
    average_score NUMERIC(5, 2) NOT NULL            -- Нийт дундаж (20)
);

-- 7. Урьдчилсан хамгаалалт (07_uridchilsan_hamgaalalt.csv)
CREATE TABLE uridchilsan_hamgaalalt (
    student_id INTEGER PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
    program VARCHAR(255),
    name VARCHAR(255),
    supervisor_name VARCHAR(255),
    progress_1 INTEGER NOT NULL,                     -- Явц 1
    progress_2 INTEGER NOT NULL,                     -- Явц 2
    score_theory_and_topic_mastery INTEGER NOT NULL, -- Онолын судалгаа (6)
    score_work_done_since_review INTEGER NOT NULL,   -- Үзлэгээс хойш гүйцэтгэсэн ажил (9)
    score_report_writing INTEGER NOT NULL,           -- Тайлан бичилт (5)
    score_presentation_and_answers INTEGER NOT NULL, -- Илтгэсэн асуултад хариулсан байдал (5)
    score_total INTEGER NOT NULL                     -- Нийт (25)
);

-- 8. Урьдчилсан хамгаалалтын комиссын гишүүдийн оноо (08_uridchilsan_komissin_gishvvd.csv)
CREATE TABLE uridchilsan_komissin_gishvvd (
    student_id INTEGER PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
    program VARCHAR(255),
    name VARCHAR(255),
    supervisor_name VARCHAR(255),
    progress_1 INTEGER NOT NULL,                     -- Явц 1
    progress_2 INTEGER NOT NULL,                     -- Явц 2
    member_1_score NUMERIC(5, 2) NOT NULL,
    member_2_score NUMERIC(5, 2) NOT NULL,
    member_3_score NUMERIC(5, 2) NOT NULL,
    member_4_score NUMERIC(5, 2) NOT NULL,
    average_score NUMERIC(5, 2) NOT NULL            -- Нийт дундаж (25)
);

-- 9. Жинхэнэ хамгаалалт (09_jinkhene_hamgaalalt.csv)
CREATE TABLE jinkhene_hamgaalalt (
    student_id INTEGER PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
    program VARCHAR(255),
    name VARCHAR(255),
    supervisor_name VARCHAR(255),
    score_novelty_and_practical_value INTEGER NOT NULL,         -- БСА шинэлэг тал практик ач холбогдол (9)
    score_theoretical_knowledge_and_results INTEGER NOT NULL,   -- Онолын мэдлэг ажлын үр дүн (10)
    score_presentation_prep_and_delivery INTEGER NOT NULL,      -- Илтгэлийг бэлтгэсэн байдал (5)
    score_report_writing INTEGER NOT NULL,                     -- Тайлан бичилт боловсруулалт (7)
    score_additional_answers INTEGER NOT NULL,                 -- Нэмэлт асуултад хариулсан байдал (4)
    score_total INTEGER NOT NULL                               -- Нийт (35)
);

-- 10. Жинхэнэ хамгаалалтын комиссын гишүүдийн оноо (10_jinkhene_komissin_gishvvd.csv)
CREATE TABLE jinkhene_komissin_gishvvd (
    student_id INTEGER PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
    program VARCHAR(255),
    name VARCHAR(255),
    supervisor_name VARCHAR(255),
    member_1_score NUMERIC(5, 2) NOT NULL,
    member_2_score NUMERIC(5, 2) NOT NULL,
    member_3_score NUMERIC(5, 2) NOT NULL,
    member_4_score NUMERIC(5, 2) NOT NULL,
    average_score NUMERIC(5, 2) NOT NULL                      -- Жинхэнэ хамгаалалтын нийт дундаж (35)
);

-- 11. Шүүмжийн үнэлгээ (5 онооноос)
CREATE TABLE reviewer_evaluations (
    student_id INTEGER PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
    program VARCHAR(255),
    name VARCHAR(255),
    supervisor_name VARCHAR(255),
    reviewer_name VARCHAR(255),
    score INTEGER NOT NULL                                     -- Шүүмжийн оноо (3-5)
);

-- 12. Явц 1-ийн үнэлгээ (15 онооноос)
CREATE TABLE progress_1_evaluations (
    student_id INTEGER PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
    program VARCHAR(255),
    name VARCHAR(255),
    supervisor_name VARCHAR(255),
    score INTEGER NOT NULL                                     -- Явц 1-ийн оноо (15 онооноос)
);

-- 13. Нийт overall үнэлгээ (100 онооноос)
CREATE TABLE overall_evaluations (
    student_id INTEGER PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
    program VARCHAR(255),
    name VARCHAR(255),
    supervisor_name VARCHAR(255),
    score_progress_1 NUMERIC(5, 2) NOT NULL,                  -- Явц 1 (15)
    score_committee_review NUMERIC(5, 2) NOT NULL,            -- Комиссын гишүүдийн үзлэг (20)
    score_pre_defense NUMERIC(5, 2) NOT NULL,                 -- Урьдчилсан хамгаалалтын комисс (25)
    score_reviewer NUMERIC(5, 2) NOT NULL,                    -- Шүүмжлэгч (5)
    score_final_defense NUMERIC(5, 2) NOT NULL,               -- Жинхэнэ хамгаалалт (35)
    score_total NUMERIC(5, 2) NOT NULL                        -- Нийт нийлбэр оноо (100)
);

-- 14. Teacher Bias Analysis Table (Dynamically Calculated)
CREATE TABLE teacher_bias_analysis (
    teacher_id INTEGER PRIMARY KEY REFERENCES teachers(id) ON DELETE CASCADE,
    calculated_bias NUMERIC(5, 2) NOT NULL,
    calculated_std NUMERIC(5, 2) NOT NULL,
    total_evaluations INTEGER NOT NULL
);
