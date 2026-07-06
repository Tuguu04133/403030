import csv
import random
import os

def main():
    random.seed(42)

    # Directory path
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(script_dir, "mock _datas")

    # Load teachers
    teachers = {}
    teachers_file = os.path.join(data_dir, "01_teachers.csv")
    with open(teachers_file, "r", encoding="utf-8-sig") as f:
        for r in csv.DictReader(f):
            teachers[r["id"]] = {
                "id": r["id"],
                "name": r["name"],
                "gender": r["gender"],
                "expertise": r["expertise"],
                "behavior": r["behavior"],
                "bias": float(r["bias"]),
                "std": float(r["std"]),
                "gpref": r["gpref"],
                "gbonus": float(r["gbonus"])
            }

    # Load committee members
    committee_members = {}
    members_file = os.path.join(data_dir, "03_committee_members.csv")
    with open(members_file, "r", encoding="utf-8-sig") as f:
        for r in csv.DictReader(f):
            c_id = r["committee_id"]
            if c_id not in committee_members:
                committee_members[c_id] = []
            committee_members[c_id].append(r)

    # Load students
    students = []
    students_file = os.path.join(data_dir, "04_students.csv")
    with open(students_file, "r", encoding="utf-8-sig") as f:
        for r in csv.DictReader(f):
            students.append(r)

    def simulate_score(max_score, student_level, teacher_info, student_gender):
        if student_level == "EXCELLENT":
            base_ratio = random.uniform(0.88, 0.96)
        elif student_level == "AVERAGE":
            base_ratio = random.uniform(0.73, 0.85)
        else:  # WEAK
            base_ratio = random.uniform(0.50, 0.68)
            
        base_score = max_score * base_ratio
        
        if teacher_info:
            scale = max_score / 20.0
            scaled_bias = teacher_info["bias"] * scale
            scaled_std = teacher_info["std"] * scale
            
            score = base_score + scaled_bias
            
            if teacher_info["gpref"] == student_gender:
                scaled_gbonus = teacher_info["gbonus"] * scale
                score += scaled_gbonus
                
            noise = random.normalvariate(0, scaled_std)
            score += noise
        else:
            scale = max_score / 20.0
            scaled_std = 0.7 * scale
            score = base_score + random.normalvariate(0, scaled_std)
            
        score = max(0, min(max_score, score))
        return int(round(score))

    def get_committee_teachers(student, committee_members, teachers):
        c_id = student["committee_id"]
        supervisor_id = student["supervisor_id"]
        members_list = committee_members.get(c_id, [])
        
        evaluators = []
        for m in members_list:
            if m["is_external"] == "True":
                evaluators.append(m)
            else:
                if m["teacher_id"] != supervisor_id:
                    evaluators.append(m)
                    
        if len(evaluators) < 4:
            evaluators = members_list[:]
            
        selected = []
        for i in range(4):
            if i < len(evaluators):
                m = evaluators[i]
                if m["is_external"] == "True":
                    selected.append((m["external_name"], None))
                else:
                    t_info = teachers.get(m["teacher_id"])
                    selected.append((t_info["name"] if t_info else f"Багш {m['teacher_id']}", t_info))
            else:
                selected.append((f"Гадаад гишүүн {i+1}", None))
                
        return selected

    # Arrays to hold row data for writing
    table1_rows = []
    table2_rows = []
    table3_rows = []
    table4_rows = []
    table5_rows = []
    table6_rows = []

    for s in students:
        program = s["program"]
        name = s["name"]
        s_id = s["id"]
        gender = s["gender"]
        level = s["level"]
        
        # Get supervisor info
        sup_info = teachers.get(s["supervisor_id"])
        sup_name = sup_info["name"] if sup_info else f"Багш {s['supervisor_id']}"
        
        # Get committee members
        evaluators = get_committee_teachers(s, committee_members, teachers)
        
        # Table 1: Комиссын эхний үзлэг
        a1 = simulate_score(6, level, sup_info, gender)
        b1 = simulate_score(9, level, sup_info, gender)
        c1 = simulate_score(5, level, sup_info, gender)
        tot1 = a1 + b1 + c1
        table1_rows.append([program, name, s_id, sup_name, a1, b1, c1, tot1])
        
        # Table 2: Комиссын гишүүдийн үзлэг
        sc2 = []
        for _, t_info in evaluators:
            sc2.append(simulate_score(20, level, t_info, gender))
        avg2 = round(sum(sc2) / 4, 1)
        table2_rows.append([program, name, s_id, sup_name, *sc2, avg2])
        
        # Table 3: Урьдчилсан хамгаалалт
        y1 = simulate_score(5, level, None, gender)
        y2 = simulate_score(5, level, None, gender)
        a3 = simulate_score(6, level, sup_info, gender)
        b3 = simulate_score(9, level, sup_info, gender)
        c3 = simulate_score(5, level, sup_info, gender)
        d3 = simulate_score(5, level, sup_info, gender)
        tot3 = a3 + b3 + c3 + d3
        table3_rows.append([program, name, s_id, sup_name, y1, y2, a3, b3, c3, d3, tot3])
        
        # Table 4: Урьдчилсан хамгаалалтын гишүүд
        sc4 = []
        for _, t_info in evaluators:
            sc4.append(simulate_score(25, level, t_info, gender))
        avg4 = round(sum(sc4) / 4, 1)
        table4_rows.append([program, name, s_id, sup_name, y1, y2, *sc4, avg4])
        
        # Table 5: Жинхэнэ хамгаалалт
        a5 = simulate_score(9, level, sup_info, gender)
        b5 = simulate_score(10, level, sup_info, gender)
        c5 = simulate_score(5, level, sup_info, gender)
        d5 = simulate_score(7, level, sup_info, gender)
        e5 = simulate_score(4, level, sup_info, gender)
        tot5 = a5 + b5 + c5 + d5 + e5
        table5_rows.append([program, name, s_id, sup_name, a5, b5, c5, d5, e5, tot5])
        
        # Table 6: Жинхэнэ хамгаалалтын гишүүд
        sc6 = []
        for _, t_info in evaluators:
            sc6.append(simulate_score(35, level, t_info, gender))
        avg6 = round(sum(sc6) / 4, 1)
        table6_rows.append([program, name, s_id, sup_name, *sc6, avg6])

    def write_csv(filename, header, rows):
        path = os.path.join(data_dir, filename)
        with open(path, "w", newline="", encoding="utf-8-sig") as f:
            w = csv.writer(f)
            w.writerow(header)
            w.writerows(rows)
        print(f"Generated: {path}")

    # Headers
    h1 = ["Хөтөлбөр", "Нэр", "ID", "Удирдагч багш", 
          "Онолын судалгаа ба сэдвийг эзэмшсэн байдал (6)", 
          "Ажлын төлөвлөгөөний хэрэгжилт гүйцэтгэл (9)", 
          "Илтгэсэн асуултад харуулсан байдал (5)", "Нийт (20)"]

    h2 = ["Хөтөлбөр", "Нэр", "ID", "Удирдагч багш", 
          "Гишүүн 1 оноо", "Гишүүн 2 оноо", "Гишүүн 3 оноо", "Гишүүн 4 оноо", "Нийт дундаж (20)"]

    h3 = ["Хөтөлбөр", "Нэр", "ID", "Удирдагч багш", "Явц 1", "Явц 2", 
          "Онолын судалгаа ба сэдвийг эзэмшсэн байдал (6)", 
          "Үзлэгээс хойш гүйцэтгэсэн ажил (9)", 
          "Тайлан бичилт боловсруулалт (5)", 
          "Илтгэсэн асуултад харуулсан байдал (5)", "Нийт (25)"]

    h4 = ["Хөтөлбөр", "Нэр", "ID", "Удирдагч багш", "Явц 1", "Явц 2", 
          "Гишүүн 1 оноо", "Гишүүн 2 оноо", "Гишүүн 3 оноо", "Гишүүн 4 оноо", "Нийт дундаж (25)"]

    h5 = ["Хөтөлбөр", "Нэр", "ID", "Удирдагч багш", 
          "БСА шинэлэг тал практик ач холбогдол (9)", 
          "Онолын мэдлэг эзэмшсэн байдал ажлын гүйцэтгэл үр дүн (10)", 
          "Илтгэлийг бэлтгэсэн байдал ба илтгэсэн байдал (5)", 
          "Тайлан бичилт боловсруулалт (7)", 
          "Нэмэлт асуултад хариулсан байдал (4)", "Нийт (35)"]

    h6 = ["Хөтөлбөр", "Нэр", "ID", "Удирдагч багш", 
          "Гишүүн 1 оноо", "Гишүүн 2 оноо", "Гишүүн 3 оноо", "Гишүүн 4 оноо", 
          "Жинхэнэ хамгаалалтын нийт дундаж (35)"]

    # Write only 05_... to 10_... (non-duplicate sequence)
    write_csv("05_komissin_ehiin_uzleg.csv", h1, table1_rows)
    write_csv("06_komissin_gishvvd_uzleg.csv", h2, table2_rows)
    write_csv("07_uridchilsan_hamgaalalt.csv", h3, table3_rows)
    write_csv("08_uridchilsan_komissin_gishvvd.csv", h4, table4_rows)
    write_csv("09_jinkhene_hamgaalalt.csv", h5, table5_rows)
    write_csv("10_jinkhene_komissin_gishvvd.csv", h6, table6_rows)

if __name__ == "__main__":
    main()
