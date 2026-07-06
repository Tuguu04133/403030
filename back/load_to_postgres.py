import csv
import os
import sys
import random
import math
from collections import defaultdict

try:
    import psycopg2
except ImportError:
    print("Error: psycopg2 module is not installed.")
    print("Please run: pip install psycopg2-binary")
    sys.exit(1)

def get_db_connection():
    database_url = os.environ.get("DATABASE_URL")
    if database_url:
        try:
            return psycopg2.connect(database_url)
        except Exception as e:
            print(f"\nDatabase Connection Failed: {e}")
            sys.exit(1)

    host = os.environ.get("DB_HOST")
    port = os.environ.get("DB_PORT")
    dbname = os.environ.get("DB_NAME")
    user = os.environ.get("DB_USER")
    password = os.environ.get("DB_PASSWORD")
    sslmode = os.environ.get("DB_SSLMODE", "prefer")

    if not all([host, port, dbname, user, password]):
        print("--- PostgreSQL Connection Settings ---")
        print("Press Enter to use default values.")
        if not host:
            host = input("DB Host [localhost]: ").strip() or "localhost"
        if not port:
            port = input("DB Port [5432]: ").strip() or "5432"
        if not dbname:
            dbname = input("DB Name [postgres]: ").strip() or "postgres"
        if not user:
            user = input("DB User [postgres]: ").strip() or "postgres"
        if not password:
            password = input("DB Password: ").strip()

    if "neon.tech" in host:
        sslmode = "require"

    try:
        conn = psycopg2.connect(
            host=host,
            port=port,
            dbname=dbname,
            user=user,
            password=password,
            sslmode=sslmode,
        )
        return conn
    except Exception as e:
        print(f"\nDatabase Connection Failed: {e}")
        sys.exit(1)

def execute_ddl(cursor, schema_file):
    print(f"Executing DDL Schema from {schema_file}...")
    with open(schema_file, "r", encoding="utf-8") as f:
        ddl_sql = f.read()
    cursor.execute(ddl_sql)
    print("Database tables and relations created successfully.")

