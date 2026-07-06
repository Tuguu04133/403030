# GradPulse - Frontend Integration & API Documentation
## 🤖 Adviser Recommendation API

This guide provides the complete documentation, TypeScript interfaces, and Next.js / React integration examples exclusively for the *Adviser Recommendation & Thesis Subject Advisor System*.

---

### 🌐 Proposal Endpoint
*   *HTTP Method:* GET
*   *Path:* `/api/v1/recommendations/advisers`
*   *Query Parameters:*
    *   `subject` (string, required): The free-text thesis subject typed by the student (e.g. `хиймэл оюун ашиглан дүрс таних`, `RPG тоглоом`).
    *   `limit` (integer, optional): Maximum number of recommendations to return (default is `3`).

---

### 🧠 Business Logic & Calculations

1. **Subject Classification (For Teachers Match):**
   Matches incoming subject string into one of the four categories to recommend relevant teachers:
   *   **AI** -> `хиймэл оюун`, `ai`, `cnn`, `deep learning`, `царай таних`, `nlp`, `загвар`, `сургалт`
   *   **AppDev** -> `вэб`, `web`, `апп`, `app`, `erp`, `систем`, `хөгжүүлэлт`, `сайт`, `платформ`
   *   **Game** -> `тоглоом`, `game`, `vr`, `rpg`, `shooter`, `unity`
   *   **Sys** -> `сервер`, `server`, `сүлжээ`, `docker`, `cloud`, `аюулгүй байдал`, `network`, `linux`
   
   If the search subject doesn't match any keywords, it defaults to the most registered topic category of the current semester.

2. **Teacher Suitability Rating (`suitabilityScore`):**
   Calculates a suitability score (out of 100) for matching teachers:
   $$\text{Suitability} = (\text{Teacher's Average Grade Given in this field} \times 0.6) + (\text{Teacher's strictness variance factor} \times 0.4)$$

3. **Inspirational Student Theses Match (Keyword Similarity):**
   Instead of just returning the top scores in the broad category, the backend should tokenize the `subject` query and search the student database for theses matching the keywords (e.g. searching for "Basketball", "referee", "movement", "machine learning").
   *   *Sorting order:*
       1. Rank by keyword similarity score descending.
       2. Rank by total grade descending (as a tie-breaker).
   *   This ensures specific planned subjects match relevant historical thesis works.

---

### 📦 TypeScript Interfaces

```typescript
export interface RecommendedTeacher {
  teacherId: string; // e.g., "t1"
  name: string;
  expertise: string; // e.g., "AI"
  averageGradeGiven: number; // e.g., 26.5
  studentCount: number; // e.g., 12
  suitabilityScore: number; // e.g., 94.5
}

export interface InspirationalThesis {
  studentId: string; // e.g., "s1"
  name: string;
  thesisTitle: string;
  classCode: string; // e.g., "SE-26A1"
  topic: string; // e.g., "AI"
  totalGrade: number; // e.g., 95.4
}

export interface RecommendationResponse {
  detectedField: string; // e.g., "AI"
  fieldLabel: string; // e.g., "Хиймэл Оюун Ухаан (AI)"
  recommendedTeachers: RecommendedTeacher[];
  inspirationalTheses: InspirationalThesis[];
}
```

---

### 📦 React / Next.js Hook Integration Example

```typescript
import { useState } from 'react';

export function useAdviserRecommendation() {
  const [data, setData] = useState<RecommendationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRecommendations = async (subject: string, limit: number = 3) => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL('http://172.20.10.3:8000/api/v1/recommendations/advisers');
      url.searchParams.append('subject', subject);
      url.searchParams.append('limit', limit.toString());

      const res = await fetch(url.toString());
      if (!res.ok) {
        throw new Error('Failed to fetch recommendations');
      }
      const json: RecommendationResponse = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, getRecommendations };
}
```
