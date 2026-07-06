export interface Teacher {
  id: string;
  name: string;
  expertise: "AI" | "AppDev" | "Game" | "Sys";
  committeeId: number;
}

export interface Student {
  id: string;
  name: string;
  thesisTitle: string;
  classCode: string;
  topic: "AI" | "AppDev" | "Game" | "Sys";
  year: number;
  semester: "Намар" | "Хавар";
  committeeId: number;
  supervisorName: string;
  supervisorGrade: number; // Max 15
  firstReviewGrade: number; // Max 20
  preDefenseGrade: number; // Max 25
  reviewerName: string;
  reviewerGrade: number; // Max 5
  finalDefenseGrades: {
    teacherId: string;
    grade: number; // Max 35
  }[];
  totalScore?: number;
  totalGrade?: number;
  finalDefenseAverage?: number;
}

// 15 Teachers with varying profiles
export const TEACHERS: Teacher[] = [
  { id: "t1", name: "Доктор Б. Бат-Эрдэнэ", expertise: "AI", committeeId: 1 },
  { id: "t2", name: "Проф. С. Төмөрбат", expertise: "Sys", committeeId: 1 },
  { id: "t3", name: "Дэд проф. Г. Ганчимэг", expertise: "AppDev", committeeId: 2 },
  { id: "t4", name: "Доктор Т. Амар", expertise: "Game", committeeId: 2 },
  { id: "t5", name: "Магистр Л. Болд", expertise: "AppDev", committeeId: 3 },
  { id: "t6", name: "Доктор Н. Сүхбат", expertise: "AI", committeeId: 3 },
  { id: "t7", name: "Проф. Ж. Давааням", expertise: "Sys", committeeId: 4 },
  { id: "t8", name: "Дэд проф. М. Отгонбаяр", expertise: "Game", committeeId: 4 },
  { id: "t9", name: "Доктор Б. Энхмаа", expertise: "AI", committeeId: 5 },
  { id: "t10", name: "Магистр О. Гэрэл", expertise: "AppDev", committeeId: 5 },
  { id: "t11", name: "Доктор Ч. Баяр", expertise: "Sys", committeeId: 6 },
  { id: "t12", name: "Дэд проф. П. Алтансувд", expertise: "Game", committeeId: 7 },
  { id: "t13", name: "Проф. К. Цэцэгээ", expertise: "AI", committeeId: 8 },
  { id: "t14", name: "Доктор Р. Төгсбаяр", expertise: "Sys", committeeId: 9 },
  { id: "t15", name: "Магистр Б. Мөнхбат", expertise: "AppDev", committeeId: 9 }
];

// Names for generating students
const STUDENT_NAMES = [
  "Т. Төгөлдөр", "О. Ананд", "Б. Билгүүн", "А. Амаржаргал", "Э. Сарнай",
  "Б. Баярсайхан", "Х. Тэргэл", "С. Эрхэмбаяр", "Ж. Уянга", "М. Мөнх-Эрдэнэ",
  "Г. Золзаяа", "У. Хангал", "П. Түмэнбаяр", "Ө. Саруул", "Т. Нарангэрэл",
  "Э. Гантулга", "Н. Хулан", "Б. Төгсбилэг", "Г. Анар", "Ш. Батбаяр",
  "С. Наранбаатар", "Б. Золбоо", "Г. Ундармаа", "Д. Ганзориг", "Т. Мөнгөншагай",
  "А. Халиун", "Б. Алтансүх", "О. Батцэцэг", "М. Чинзориг", "Э. Содбилэг",
  "Б. Уранбилэг", "Д. Пүрэвдорж", "С. Дашням", "Г. Нямдорж", "Ц. Оюунболд",
  "Т. Мөнхцэцэг", "Э. Батсуурь", "Б. Сарантуяа", "Ж. Баярхүү", "Н. Алтанбагана",
  "Б. Төгөлдөрхүү", "С. Цэнд-Аюуш", "А. Бямбадорж", "Г. Саранчимэг", "Э. Төгсжаргал"
];

