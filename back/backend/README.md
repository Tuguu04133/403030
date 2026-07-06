# Diploma Committee API

FastAPI + PostgreSQL дээр frontend-д REST API өгөх backend scaffold.

## Архитектур

```text
app/
  main.py                 FastAPI app, CORS, exception handlers
  core/config.py          .env тохиргоо
  db/session.py           SQLAlchemy engine/session
  models/                 PostgreSQL table models
  schemas/                Request/response Pydantic schemas
  repositories/           Database query/CRUD
  services/               Business validation
  api/v1/routers/         REST endpoints
scripts/seed_mock_data.py CSV mock data seed
```

## Entity

- `teachers`: багш, expertise, behavior, grading bias/std.
- `committees`: жил/улирал/комиссийн дугаар.
- `committee_members`: комиссийн дотоод багш эсвэл гадаад гишүүн.
- `students`: оюутан, сэдэв, ангилал, комисс, удирдагч, шүүмжлэгч.

## Асаах

```bash
cd back/backend
docker compose up -d
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

`.env` доторх `DATABASE_URL`-аа өөрийн PostgreSQL database-тай тааруулна.

## Mock data seed хийх

```bash
cd back/backend
python scripts/seed_mock_data.py
```

## REST API

Base URL: `http://localhost:8000/api/v1`

- `GET /health`
- `GET /teachers?expertise=AI&gender=F`
- `POST /teachers`
- `GET /teachers/{teacher_id}`
- `PATCH /teachers/{teacher_id}`
- `DELETE /teachers/{teacher_id}`
- `GET /committees?year=2024&semester=SPRING`
- `POST /committees`
- `GET /committees/{committee_id}` returns committee + members
- `PATCH /committees/{committee_id}`
- `DELETE /committees/{committee_id}`
- `GET /committees/{committee_id}/members`
- `POST /committees/{committee_id}/members`
- `PATCH /committees/members/{member_id}`
- `DELETE /committees/members/{member_id}`
- `GET /students?year=2024&semester=SPRING&category=AI`
- `POST /students`
- `GET /students/{student_id}` returns student + committee + teachers
- `PATCH /students/{student_id}`
- `DELETE /students/{student_id}`

## Frontend example

```ts
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1";

export async function getStudents() {
  const res = await fetch(`${API_URL}/students?year=2024&semester=SPRING`);
  if (!res.ok) throw new Error("Failed to fetch students");
  return res.json();
}
```

Swagger docs: `http://localhost:8000/docs`
