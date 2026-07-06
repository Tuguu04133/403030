import psycopg2
import os
import sys

def get_db_connection():
    print("--- PostgreSQL Connection Settings ---")
    host = os.environ.get("DB_HOST", input("DB Host [localhost]: ").strip() or "localhost")
    port = os.environ.get("DB_PORT", input("DB Port [5432]: ").strip() or "5432")
    dbname = os.environ.get("DB_NAME", input("DB Name [postgres]: ").strip() or "postgres")
    user = os.environ.get("DB_USER", input("DB User [postgres]: ").strip() or "postgres")
    password = os.environ.get("DB_PASSWORD", input("DB Password: ").strip())

    try:
        conn = psycopg2.connect(
            host=host,
            port=port,
            dbname=dbname,
            user=user,
            password=password
        )
        return conn
    except Exception as e:
        print(f"\nDatabase Connection Failed: {e}")
        sys.exit(1)

def main():
    conn = get_db_connection()
    cursor = conn.cursor()

    print("\n=============================================")
    print("      POSTGRESQL DATA IMPORT VERIFICATION    ")
    print("=============================================\n")

    # 1. Count rows in all tables
    tables = [
        "teachers", "committees", "committee_members", "students",
        "komissin_ehiin_uzleg", "komissin_gishvvd_uzleg",
        "uridchilsan_hamgaalalt", "uridchilsan_komissin_gishvvd",
        "jinkhene_hamgaalalt", "jinkhene_komissin_gishvvd"
    ]

    print("--- Table Row Counts ---")
    for table in tables:
        try:
            cursor.execute(f"SELECT COUNT(*) FROM {table};")
            count = cursor.fetchone()[0]
            print(f"Table '{table:<28}': {count} rows")
        except Exception as e:
            print(f"Error reading table '{table}': {e}")
            conn.rollback()

    # 2. Test Foreign Key relations (Sample Join query)
    print("\n--- Relationship Testing (Joining Students, Supervisors & Committees) ---")
    sample_query = """
    SELECT s.id, s.name, s.program, t.name as supervisor, c.name as committee
    FROM students s
    JOIN teachers t ON s.supervisor_id = t.id
    JOIN committees c ON s.committee_id = c.id
    LIMIT 3;
    """
    try:
        cursor.execute(sample_query)
        results = cursor.fetchall()
        for row in results:
            print(f"ID: {row[0]:<3} | Student: {row[1]:<20} | Program: {row[2]:<20} | Supervisor: {row[3]:<20} | Committee: {row[4]}")
    except Exception as e:
        print(f"Relationship query failed: {e}")
        conn.rollback()

    # 3. Test Student Evaluation score join
    print("\n--- Evaluation Score Join Testing (Final Defense Sample) ---")
    score_query = """
    SELECT s.name, jh.score_total, jg.average_score
    FROM students s
    JOIN jinkhene_hamgaalalt jh ON s.id = jh.student_id
    JOIN jinkhene_komissin_gishvvd jg ON s.id = jg.student_id
    LIMIT 3;
    """
    try:
        cursor.execute(score_query)
        results = cursor.fetchall()
        for row in results:
            print(f"Student: {row[0]:<20} | Supervisor Score (35): {row[1]:<4} | Committee Avg Score (35): {row[2]}")
    except Exception as e:
        print(f"Score query failed: {e}")
        conn.rollback()

    cursor.close()
    conn.close()
    print("\n=============================================")

if __name__ == "__main__":
    main()