const AI_THESES = [
  "Гүн сургалтын загвар ашиглан дүрс таних систем",
  "Байгалийн хэл боловсруулах Монгол хэлний чатбот",
  "Анагаах ухааны зураг оношлогоонд CNN ашиглах нь",
  "Хувьцааны ханш таамаглах LSTM сүлжээний шинжилгээ",
  "Хөдөө аж ахуйн бүтээгдэхүүний өвчин илрүүлэх AI",
  "Монгол хэлнээс англи хэл рүү орчуулах Transformer загвар",
  "Гадны нөлөөтэй дуу чимээг арилгах хиймэл оюуны загвар",
  "Нисгэгчгүй тэрэгний чиглэл тодорхойлох гүн сургалт"
];

const APPDEV_THESES = [
  "Оюутны ирц бүртгэлийн царай таних хөдөлгөөнт аппликэйшн",
  "Блокчэйн технологид суурилсан цахим сонгуулийн систем",
  "Микросервис архитектурт суурилсан e-commerce платформ",
  "Барилгын материалын хангамжийн ERP вэб систем",
  "Хувийн санхүүгийн удирдлага, зөвлөгөө өгөх аппликэйшн",
  "Үл хөдлөх хөрөнгө түрээсийн зуучлалын вэб систем",
  "Аялал жуулчлалын чиглэл төлөвлөгч платформ",
  "Хоол хүргэлтийн нэгдсэн ухаалаг систем"
];

const GAME_THESES = [
  "Монголын түүхэн сэдэвт 3D RPG тоглоом хөгжүүлэлт",
  "Хиймэл оюунт дайсны зан төлөвтэй Shooter тоглоом",
  "Бага ангийн сурагчдад зориулсан математик сургах тоглоом",
  "Multiplayer амьд үлдэх тоглоомын серверийн оновчлол",
  "Физикийн хуулиудыг таниулах VR симуляцийн тоглоом",
  "Гар утсанд зориулсан 2D платформ тоглоом хөгжүүлэлт"
];

const SYS_THESES = [
  "Линукс серверийн хамгаалалт, халдлага илрүүлэх систем",
  "Docker контейнерийн ачаалал тэнцвэржүүлэгч оновчлол",
  "IoT төхөөрөмжүүдийн сүлжээний аюулгүй байдлын шинжилгээ",
  "Kubernetes орчин дахь лог цуглуулах системийн харьцуулалт",
  "Мэдээллийн нөөц хуулбар хийх автоматжуулсан систем",
  "Байгууллагын локал сүлжээний урсгалын хяналт ба шинжилгээ"
];