def load_csv_data(cursor, data_dir):
    # Order of insertion to respect foreign key constraints
    files_to_load = [
        ("01_teachers.csv", "teachers", [
            "id", "name", "gender", "expertise", "behavior", "bias", "std", "gpref", "gbonus"
        ]),
        ("02_committees.csv", "committees", [
            "id", "period_year", "period_sem", "committee_no", "name"
        ]),
        ("03_committee_members.csv", "committee_members", [
            "id", "committee_id", "teacher_id", "is_external", "external_name"
        ]),
        ("04_students.csv", "students", [
            "id", "name", "gender", "year", "semester", "level", "topic_title", "category", "program", "committee_id", "supervisor_id", "reviewer_id"
        ]),
        ("05_komissin_ehiin_uzleg.csv", "komissin_ehiin_uzleg", [
            "program", "name", "student_id", "supervisor_name", 
            "score_theory_and_topic_mastery", "score_plan_execution", "score_presentation_and_answers", "score_total"
        ]),
        ("06_komissin_gishvvd_uzleg.csv", "komissin_gishvvd_uzleg", [
            "program", "name", "student_id", "supervisor_name", 
            "member_1_score", "member_2_score", "member_3_score", "member_4_score", "average_score"
        ]),
        ("07_uridchilsan_hamgaalalt.csv", "uridchilsan_hamgaalalt", [
            "program", "name", "student_id", "supervisor_name", 
            "progress_1", "progress_2", 
            "score_theory_and_topic_mastery", "score_work_done_since_review", "score_report_writing", "score_presentation_and_answers", "score_total"
        ]),
        ("08_uridchilsan_komissin_gishvvd.csv", "uridchilsan_komissin_gishvvd", [
            "program", "name", "student_id", "supervisor_name", 
            "progress_1", "progress_2", 
            "member_1_score", "member_2_score", "member_3_score", "member_4_score", "average_score"
        ]),
        ("09_jinkhene_hamgaalalt.csv", "jinkhene_hamgaalalt", [
            "program", "name", "student_id", "supervisor_name", 
            "score_novelty_and_practical_value", "score_theoretical_knowledge_and_results", "score_presentation_prep_and_delivery", "score_report_writing", "score_additional_answers", "score_total"
        ]),
        ("10_jinkhene_komissin_gishvvd.csv", "jinkhene_komissin_gishvvd", [
            "program", "name", "student_id", "supervisor_name", 
            "member_1_score", "member_2_score", "member_3_score", "member_4_score", "average_score"
        ])
    ]

    for csv_name, table_name, columns in files_to_load:
        file_path = os.path.join(data_dir, csv_name)
        print(f"Loading data from {csv_name} into '{table_name}'...")
        
        with open(file_path, "r", encoding="utf-8-sig") as f:
            reader = csv.reader(f)
            headers = next(reader)  # Skip the header row
            
            rows_to_insert = []
            for row in reader:
                if not row or not any(row):
                    continue
                
                # Transform values if needed
                clean_row = []
                for idx, val in enumerate(row):
                    val_str = val.strip()
                    if val_str == "":
                        clean_row.append(None)
                    else:
                        clean_row.append(val_str)
                
                # Re-map/re-order custom fields if column orders in CSV differ from database columns
                mapped_row = []
                if csv_name == "05_komissin_ehiin_uzleg.csv":
                    # CSV: Хөтөлбөр(0), Нэр(1), ID(2), Удирдагч багш(3), Онолын судалгаа(4), Ажлын төлөвлөгөө(5), Илтгэсэн асуулт(6), Нийт(7)
                    # DB columns order: student_id, program, name, supervisor_name, score_theory_and_topic_mastery, score_plan_execution, score_presentation_and_answers, score_total
                    mapped_row = [
                        int(clean_row[2]), clean_row[0], clean_row[1], clean_row[3],
                        int(clean_row[4]), int(clean_row[5]), int(clean_row[6]), int(clean_row[7])
                    ]
                elif csv_name == "06_komissin_gishvvd_uzleg.csv":
                    # CSV: Хөтөлбөр(0), Нэр(1), ID(2), Удирдагч багш(3), М1(4), М2(5), М3(6), М4(7), Дундаж(8)
                    mapped_row = [
                        int(clean_row[2]), clean_row[0], clean_row[1], clean_row[3],
                        float(clean_row[4]), float(clean_row[5]), float(clean_row[6]), float(clean_row[7]), float(clean_row[8])
                    ]
                elif csv_name == "07_uridchilsan_hamgaalalt.csv":
                    # CSV: Хөтөлбөр(0), Нэр(1), ID(2), Удирдагч багш(3), Явц1(4), Явц2(5), С1(6), С2(7), С3(8), С4(9), Нийт(10)
                    mapped_row = [
                        int(clean_row[2]), clean_row[0], clean_row[1], clean_row[3],
                        int(clean_row[4]), int(clean_row[5]),
                        int(clean_row[6]), int(clean_row[7]), int(clean_row[8]), int(clean_row[9]), int(clean_row[10])
                    ]
                elif csv_name == "08_uridchilsan_komissin_gishvvd.csv":
                    # CSV: Хөтөлбөр(0), Нэр(1), ID(2), Удирдагч багш(3), Явц1(4), Явц2(5), М1(6), М2(7), М3(8), М4(9), Дундаж(10)
                    mapped_row = [
                        int(clean_row[2]), clean_row[0], clean_row[1], clean_row[3],
                        int(clean_row[4]), int(clean_row[5]),
                        float(clean_row[6]), float(clean_row[7]), float(clean_row[8]), float(clean_row[9]), float(clean_row[10])
                    ]
                elif csv_name == "09_jinkhene_hamgaalalt.csv":
                    # CSV: Хөтөлбөр(0), Нэр(1), ID(2), Удирдагч багш(3), С1(4), С2(5), С3(6), С4(7), С5(8), Нийт(9)
                    mapped_row = [
                        int(clean_row[2]), clean_row[0], clean_row[1], clean_row[3],
                        int(clean_row[4]), int(clean_row[5]), int(clean_row[6]), int(clean_row[7]), int(clean_row[8]), int(clean_row[9])
                    ]
                elif csv_name == "10_jinkhene_komissin_gishvvd.csv":
                    # CSV: Хөтөлбөр(0), Нэр(1), ID(2), Удирдагч багш(3), М1(4), М2(5), М3(6), М4(7), Дундаж(8)
                    mapped_row = [
                        int(clean_row[2]), clean_row[0], clean_row[1], clean_row[3],
                        float(clean_row[4]), float(clean_row[5]), float(clean_row[6]), float(clean_row[7]), float(clean_row[8])
                    ]
                elif csv_name == "03_committee_members.csv":
                    # CSV: id, committee_id, teacher_id, is_external, external_name
                    # Convert is_external 'True'/'False' string to actual python boolean
                    is_ext = clean_row[3] == "True" or clean_row[3] == "1"
                    mapped_row = [
                        int(clean_row[0]), int(clean_row[1]), 
                        int(clean_row[2]) if clean_row[2] is not None else None,
                        is_ext, clean_row[4]
                    ]
                else:
                    # For teachers, committees, and students tables, fields match exactly
                    for c_val in clean_row:
                        mapped_row.append(c_val)
                
                rows_to_insert.append(mapped_row)
            
            # Prepare insert query
            db_cols = []
            if csv_name == "05_komissin_ehiin_uzleg.csv":
                db_cols = ["student_id", "program", "name", "supervisor_name", "score_theory_and_topic_mastery", "score_plan_execution", "score_presentation_and_answers", "score_total"]
            elif csv_name == "06_komissin_gishvvd_uzleg.csv":
                db_cols = ["student_id", "program", "name", "supervisor_name", "member_1_score", "member_2_score", "member_3_score", "member_4_score", "average_score"]
            elif csv_name == "07_uridchilsan_hamgaalalt.csv":
                db_cols = ["student_id", "program", "name", "supervisor_name", "progress_1", "progress_2", "score_theory_and_topic_mastery", "score_work_done_since_review", "score_report_writing", "score_presentation_and_answers", "score_total"]
            elif csv_name == "08_uridchilsan_komissin_gishvvd.csv":
                db_cols = ["student_id", "program", "name", "supervisor_name", "progress_1", "progress_2", "member_1_score", "member_2_score", "member_3_score", "member_4_score", "average_score"]
            elif csv_name == "09_jinkhene_hamgaalalt.csv":
                db_cols = ["student_id", "program", "name", "supervisor_name", "score_novelty_and_practical_value", "score_theoretical_knowledge_and_results", "score_presentation_prep_and_delivery", "score_report_writing", "score_additional_answers", "score_total"]
            elif csv_name == "10_jinkhene_komissin_gishvvd.csv":
                db_cols = ["student_id", "program", "name", "supervisor_name", "member_1_score", "member_2_score", "member_3_score", "member_4_score", "average_score"]
            else:
                db_cols = columns
                
            placeholders = ", ".join(["%s"] * len(db_cols))
            query = f"INSERT INTO {table_name} ({', '.join(db_cols)}) VALUES ({placeholders})"
            
            cursor.executemany(query, rows_to_insert)
            print(f"Successfully loaded {len(rows_to_insert)} rows into '{table_name}'.")