// Helper to seed random numbers deterministically
function seedRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// Generate deterministically random thesis student list
const generateStudents = (): Student[] => {
  const list: Student[] = [];
  const topics: ("AI" | "AppDev" | "Game" | "Sys")[] = ["AI", "AppDev", "Game", "Sys"];
  const semesters: ("Намар" | "Хавар")[] = ["Хавар", "Намар"];
  const years = [2024, 2025, 2026];

  for (let i = 0; i < STUDENT_NAMES.length; i++) {
    const seed = i + 42;
    const name = STUDENT_NAMES[i];
    
    // Choose properties based on seed
    const topic = topics[Math.floor(seedRandom(seed * 2) * topics.length)];
    const year = years[Math.floor(seedRandom(seed * 3) * years.length)];
    const semester = semesters[Math.floor(seedRandom(seed * 4) * semesters.length)];
    
    // Committee selection (1-9)
    const committeeId = ((i % 9) + 1);

    // Thesis title matching topic
    let thesisTitle = "";
    if (topic === "AI") {
      thesisTitle = AI_THESES[Math.floor(seedRandom(seed * 5) * AI_THESES.length)];
    } else if (topic === "AppDev") {
      thesisTitle = APPDEV_THESES[Math.floor(seedRandom(seed * 5) * APPDEV_THESES.length)];
    } else if (topic === "Game") {
      thesisTitle = GAME_THESES[Math.floor(seedRandom(seed * 5) * GAME_THESES.length)];
    } else {
      thesisTitle = SYS_THESES[Math.floor(seedRandom(seed * 5) * SYS_THESES.length)];
    }

    const classCode = `SE-${(year % 100)}${semester === "Хавар" ? "A" : "B"}${i % 3 + 1}`;

    // Base bias for grading (some years/semesters or students grade slightly differently)
    const baseBias = (seedRandom(seed * 6) * 5) - 2.5; // -2.5 to +2.5

    // Grades stage calculations
    // Stage 1: Supervisor (Max 15) -> Avg around 12-14
    const supervisorGrade = Math.min(15, Math.max(10, Math.round(13.2 + baseBias * 0.5)));
    
    // Stage 2: 1st Review (Max 20) -> Avg around 15-18
    const firstReviewGrade = Math.min(20, Math.max(12, Math.round(16.8 + baseBias * 0.8)));
    
    // Stage 3: Pre-defense (Max 25) -> Avg around 18-22
    const preDefenseGrade = Math.min(25, Math.max(15, Math.round(20.5 + baseBias * 1.0)));
    
    // Stage 4: Reviewer (Max 5) -> Avg around 4-5
    const reviewerGrade = Math.min(5, Math.max(3, Math.round(4.2 + baseBias * 0.2)));

    // Supervisor / Reviewer Names
    const supervisorName = TEACHERS[(i + 3) % TEACHERS.length].name;
    const reviewerName = TEACHERS[(i + 7) % TEACHERS.length].name;

    // Stage 5: Final Defense (Max 35) -> Average score from 4-6 committee teachers
    // Let's select teachers for the committee.
    // 3 from same committeeId, and 2 external teachers
    const committeeTeachers = TEACHERS.filter(t => t.committeeId === committeeId);
    const otherTeachers = TEACHERS.filter(t => t.committeeId !== committeeId);
    
    const panel: Teacher[] = [...committeeTeachers];
    // Add 2 random external teachers
    panel.push(otherTeachers[Math.floor(seedRandom(seed * 7) * otherTeachers.length)]);
    panel.push(otherTeachers[Math.floor(seedRandom(seed * 8) * otherTeachers.length)]);

    // Generate individual grades
    const finalDefenseGrades = panel.map((t, idx) => {
      // Determine this specific teacher's bias
      // Let's create a specific grading deviation for teachers:
      // Dr. Bat-Erdene is AI expert, committee 1. Strict.
      // Prof. Tumurbat is Sys, committee 1. Lenient.
      // Let's make t1, t6, t13 strict (AI/Sys)
      // Let's make t2, t10, t15 lenient
      let teacherBias = 0;
      if (t.id === "t1" || t.id === "t6" || t.id === "t13") teacherBias = -3.5;
      else if (t.id === "t3" || t.id === "t8" || t.id === "t11") teacherBias = -1.5;
      else if (t.id === "t2" || t.id === "t10" || t.id === "t15") teacherBias = 3.8;
      else if (t.id === "t5" || t.id === "t14") teacherBias = 2.0;

      // Expertise match bonus/penalty (Teacher expertise matches student topic)
      let expertiseFactor = 0;
      if (t.expertise === topic) {
        // If teacher is AI expert grading AI student, they are stricter by -2 points
        if (t.expertise === "AI") expertiseFactor = -2.2;
        // AppDev experts are more lenient by +1.8 points
        else if (t.expertise === "AppDev") expertiseFactor = 2.0;
        // Game experts are stricter by -1.2 points
        else if (t.expertise === "Game") expertiseFactor = -1.0;
        // Sys experts are strict by -1.5
        else if (t.expertise === "Sys") expertiseFactor = -1.5;
      }

      // Generate actual grade
      const randOffset = (seedRandom(seed * 9 + idx) * 3) - 1.5; // -1.5 to +1.5
      const baseGrade = 28.5 + baseBias + teacherBias + expertiseFactor + randOffset;
      const grade = Math.min(35, Math.max(18, Math.round(baseGrade)));

      return {
        teacherId: t.id,
        grade
      };
    });

    list.push({
      id: `s${i + 1}`,
      name,
      thesisTitle,
      classCode,
      topic,
      year,
      semester,
      committeeId,
      supervisorName,
      supervisorGrade,
      firstReviewGrade,
      preDefenseGrade,
      reviewerName,
      reviewerGrade,
      finalDefenseGrades
    });
  }

  return list;
};

export const STUDENTS: Student[] = generateStudents();

// -------------------------------------------------------------
// MATH & ANALYTICS COMPUTATIONS ENGINE
// -------------------------------------------------------------

export interface DashboardStats {
  totalStudents: number;
  averageGrade: number;
  maxGrade: number;
  minGrade: number;
}

export interface TopicStat {
  topic: string;
  avgGrade: number;
  count: number;
  supervisorAvg: number;
}

export interface CommitteeStat {
  committeeId: number;
  avgGrade: number;
  studentCount: number;
  variance: number; // deviation from global average
}

export interface BiasLeaderboardEntry {
  teacherId: string;
  name: string;
  expertise: string;
  deviation: number; // positive = lenient, negative = strict
  studentCount: number;
}

export interface ExpertiseImpact {
  topic: string;
  expertDev: number; // deviation when expert grades vs non-expert
}

// Global Filter Engine
export const getFilteredData = (year: number, semester: "Намар" | "Хавар") => {
  return STUDENTS.filter(s => s.year === year && s.semester === semester);
};

// Calculate total score of a student (Sum of 5 stages)
export const calculateTotalScore = (student: Student): number => {
  const finalDefenseAvg = calculateFinalDefenseAvg(student);
  return Number((student.supervisorGrade + student.firstReviewGrade + student.preDefenseGrade + student.reviewerGrade + finalDefenseAvg).toFixed(1));
};

// Calculate arithmetic average of final defense
export const calculateFinalDefenseAvg = (student: Student): number => {
  if (student.finalDefenseGrades.length === 0) return 0;
  const sum = student.finalDefenseGrades.reduce((acc, g) => acc + g.grade, 0);
  return Number((sum / student.finalDefenseGrades.length).toFixed(1));
};

// 1. KPI Widgets Engine
export const getKPIStats = (filteredStudents: Student[]): DashboardStats => {
  if (filteredStudents.length === 0) {
    return { totalStudents: 0, averageGrade: 0, maxGrade: 0, minGrade: 0 };
  }

  const scores = filteredStudents.map(s => calculateTotalScore(s));
  const total = scores.length;
  const sum = scores.reduce((acc, score) => acc + score, 0);
  const avg = Number((sum / total).toFixed(1));
  const max = Math.max(...scores);
  const min = Math.min(...scores);

  return {
    totalStudents: total,
    averageGrade: avg,
    maxGrade: max,
    minGrade: min
  };
};

// 2. Topic Analytics Engine (Dual bar chart details)
export const getTopicAnalytics = (filteredStudents: Student[]): TopicStat[] => {
  const topics: ("AI" | "AppDev" | "Game" | "Sys")[] = ["AI", "AppDev", "Game", "Sys"];
  
  return topics.map(topic => {
    const list = filteredStudents.filter(s => s.topic === topic);
    if (list.length === 0) {
      return { topic, avgGrade: 0, count: 0, supervisorAvg: 0 };
    }
    const totalDefense = list.reduce((acc, s) => acc + calculateTotalScore(s), 0);
    const totalSupervisor = list.reduce((acc, s) => acc + s.supervisorGrade, 0);
    
    return {
      topic,
      avgGrade: Number((totalDefense / list.length).toFixed(1)),
      count: list.length,
      supervisorAvg: Number((totalSupervisor / list.length).toFixed(1))
    };
  });
};

// 3. Committee Variance Tracker Engine
export const getCommitteeVariance = (filteredStudents: Student[], globalAvg: number): CommitteeStat[] => {
  const stats: CommitteeStat[] = [];
  
  for (let i = 1; i <= 9; i++) {
    const list = filteredStudents.filter(s => s.committeeId === i);
    if (list.length === 0) {
      stats.push({ committeeId: i, avgGrade: 0, studentCount: 0, variance: 0 });
      continue;
    }
    const sum = list.reduce((acc, s) => acc + calculateTotalScore(s), 0);
    const avg = Number((sum / list.length).toFixed(1));
    const variance = Number((avg - globalAvg).toFixed(1));
    
    stats.push({
      committeeId: i,
      avgGrade: avg,
      studentCount: list.length,
      variance
    });
  }
  
  return stats;
};