def generate_and_insert_extra_tables(cursor):
    random.seed(42)
    print("\n--- Generating custom tables from loaded database ---")

    # 1. Fetch students, their level, program, name, and supervisor name/reviewer name
    query_students = """
    SELECT s.id, s.name, s.program, s.level, 
           t_sup.name as supervisor_name, t_rev.name as reviewer_name
    FROM students s
    LEFT JOIN teachers t_sup ON s.supervisor_id = t_sup.id
    LEFT JOIN teachers t_rev ON s.reviewer_id = t_rev.id;
    """
    cursor.execute(query_students)
    students = cursor.fetchall()

    reviewer_rows = []
    progress_rows = []

    for s_id, s_name, program, level, supervisor_name, reviewer_name in students:
        # A. Reviewer Evaluation score (range 3 to 5 based on level)
        if level == "EXCELLENT":
            reviewer_score = 5
        elif level == "AVERAGE":
            reviewer_score = 4
        else: # WEAK
            reviewer_score = 3

        if level == "AVERAGE" and random.random() < 0.1:
            reviewer_score = 5
        elif level == "WEAK" and random.random() < 0.15:
            reviewer_score = 4

        rev_name = reviewer_name if reviewer_name else "Шүүмжлэгч багш"
        reviewer_rows.append((s_id, program, s_name, supervisor_name, rev_name, reviewer_score))

        # B. Progress 1 Score (every student gets exactly 15 points)
        progress_score = 15

        progress_rows.append((s_id, program, s_name, supervisor_name, progress_score))

    # Insert Reviewer Evaluations
    cursor.executemany(
        """
        INSERT INTO reviewer_evaluations (student_id, program, name, supervisor_name, reviewer_name, score)
        VALUES (%s, %s, %s, %s, %s, %s);
        """,
        reviewer_rows
    )
    print(f"Generated and inserted {len(reviewer_rows)} rows into 'reviewer_evaluations' (scores 3-5).")

    # Insert Progress 1 Evaluations
    cursor.executemany(
        """
        INSERT INTO progress_1_evaluations (student_id, program, name, supervisor_name, score)
        VALUES (%s, %s, %s, %s, %s);
        """,
        progress_rows
    )
    print(f"Generated and inserted {len(progress_rows)} rows into 'progress_1_evaluations' (scores from supervisor, max 15).")

    # C. Overall Evaluations Table (Total sum max 100 points)
    query_overall = """
    INSERT INTO overall_evaluations (
        student_id, program, name, supervisor_name,
        score_progress_1, score_committee_review, score_pre_defense, score_reviewer, score_final_defense, score_total
    )
    SELECT 
        s.id as student_id,
        s.program,
        s.name,
        p1.supervisor_name,
        p1.score as score_progress_1,
        COALESCE(kg.average_score, 0) as score_committee_review,
        COALESCE(uk.average_score, 0) as score_pre_defense,
        COALESCE(re.score, 0) as score_reviewer,
        COALESCE(jk.average_score, 0) as score_final_defense,
        (
            p1.score + 
            COALESCE(kg.average_score, 0) + 
            COALESCE(uk.average_score, 0) + 
            COALESCE(re.score, 0) + 
            COALESCE(jk.average_score, 0)
        ) as score_total
    FROM students s
    JOIN progress_1_evaluations p1 ON s.id = p1.student_id
    LEFT JOIN komissin_gishvvd_uzleg kg ON s.id = kg.student_id
    LEFT JOIN uridchilsan_komissin_gishvvd uk ON s.id = uk.student_id
    LEFT JOIN reviewer_evaluations re ON s.id = re.student_id
    LEFT JOIN jinkhene_komissin_gishvvd jk ON s.id = jk.student_id;
    """
    cursor.execute(query_overall)
    print("Generated and inserted overall scores (total sum max 100) into 'overall_evaluations' successfully.")

    # D. Calculate dynamic Teacher Bias Analysis from actual scores
    print("\n--- Calculating dynamic Teacher Bias Analysis based on actual Jinkhene Komissin Gishvvd scores ---")
    
    # Fetch all committee members with their teachers and order
    cursor.execute("""
        SELECT committee_id, teacher_id, id 
        FROM committee_members 
        WHERE teacher_id IS NOT NULL 
        ORDER BY committee_id, id;
    """)
    members = cursor.fetchall()
    
    committee_teachers = defaultdict(list)
    for committee_id, teacher_id, m_id in members:
        committee_teachers[committee_id].append(teacher_id)
        
    # Fetch all students and final defense scores
    cursor.execute("""
        SELECT s.id, s.committee_id, jk.member_1_score, jk.member_2_score, jk.member_3_score, jk.member_4_score, jk.average_score
        FROM students s
        JOIN jinkhene_komissin_gishvvd jk ON s.id = jk.student_id;
    """)
    student_scores = cursor.fetchall()
    
    teacher_deviations = defaultdict(list)
    for s_id, committee_id, m1, m2, m3, m4, avg_score in student_scores:
        teachers_list = committee_teachers.get(committee_id, [])
        scores = [float(m1), float(m2), float(m3), float(m4)]
        for idx, t_id in enumerate(teachers_list):
            if idx < len(scores) and t_id is not None:
                # Deviation from the committee's average for this student
                deviation = scores[idx] - float(avg_score)
                teacher_deviations[t_id].append(deviation)
                
    # Fetch all teacher IDs
    cursor.execute("SELECT id FROM teachers;")
    all_teachers = [r[0] for r in cursor.fetchall()]
    
    final_stats = []
    evaluated_teacher_ids = set(teacher_deviations.keys())
    for t_id in all_teachers:
        if t_id in evaluated_teacher_ids:
            devs = teacher_deviations[t_id]
            count = len(devs)
            mean_bias = sum(devs) / count
            variance = sum((x - mean_bias) ** 2 for x in devs) / count
            std_dev = math.sqrt(variance)
            final_stats.append((t_id, mean_bias, std_dev, count))
        else:
            final_stats.append((t_id, 0.0, 1.0, 0))
            
    # Insert calculated stats
    cursor.executemany(
        """
        INSERT INTO teacher_bias_analysis (teacher_id, calculated_bias, calculated_std, total_evaluations)
        VALUES (%s, %s, %s, %s);
        """,
        final_stats
    )
    print(f"Successfully calculated and inserted {len(final_stats)} rows into 'teacher_bias_analysis'.")

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(script_dir, "mock _datas")
    schema_file = os.path.join(script_dir, "db_schema.sql")

    conn = get_db_connection()
    try:
        with conn:
            with conn.cursor() as cursor:
                # 1. Execute DDL Schema to create tables
                execute_ddl(cursor, schema_file)
                # 2. Load data from CSVs
                load_csv_data(cursor, data_dir)
                # 3. Generate and insert extra evaluations
                generate_and_insert_extra_tables(cursor)
                
        print("\nAll data imported successfully with proper relations and foreign keys!")
    except Exception as e:
        print(f"\nAn error occurred during import: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    main()