// 4. Strict vs Lenient Leaderboards (Deviation from peer-average)
// For each student graded by a teacher, we compare the score given by this teacher to the average score given by other teachers for the same student.
export const getTeacherLeaderboard = (filteredStudents: Student[]): { strict: BiasLeaderboardEntry[], lenient: BiasLeaderboardEntry[] } => {
  const teacherDeviations: { [teacherId: string]: { sum: number; count: number } } = {};
  
  filteredStudents.forEach(student => {
    const finalGrades = student.finalDefenseGrades;
    if (finalGrades.length <= 1) return;
    
    finalGrades.forEach(gradeObj => {
      const { teacherId, grade } = gradeObj;
      // Get the sum and count of other teachers' grades
      const otherGrades = finalGrades.filter(g => g.teacherId !== teacherId);
      const otherAvg = otherGrades.reduce((sum, g) => sum + g.grade, 0) / otherGrades.length;
      const deviation = grade - otherAvg;
      
      if (!teacherDeviations[teacherId]) {
        teacherDeviations[teacherId] = { sum: 0, count: 0 };
      }
      teacherDeviations[teacherId].sum += deviation;
      teacherDeviations[teacherId].count += 1;
    });
  });

  const entries: BiasLeaderboardEntry[] = TEACHERS.map(t => {
    const devRecord = teacherDeviations[t.id];
    const dev = devRecord && devRecord.count > 0 ? Number((devRecord.sum / devRecord.count).toFixed(1)) : 0;
    return {
      teacherId: t.id,
      name: t.name,
      expertise: t.expertise,
      deviation: dev,
      studentCount: devRecord ? devRecord.count : 0
    };
  }).filter(entry => entry.studentCount > 0); // Only teachers who actually graded students in this period

  // Sort strict (lowest deviation) and lenient (highest deviation)
  const strict = [...entries].sort((a, b) => a.deviation - b.deviation).slice(0, 3);
  const lenient = [...entries].sort((a, b) => b.deviation - a.deviation).slice(0, 3);

  return { strict, lenient };
};

// 5. Expertise Impact Index
// Computes deviation of expert grades vs non-expert grades for each topic category
export const getExpertiseImpact = (filteredStudents: Student[]): ExpertiseImpact[] => {
  const topics: ("AI" | "AppDev" | "Game" | "Sys")[] = ["AI", "AppDev", "Game", "Sys"];
  
  return topics.map(topic => {
    let expertSum = 0;
    let expertCount = 0;
    let nonExpertSum = 0;
    let nonExpertCount = 0;

    filteredStudents.filter(s => s.topic === topic).forEach(student => {
      student.finalDefenseGrades.forEach(gObj => {
        const teacher = TEACHERS.find(t => t.id === gObj.teacherId);
        if (!teacher) return;
        
        if (teacher.expertise === topic) {
          expertSum += gObj.grade;
          expertCount++;
        } else {
          nonExpertSum += gObj.grade;
          nonExpertCount++;
        }
      });
    });

    const expertAvg = expertCount > 0 ? expertSum / expertCount : 0;
    const nonExpertAvg = nonExpertCount > 0 ? nonExpertSum / nonExpertCount : 0;
    const impact = expertCount > 0 && nonExpertCount > 0 ? Number((expertAvg - nonExpertAvg).toFixed(1)) : 0;

    return {
      topic,
      expertDev: impact
    };
  });
};

// 6. Teacher Profile Stats & Grade Distribution Curve
export interface TeacherProfile {
  teacher: Teacher;
  studentCount: number;
  averageGradeGiven: number;
  distribution: number[]; // Count of grades in buckets: 18-21, 22-25, 26-28, 29-31, 32-35
}

export const getTeacherProfile = (teacherId: string, filteredStudents: Student[]): TeacherProfile | null => {
  const teacher = TEACHERS.find(t => t.id === teacherId);
  if (!teacher) return null;

  const gradesGiven: number[] = [];

  filteredStudents.forEach(student => {
    const gradeObj = student.finalDefenseGrades.find(g => g.teacherId === teacherId);
    if (gradeObj) {
      gradesGiven.push(gradeObj.grade);
    }
  });

  const studentCount = gradesGiven.length;
  const averageGradeGiven = studentCount > 0 
    ? Number((gradesGiven.reduce((sum, g) => sum + g, 0) / studentCount).toFixed(1)) 
    : 0;

  // Grade buckets: 18-21, 22-25, 26-28, 29-31, 32-35
  const distribution = [0, 0, 0, 0, 0];
  gradesGiven.forEach(g => {
    if (g >= 18 && g <= 21) distribution[0]++;
    else if (g >= 22 && g <= 25) distribution[1]++;
    else if (g >= 26 && g <= 28) distribution[2]++;
    else if (g >= 29 && g <= 31) distribution[3]++;
    else if (g >= 32 && g <= 35) distribution[4]++;
  });

  return {
    teacher,
    studentCount,
    averageGradeGiven,
    distribution
  };
};
